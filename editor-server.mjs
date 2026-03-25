import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3099;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...CORS_HEADERS });
  res.end(JSON.stringify(body));
}

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { cwd, env: { ...process.env, PATH: process.env.PATH } }, (err, stdout, stderr) => {
      if (err) reject(new Error(stderr || stdout || err.message));
      else resolve(stdout.trim());
    });
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  // Serve editor UI
  if (req.method === 'GET' && req.url === '/') {
    const htmlPath = path.resolve(__dirname, '..', 'car-editor.html');
    try {
      const html = fs.readFileSync(htmlPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', ...CORS_HEADERS });
      res.end(html);
    } catch (e) {
      json(res, 500, { ok: false, error: `Could not read car-editor.html: ${e.message}` });
    }
    return;
  }

  // Save endpoint
  if (req.method === 'POST' && req.url === '/save') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { cars, content, images } = JSON.parse(body);
        if (cars != null) {
          const p = path.resolve(__dirname, 'src', 'data', 'cars.js');
          fs.mkdirSync(path.dirname(p), { recursive: true });
          fs.writeFileSync(p, cars, 'utf8');
        }
        if (content != null) {
          const p = path.resolve(__dirname, 'src', 'data', 'content.js');
          fs.mkdirSync(path.dirname(p), { recursive: true });
          fs.writeFileSync(p, content, 'utf8');
        }
        if (images && typeof images === 'object') {
          const dir = path.resolve(__dirname, 'public', 'images');
          fs.mkdirSync(dir, { recursive: true });
          for (const [filename, b64] of Object.entries(images)) {
            fs.writeFileSync(path.join(dir, path.basename(filename)), Buffer.from(b64, 'base64'));
          }
        }
        json(res, 200, { ok: true });
      } catch (e) {
        json(res, 500, { ok: false, error: e.message });
      }
    });
    req.on('error', e => json(res, 500, { ok: false, error: e.message }));
    return;
  }

  // Deploy endpoint — save + build + git commit/push + vercel --prod, streams log lines as NDJSON
  if (req.method === 'POST' && req.url === '/deploy') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      res.writeHead(200, {
        'Content-Type': 'application/x-ndjson',
        'Transfer-Encoding': 'chunked',
        ...CORS_HEADERS,
      });

      const log = (msg, type = 'log') => res.write(JSON.stringify({ type, msg }) + '\n');

      try {
        // 1. Write files
        const { cars, content, images } = JSON.parse(body);
        if (cars != null) {
          const p = path.resolve(__dirname, 'src', 'data', 'cars.js');
          fs.mkdirSync(path.dirname(p), { recursive: true });
          fs.writeFileSync(p, cars, 'utf8');
        }
        if (content != null) {
          const p = path.resolve(__dirname, 'src', 'data', 'content.js');
          fs.mkdirSync(path.dirname(p), { recursive: true });
          fs.writeFileSync(p, content, 'utf8');
        }
        if (images && typeof images === 'object') {
          const dir = path.resolve(__dirname, 'public', 'images');
          fs.mkdirSync(dir, { recursive: true });
          for (const [filename, b64] of Object.entries(images)) {
            fs.writeFileSync(path.join(dir, path.basename(filename)), Buffer.from(b64, 'base64'));
          }
        }
        log('✓ Files saved');

        // 2. Build
        log('Building...');
        await run('npm', ['run', 'build'], __dirname);
        log('✓ Build complete');

        // 3. Git commit & push
        log('Committing...');
        const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
        await run('git', ['add', 'src/data/cars.js', 'src/data/content.js', 'public/images'], __dirname);

        // Check if there's anything to commit
        const status = await run('git', ['status', '--porcelain', 'src/data/cars.js', 'src/data/content.js'], __dirname);
        if (status) {
          await run('git', ['commit', '-m', `content: editor update ${now}`], __dirname);
          log('✓ Committed');
          await run('git', ['push'], __dirname);
          log('✓ Pushed to GitHub');
        } else {
          log('~ No content changes to commit');
        }

        // 4. Vercel deploy
        log('Deploying to Vercel...');
        const vercelBin = path.resolve(__dirname, '..', 'node_modules', '.bin', 'vercel');
        // Find vercel in PATH
        const vercelOut = await run('vercel', ['--prod', '--force'], __dirname).catch(() =>
          run(path.join(process.env.HOME, '.npm-global/bin/vercel'), ['--prod', '--force'], __dirname)
        );
        const urlMatch = vercelOut.match(/https:\/\/\S+\.vercel\.app/);
        const liveUrl = urlMatch ? urlMatch[0] : 'https://gowago-app.vercel.app';
        log(`✓ Live at ${liveUrl}`, 'done');

      } catch (e) {
        log(`✗ ${e.message}`, 'error');
      }

      res.end();
    });
    req.on('error', e => { res.end(JSON.stringify({ type: 'error', msg: e.message }) + '\n'); });
    return;
  }

  json(res, 404, { ok: false, error: 'Not found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Editor server running at http://localhost:${PORT}`);
  console.log(`  Open http://localhost:${PORT} in your browser to edit content`);
  console.log(`  Press Ctrl+C to stop`);
});
