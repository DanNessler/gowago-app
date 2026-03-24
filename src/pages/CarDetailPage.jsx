import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { cars } from '../data/cars'

const DURATION_OPTIONS = [24, 36, 48, 60]
const MILEAGE_OPTIONS = [5000, 10000, 15000, 20000]
const INTEREST_RATE = 0.029

function calcMonthly(car, duration, mileage, downPayment) {
  const base = car.pricePerMonth
  const durationMod = (48 - duration) * 4
  const mileageMod = (mileage - 10000) / 5000 * 15
  return Math.max(199, Math.round(base + durationMod + mileageMod))
}

export default function CarDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const car = cars.find(c => c.id === id)

  const [duration, setDuration] = useState(car?.leaseDuration || 48)
  const [mileage, setMileage] = useState(car?.annualMileage || 10000)
  const monthly = car ? calcMonthly(car, duration, mileage, car.downPayment) : 0

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-headline font-bold text-2xl mb-4">Car not found</h1>
          <button onClick={() => navigate('/search')} className="bg-primary text-white px-6 py-3 rounded-full cursor-pointer">
            Browse all cars
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-20 space-y-4 pb-8">

        {/* Hero */}
        <section className="section-block overflow-hidden h-[60vh] md:h-[75vh] relative group">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            src={car.images?.[0] || car.image}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex items-end justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {car.badge && (
                <span className="inline-block bg-white/90 text-on-surface text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {car.badge}
                </span>
              )}
              <h1 className="font-headline font-extrabold text-4xl md:text-6xl text-white leading-tight drop-shadow-lg">
                {car.make}<br />{car.model}
              </h1>
              <p className="text-white/80 text-xl mt-2">
                from <span className="font-bold text-white">CHF {monthly.toLocaleString('de-CH')}.-</span>/month
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/checkout/${car.id}`)}
              className="hidden md:flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold text-lg cursor-pointer shadow-playful"
            >
              Lease Now
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
            </motion.button>
          </div>
        </section>

        {/* Content grid */}
        <div className="max-w-[1440px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* LEFT: col-span-8 */}
          <div className="lg:col-span-8 space-y-4">

            {/* Description */}
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="section-block bg-white p-8 md:p-14"
              style={{ margin: 0, borderRadius: '3.5rem' }}
            >
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: 'speed', label: `${car.horsepower} hp` },
                  { icon: 'bolt', label: `0-100 in ${car.acceleration}` },
                  { icon: 'local_gas_station', label: car.fuel },
                  { icon: 'settings', label: car.transmission },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>{item.icon}</span>
                    <span className="text-sm font-medium text-on-surface">{item.label}</span>
                  </div>
                ))}
              </div>

              <h2 className="font-headline font-bold text-3xl text-on-surface mb-4">About this car</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed">{car.description}</p>
            </motion.article>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-pastel-purple p-8 rounded-[2.5rem]"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>bolt</span>
                </div>
                <h3 className="font-headline font-bold text-xl text-on-surface mb-4">Performance</h3>
                <ul className="space-y-2">
                  {car.features?.performance?.map(f => (
                    <li key={f} className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-pastel-pink p-8 rounded-[2.5rem]"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>weekend</span>
                </div>
                <h3 className="font-headline font-bold text-xl text-on-surface mb-4">Interior</h3>
                <ul className="space-y-2">
                  {car.features?.interior?.map(f => (
                    <li key={f} className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Second hero image */}
            {car.images?.[1] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-[3.5rem] overflow-hidden h-[50vh]"
              >
                <img
                  src={car.images[1]}
                  alt={`${car.make} ${car.model} interior`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            )}
          </div>

          {/* RIGHT: col-span-4 sticky sidebar */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-white rounded-[3rem] shadow-playful p-8"
              >
                <h3 className="font-headline font-bold text-xl text-on-surface mb-6">Leasing Overview</h3>

                {/* Summary table */}
                <div className="space-y-3 mb-6 pb-6 border-b border-outline-variant">
                  {[
                    { label: 'Down Payment', value: `CHF ${car.downPayment.toLocaleString('de-CH')}.-` },
                    { label: 'Duration', value: `${duration} months` },
                    { label: 'Annual Mileage', value: `${mileage.toLocaleString('de-CH')} km` },
                    { label: 'Residual Value', value: `CHF ${car.residualValue.toLocaleString('de-CH')}.-` },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center">
                      <span className="text-on-surface-variant text-sm">{row.label}</span>
                      <span className="font-semibold text-on-surface text-sm">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Monthly total */}
                <div className="text-center mb-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={monthly}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="font-headline font-extrabold text-4xl text-primary"
                    >
                      CHF {monthly.toLocaleString('de-CH')}.-
                    </motion.div>
                  </AnimatePresence>
                  <span className="text-on-surface-variant text-sm">/month (incl. VAT)</span>
                </div>

                {/* Duration slider */}
                <div className="mb-5">
                  <label className="text-sm font-semibold text-on-surface mb-3 block">
                    Duration: <span className="text-primary">{duration} months</span>
                  </label>
                  <div className="flex gap-2">
                    {DURATION_OPTIONS.map(d => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${duration === d ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-primary/10'}`}
                      >
                        {d}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mileage slider */}
                <div className="mb-8">
                  <label className="text-sm font-semibold text-on-surface mb-3 block">
                    Annual Mileage: <span className="text-primary">{mileage.toLocaleString('de-CH')} km</span>
                  </label>
                  <div className="flex gap-2">
                    {MILEAGE_OPTIONS.map(m => (
                      <button
                        key={m}
                        onClick={() => setMileage(m)}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${mileage === m ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-primary/10'}`}
                      >
                        {(m/1000)}k
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <motion.button
                  onClick={() => navigate(`/checkout/${car.id}`)}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg cursor-pointer shadow-playful mb-3"
                >
                  Check Availability
                </motion.button>

                <p className="text-center text-xs text-on-surface-variant">
                  No obligation · Free consultation · Instant decision
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
