import { motion, AnimatePresence } from 'framer-motion'
import useSearchStore from '../../store/useSearchStore'

export default function FilterChips() {
  const { filters, toggleArrayFilter, setFilter, clearFilters } = useSearchStore()

  const chips = [
    ...filters.make.map(v => ({ label: v, key: 'make', value: v })),
    ...filters.bodyType.map(v => ({ label: v, key: 'bodyType', value: v })),
    ...filters.fuel.map(v => ({ label: v, key: 'fuel', value: v })),
    ...(filters.maxPrice ? [{ label: `Under CHF ${filters.maxPrice}`, key: 'maxPrice', value: null }] : []),
    ...(filters.available ? [{ label: 'Available only', key: 'available', value: false }] : []),
  ]

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AnimatePresence>
        {chips.map(chip => (
          <motion.button
            key={`${chip.key}-${chip.value}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => {
              if (chip.key === 'maxPrice' || chip.key === 'available') {
                setFilter(chip.key, chip.value)
              } else {
                toggleArrayFilter(chip.key, chip.value)
              }
            }}
            className="flex items-center gap-1.5 bg-primary text-white px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer hover:bg-primary-container transition-colors"
          >
            {chip.label}
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
          </motion.button>
        ))}
      </AnimatePresence>

      {chips.length > 1 && (
        <button
          onClick={clearFilters}
          className="text-sm text-on-surface-variant hover:text-primary cursor-pointer underline underline-offset-2 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
