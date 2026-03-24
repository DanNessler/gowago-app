import { Link } from 'react-router-dom'
import GowagoLogo from '../ui/GowagoLogo'

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white rounded-t-[4rem] mt-4 pt-16 pb-8 px-8 md:px-16">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-12 border-b border-zinc-800">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <div className="mb-4">
              <GowagoLogo height={22} color="#ffffff" />
              <p className="text-zinc-400 text-sm mt-2 max-w-xs leading-relaxed">
                Switzerland's premier digital car leasing marketplace. Premium cars, transparent pricing, zero hassle.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              {['facebook', 'instagram', 'x'].map(platform => (
                <button
                  key={platform}
                  className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-primary transition-colors flex items-center justify-center cursor-pointer"
                  aria-label={platform}
                >
                  <span className="material-symbols-outlined text-zinc-300" style={{ fontSize: '18px' }}>
                    {platform === 'x' ? 'close' : platform === 'facebook' ? 'thumb_up' : 'photo_camera'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">About Us</h4>
            <ul className="space-y-3">
              {['Our Story', 'Careers', 'Press', 'Partners'].map(item => (
                <li key={item}>
                  <Link to="/" className="text-zinc-400 hover:text-white text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'AGB'].map(item => (
                <li key={item}>
                  <Link to="/" className="text-zinc-400 hover:text-white text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-3">
              {['Contact Us', 'Help Center', 'Safety Info', 'FAQ'].map(item => (
                <li key={item}>
                  <Link to="/" className="text-zinc-400 hover:text-white text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-zinc-500 text-sm">
          <p>© 2024 gowago AG — All rights reserved</p>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors cursor-pointer">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>language</span>
              English (CH)
            </button>
            <button className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors cursor-pointer">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>payments</span>
              CHF
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
