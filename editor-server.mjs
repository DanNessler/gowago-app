import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3099;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json', ...CORS_HEADERS });
  res.end(payload);
}

const server = http.createServer((req, res) => {
  // CORS preflight
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
          const carsPath = path.resolve(__dirname, 'src', 'data', 'cars.js');
          fs.mkdirSync(path.dirname(carsPath), { recursive: true });
          fs.writeFileSync(carsPath, cars, 'utf8');
        }

        if (content != null) {
          const contentPath = path.resolve(__dirname, 'src', 'data', 'content.js');
          fs.mkdirSync(path.dirname(contentPath), { recursive: true });
          fs.writeFileSync(contentPath, content, 'utf8');
        }

        if (images && typeof images === 'object') {
          const imagesDir = path.resolve(__dirname, 'public', 'images');
          fs.mkdirSync(imagesDir, { recursive: true });
          for (const [filename, b64] of Object.entries(images)) {
            const safeName = path.basename(filename); // prevent path traversal
            const imgPath = path.join(imagesDir, safeName);
            fs.writeFileSync(imgPath, Buffer.from(b64, 'base64'));
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

  json(res, 404, { ok: false, error: 'Not found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Editor server running at http://localhost:${PORT}`);
  console.log(`  Open http://localhost:${PORT} in your browser to edit content`);
  console.log(`  Press Ctrl+C to stop`);
});
