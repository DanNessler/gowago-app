import { useRef } from 'react'
import { motion } from 'framer-motion'
import CarCard from './CarCard'

export default function CarSlider({ cars, title, subtitle }) {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 420, behavior: 'smooth' })
    }
  }

  return (
    <div>
      {(title || subtitle) && (
        <div className="flex items-end justify-between mb-6 px-2">
          <div>
            {title && <h2 className="font-headline font-bold text-2xl md:text-3xl text-on-surface">{title}</h2>}
            {subtitle && <p className="text-on-surface-variant mt-1">{subtitle}</p>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-full bg-white shadow-ambient flex items-center justify-center hover:shadow-playful transition-shadow cursor-pointer"
              aria-label="Scroll left"
            >
              <span className="material-symbols-outlined text-on-surface" style={{ fontSize: '20px' }}>arrow_back</span>
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-full bg-white shadow-ambient flex items-center justify-center hover:shadow-playful transition-shadow cursor-pointer"
              aria-label="Scroll right"
            >
              <span className="material-symbols-outlined text-on-surface" style={{ fontSize: '20px' }}>arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto no-scrollbar pb-4"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {cars.map((car, i) => (
          <motion.div
            key={car.id}
            className="min-w-[300px] md:min-w-[360px]"
            style={{ scrollSnapAlign: 'start' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
          >
            <CarCard car={car} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
