import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CAR_SUGGESTIONS } from '../../data/makes'
import useSearchStore from '../../store/useSearchStore'

export default function SearchBar({ large = false, dropUp = false }) {
  const navigate = useNavigate()
  const { query, setQuery, runSearch } = useSearchStore()
  const [input, setInput] = useState(query || '')
  const [suggestions, setSuggestions] = useState([])
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef(null)

  const getSuggestions = (val) => {
    if (!val.trim()) return []
    const v = val.toLowerCase()
    return CAR_SUGGESTIONS.filter(s => s.toLowerCase().includes(v)).slice(0, 6)
  }

  const handleChange = (e) => {
    const val = e.target.value
    setInput(val)
    setSuggestions(getSuggestions(val))
    setActiveIndex(-1)
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    const q = activeIndex >= 0 ? suggestions[activeIndex] : input
    setInput(q)
    runSearch(q)
    setSuggestions([])
    setFocused(false)
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  const handleSelect = (suggestion) => {
    setInput(suggestion)
    runSearch(suggestion)
    setSuggestions([])
    setFocused(false)
    navigate(`/search?q=${encodeURIComponent(suggestion)}`)
  }

  const handleKeyDown = (e) => {
    if (!suggestions.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === 'Escape') {
      setSuggestions([])
    }
  }

  const showDropdown = focused && suggestions.length > 0

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex items-center gap-3 bg-white rounded-full shadow-playful border-2 transition-all ${focused ? 'border-primary shadow-[0_0_0_4px_rgba(87,18,149,0.08)]' : 'border-transparent'} ${large ? 'px-6 py-4' : 'px-4 py-3'}`}>
          <span className="material-symbols-outlined text-outline flex-shrink-0" style={{ fontSize: large ? '24px' : '20px' }}>
            search
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder="Ford SUV, Sedan, Electric..."
            className={`flex-1 bg-transparent outline-none text-on-surface placeholder-outline ${large ? 'text-lg' : 'text-base'}`}
            aria-label="Search for cars"
            aria-autocomplete="list"
            aria-expanded={showDropdown}
          />
          <motion.button
            type="submit"
            className={`flex-shrink-0 bg-primary text-white rounded-full font-semibold cursor-pointer whitespace-nowrap ${large ? 'px-8 py-3 text-base' : 'px-5 py-2 text-sm'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            Find your ride
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.ul
            initial={{ opacity: 0, y: dropUp ? 8 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dropUp ? 8 : -8 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-0 right-0 bg-white rounded-[2rem] shadow-playful overflow-hidden z-50 border border-outline-variant ${dropUp ? 'bottom-full mb-2' : 'top-full mt-2'}`}
            role="listbox"
          >
            {suggestions.map((s, i) => (
              <li
                key={s}
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={() => handleSelect(s)}
                className={`flex items-center gap-3 px-6 py-3.5 cursor-pointer transition-colors ${i === activeIndex ? 'bg-pastel-purple' : 'hover:bg-surface-container-low'}`}
              >
                <span className="material-symbols-outlined text-outline" style={{ fontSize: '18px' }}>search</span>
                <span className="text-on-surface text-sm">{s}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
