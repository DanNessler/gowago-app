import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useSearchStore from '../../store/useSearchStore'

const badgeColors = {
  'Hot Deal': 'bg-tertiary-container text-on-tertiary',
  'New Arrival': 'bg-primary-container text-on-primary',
  'Popular Pick': 'bg-secondary text-on-primary',
  'Performance': 'bg-on-surface text-surface',
}

function CarCard({ car }) {
  const navigate = useNavigate()
  const { favourites, toggleFavourite } = useSearchStore()
  const isFav = favourites.includes(car.id)

  return (
    <motion.article
      onClick={() => navigate(`/car/${car.id}`)}
      className="group cursor-pointer flex flex-col"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image container */}
      <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] bg-surface-container mb-4">
        <img
          src={car.image}
          alt={`${car.year} ${car.make} ${car.model}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge */}
        {car.badge && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${badgeColors[car.badge] || 'bg-white text-on-surface'}`}>
            {car.badge}
          </div>
        )}

        {/* Favourite button */}
        <button
          onClick={e => { e.stopPropagation(); toggleFavourite(car.id) }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-ambient cursor-pointer"
          aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
        >
          <span
            className={`text-lg ${isFav ? 'material-symbols-filled text-tertiary' : 'material-symbols-outlined text-on-surface-variant'}`}
            style={{ fontSize: '20px', fontFamily: 'Material Symbols Outlined', fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>

        {/* Availability overlay */}
        {!car.available && (
          <div className="absolute inset-0 bg-black/40 rounded-[2rem] flex items-center justify-center">
            <span className="bg-white text-on-surface text-sm font-semibold px-4 py-2 rounded-full">Not Available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-1">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold text-on-surface text-base leading-tight">
            {car.make} {car.model}
          </h3>
        </div>

        <p className="text-on-surface-variant text-sm mb-2">
          {car.year} · {car.fuel} · {car.transmission}
        </p>

        <div className="flex items-center gap-1 mb-3">
          <span className="material-symbols-filled text-[#FBBF24]" style={{ fontSize: '16px', fontFamily: 'Material Symbols Outlined', fontVariationSettings: "'FILL' 1" }}>star</span>
          <span className="text-sm font-medium text-on-surface">{car.rating}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-on-surface-variant">from</span>
            <div className="font-bold text-on-surface text-lg leading-tight">
              CHF {car.pricePerMonth.toLocaleString('de-CH')}.-
              <span className="text-sm font-normal text-on-surface-variant">/month</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-playful">
            <span className="material-symbols-outlined text-white" style={{ fontSize: '18px' }}>arrow_forward</span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default memo(CarCard)
