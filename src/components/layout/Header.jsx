import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import useSearchStore from '../../store/useSearchStore'
import GowagoLogo from '../ui/GowagoLogo'


export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const isSearch = location.pathname === '/search'

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-4 left-4 right-4 z-50 glass-nav rounded-full shadow-playful border border-white/20 px-4 py-2.5"
    >
      <div className="flex items-center justify-between gap-4 max-w-[1440px] mx-auto">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <GowagoLogo height={18} color="#571295" />
        </Link>

        {/* Centre: compact search pill on search page only */}
        {isSearch && <CompactSearchPill />}

        {/* Right: menu + account */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 border border-outline-variant rounded-full pl-4 pr-1.5 py-1.5 hover:border-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '20px' }}>menu</span>
          <span className="material-symbols-filled text-primary" style={{ fontSize: '28px' }}>account_circle</span>
        </button>
      </div>
    </motion.header>
  )
}

function CompactSearchPill() {
  const navigate = useNavigate()
  const { filters, toggleArrayFilter, clearFilters } = useSearchStore()
  const [open, setOpen] = useState(false)

  const activeType = filters.bodyType?.[0] || null
  const activeMax = filters.maxPrice ? `Under CHF ${filters.maxPrice}` : null
  const hasFilters = filters.make.length > 0 || filters.bodyType.length > 0 || filters.fuel.length > 0 || filters.maxPrice

  return (
    <div className="flex items-center gap-1 bg-surface-container-low rounded-full px-3 py-1.5 text-sm">
      <button
        onClick={() => navigate('/search')}
        className="text-on-surface font-medium hover:text-primary transition-colors cursor-pointer px-1"
      >
        {activeType || 'All cars'}
      </button>
      <span className="text-outline-variant">|</span>
      <button
        onClick={() => navigate('/search')}
        className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer px-1"
      >
        {activeMax || 'Any budget'}
      </button>
      <span className="text-outline-variant">|</span>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 cursor-pointer px-2 py-0.5 rounded-full transition-all ${hasFilters ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-primary'}`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>tune</span>
        <span>Filters</span>
      </button>
    </div>
  )
}
