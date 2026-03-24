import { create } from 'zustand'
import { cars } from '../data/cars'

const filterCars = (query, filters) => {
  let results = [...cars]

  if (query) {
    const q = query.toLowerCase()
    // Handle price range queries
    if (q.includes('under chf')) {
      const match = q.match(/under chf (\d+)/)
      if (match) {
        const max = parseInt(match[1])
        results = results.filter(c => c.pricePerMonth <= max)
      }
    } else if (q.includes('luxury over')) {
      const match = q.match(/over chf (\d+)/)
      if (match) {
        const min = parseInt(match[1])
        results = results.filter(c => c.pricePerMonth >= min)
      }
    } else {
      results = results.filter(c =>
        c.make.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        c.fuel.toLowerCase().includes(q) ||
        `${c.make} ${c.model}`.toLowerCase().includes(q)
      )
    }
  }

  if (filters.make && filters.make.length > 0) {
    results = results.filter(c => filters.make.includes(c.make))
  }
  if (filters.bodyType && filters.bodyType.length > 0) {
    results = results.filter(c => filters.bodyType.includes(c.type))
  }
  if (filters.fuel && filters.fuel.length > 0) {
    results = results.filter(c => filters.fuel.includes(c.fuel))
  }
  if (filters.maxPrice) {
    results = results.filter(c => c.pricePerMonth <= filters.maxPrice)
  }
  if (filters.minPrice) {
    results = results.filter(c => c.pricePerMonth >= filters.minPrice)
  }
  if (filters.available) {
    results = results.filter(c => c.available)
  }

  switch (filters.sortBy) {
    case 'price-asc':
      results.sort((a, b) => a.pricePerMonth - b.pricePerMonth)
      break
    case 'price-desc':
      results.sort((a, b) => b.pricePerMonth - a.pricePerMonth)
      break
    case 'newest':
      results.sort((a, b) => b.year - a.year)
      break
    default:
      // relevance — keep original order
      break
  }

  return results
}

const useSearchStore = create((set, get) => ({
  query: '',
  filters: {
    make: [],
    bodyType: [],
    fuel: [],
    maxPrice: null,
    minPrice: null,
    available: false,
    sortBy: 'relevance',
  },
  results: [...cars],
  favourites: [],

  setQuery: (query) => {
    const { filters } = get()
    set({ query, results: filterCars(query, filters) })
  },

  setFilter: (key, value) => {
    const { query, filters } = get()
    const newFilters = { ...filters, [key]: value }
    set({ filters: newFilters, results: filterCars(query, newFilters) })
  },

  toggleArrayFilter: (key, value) => {
    const { query, filters } = get()
    const current = filters[key] || []
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    const newFilters = { ...filters, [key]: updated }
    set({ filters: newFilters, results: filterCars(query, newFilters) })
  },

  clearFilters: () => {
    const { query } = get()
    const defaultFilters = {
      make: [], bodyType: [], fuel: [],
      maxPrice: null, minPrice: null,
      available: false, sortBy: 'relevance',
    }
    set({ filters: defaultFilters, results: filterCars(query, defaultFilters) })
  },

  runSearch: (query) => {
    const { filters } = get()
    set({ query, results: filterCars(query, filters) })
  },

  toggleFavourite: (carId) => {
    const { favourites } = get()
    set({
      favourites: favourites.includes(carId)
        ? favourites.filter(id => id !== carId)
        : [...favourites, carId]
    })
  },
}))

export default useSearchStore
