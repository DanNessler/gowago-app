import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import CarCard from '../components/ui/CarCard'
import FilterChips from '../components/ui/FilterChips'
import useSearchStore from '../store/useSearchStore'

const MAKES = ['Audi', 'BMW', 'Mercedes', 'Porsche', 'Tesla', 'Volkswagen', 'Volvo', 'MINI', 'Mazda', 'Toyota']
const BODY_TYPES = ['Sedan', 'SUV', 'Convertible', 'Coupe', 'Wagon']
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid']

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const { query, results, filters, runSearch, toggleArrayFilter, setFilter, clearFilters } = useSearchStore()
  const [visibleCount, setVisibleCount] = useState(12)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const q = searchParams.get('q') || ''
    runSearch(q)
  }, [searchParams])

  const visible = results.slice(0, visibleCount)

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-32 pb-24 px-6 md:px-8 max-w-[1440px] mx-auto">

        {/* Title */}
        <div className="mb-6">
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-on-surface">
            <span className="text-primary">{results.length}</span> cars found
            {query && <span> for "{query}"</span>}
          </h1>
        </div>

        {/* Sort + Filter controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <FilterChips />

          <div className="flex items-center gap-3 ml-auto">
            <select
              value={filters.sortBy}
              onChange={e => setFilter('sortBy', e.target.value)}
              className="bg-white border border-outline-variant rounded-full px-4 py-2 text-sm text-on-surface outline-none cursor-pointer hover:border-primary transition-colors"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest first</option>
            </select>

            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 bg-on-surface text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>tune</span>
              Filters
            </button>
          </div>
        </div>

        {/* Car Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((car, i) => (
              <motion.div
                key={car.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i < 12 ? i * 0.04 : 0, duration: 0.3 }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {results.length === 0 && (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-outline mb-4 block" style={{ fontSize: '64px' }}>search_off</span>
            <h2 className="font-headline font-bold text-2xl text-on-surface mb-2">No cars found</h2>
            <p className="text-on-surface-variant mb-6">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="bg-primary text-white px-6 py-3 rounded-full font-semibold cursor-pointer hover:bg-primary-container transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Show more */}
        {visibleCount < results.length && (
          <div className="text-center mt-16">
            <p className="text-on-surface-variant text-sm mb-4">
              Showing {Math.min(visibleCount, results.length)} of {results.length} cars
            </p>
            <button
              onClick={() => setVisibleCount(c => c + 12)}
              className="inline-flex items-center gap-2 border-2 border-outline-variant text-on-surface px-8 py-4 rounded-full font-semibold hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
              Show more
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>expand_more</span>
            </button>
          </div>
        )}
      </main>

      {/* Filter Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 overflow-y-auto shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-headline font-bold text-2xl">Filters</h2>
                  <button onClick={() => setDrawerOpen(false)} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center cursor-pointer">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                  </button>
                </div>

                {/* Make */}
                <FilterSection title="Make">
                  {MAKES.map(make => (
                    <CheckboxItem
                      key={make}
                      label={make}
                      checked={filters.make.includes(make)}
                      onChange={() => toggleArrayFilter('make', make)}
                    />
                  ))}
                </FilterSection>

                {/* Body Type */}
                <FilterSection title="Body Type">
                  {BODY_TYPES.map(type => (
                    <CheckboxItem
                      key={type}
                      label={type}
                      checked={filters.bodyType.includes(type)}
                      onChange={() => toggleArrayFilter('bodyType', type)}
                    />
                  ))}
                </FilterSection>

                {/* Fuel */}
                <FilterSection title="Fuel Type">
                  {FUEL_TYPES.map(fuel => (
                    <CheckboxItem
                      key={fuel}
                      label={fuel}
                      checked={filters.fuel.includes(fuel)}
                      onChange={() => toggleArrayFilter('fuel', fuel)}
                    />
                  ))}
                </FilterSection>

                {/* Budget */}
                <FilterSection title="Budget">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-on-surface-variant">
                      <span>Max: CHF {(filters.maxPrice || 2000).toLocaleString('de-CH')}</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="2000"
                      step="50"
                      value={filters.maxPrice || 2000}
                      onChange={e => setFilter('maxPrice', parseInt(e.target.value) === 2000 ? null : parseInt(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-outline">
                      <span>CHF 200</span>
                      <span>CHF 2,000</span>
                    </div>
                  </div>
                </FilterSection>

                {/* Availability */}
                <FilterSection title="Availability">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.available}
                      onChange={e => setFilter('available', e.target.checked)}
                      className="w-5 h-5 accent-primary rounded"
                    />
                    <span className="text-sm text-on-surface">Available now only</span>
                  </label>
                </FilterSection>

                {/* Actions */}
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => { clearFilters(); setDrawerOpen(false) }}
                    className="flex-1 border-2 border-outline-variant text-on-surface py-3 rounded-full font-semibold cursor-pointer hover:border-primary hover:text-primary transition-colors"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="flex-1 bg-primary text-white py-3 rounded-full font-semibold cursor-pointer hover:bg-primary-container transition-colors"
                  >
                    Apply filters
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

function FilterSection({ title, children }) {
  return (
    <div className="mb-8">
      <h3 className="font-semibold text-on-surface mb-4 pb-2 border-b border-outline-variant">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function CheckboxItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 accent-primary rounded"
      />
      <span className={`text-sm transition-colors ${checked ? 'text-primary font-medium' : 'text-on-surface group-hover:text-primary'}`}>
        {label}
      </span>
    </label>
  )
}
