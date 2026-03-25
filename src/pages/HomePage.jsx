import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import SearchBar from '../components/ui/SearchBar'
import CarSlider from '../components/ui/CarSlider'
import { hotDeals, dreamCars, convertibles } from '../data/cars'

const stagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.12 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const sectionEntry = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: 'easeOut' },
}

export default function HomePage() {
  const navigate = useNavigate()
  const heroSearchRef = useRef(null)
  const [isHeroVisible, setIsHeroVisible] = useState(true)

  useEffect(() => {
    const el = heroSearchRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-20 space-y-4">

        {/* [1] Hero */}
        <section className="section-block bg-white px-4 sm:px-8 py-10 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={stagger} initial="initial" animate="animate">
              <motion.h1
                variants={fadeUp}
                className="font-headline font-extrabold text-4xl md:text-6xl lg:text-7xl text-on-surface leading-tight mb-6"
              >
                Get your next ride faster than a parking ticket.
              </motion.h1>

              <motion.p variants={fadeUp} className="text-on-surface-variant text-xl mb-10">
                Starting as low as{' '}
                <span className="font-bold text-primary">CHF 149.-/month.</span>
                {' '}Over 30 premium cars. Zero BS.
              </motion.p>

              <motion.div variants={fadeUp} className="max-w-2xl mx-auto" ref={heroSearchRef}>
                <SearchBar large />
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 mt-8">
                {['SUV', 'Electric', 'Sedan', 'Convertible', 'Coupe'].map(type => (
                  <button
                    key={type}
                    onClick={() => navigate(`/search?q=${type}`)}
                    className="px-4 py-2 rounded-full bg-surface-container text-on-surface-variant text-sm font-medium hover:bg-primary hover:text-white transition-all cursor-pointer"
                  >
                    {type}
                  </button>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* [2] Hot Deals */}
        <motion.section {...sectionEntry} className="section-block bg-pastel-blue px-8 py-12">
          <CarSlider
            cars={hotDeals}
            title="🔥 Smoking hot deals"
            subtitle="Limited time offers — before they're gone"
          />
        </motion.section>

        {/* [3] Dream Cars */}
        <motion.section {...sectionEntry} className="section-block bg-pastel-pink px-8 py-12">
          <CarSlider
            cars={dreamCars}
            title="✨ Dream cars"
            subtitle="For those who refuse to compromise"
          />
        </motion.section>

        {/* [4] Summer Special: Topless */}
        <motion.section {...sectionEntry} className="section-block bg-pastel-yellow px-8 py-12">
          <CarSlider
            cars={convertibles}
            title="☀️ Summer Special: Topless"
            subtitle="Convertibles — because Swiss summers deserve open skies"
          />
        </motion.section>

        {/* [5] CTA */}
        <motion.div {...sectionEntry} className="text-center py-8">
          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-3 bg-on-surface text-surface-container-lowest px-10 py-5 rounded-full font-bold text-lg hover:bg-primary transition-colors cursor-pointer shadow-playful"
          >
            <span className="material-symbols-outlined">directions_car</span>
            Find more rides
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </motion.div>

        {/* [6] How it works */}
        <motion.section {...sectionEntry} className="section-block bg-pastel-green px-8 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-headline font-bold text-3xl md:text-4xl text-on-surface mb-3">How it works</h2>
              <p className="text-on-surface-variant text-lg">Three easy steps to your dream car</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: 'search', step: '01', title: 'Find your ride', desc: 'Browse 30+ premium cars. Filter by make, type, budget. No pressure, just pure discovery.' },
                { icon: 'payments', step: '02', title: 'Pay transparently', desc: 'Choose your lease terms. We work with Migrosbank for the best Swiss rates. No hidden fees.' },
                { icon: 'emoji_transportation', step: '03', title: 'Buckle up', desc: 'Sign digitally, get verified, and your car gets delivered right to your door. That\'s it.' },
              ].map((item) => (
                <div key={item.step} className="bg-white/60 rounded-[2rem] p-8 text-center">
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6 cursor-default"
                  >
                    <span className="material-symbols-outlined text-white" style={{ fontSize: '28px' }}>{item.icon}</span>
                  </motion.div>
                  <span className="text-xs font-bold text-primary tracking-widest">{item.step}</span>
                  <h3 className="font-headline font-bold text-xl mt-2 mb-3 text-on-surface">{item.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* [7] Social Proof */}
        <motion.section {...sectionEntry} className="section-block bg-pastel-orange px-8 py-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: image + testimonial */}
            <div className="relative">
              <motion.div
                animate={{ rotate: -4 }}
                whileHover={{ rotate: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-[2.5rem] overflow-hidden aspect-[4/3] shadow-playful"
              >
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"
                  alt="Happy gowago customer"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>

              {/* Testimonial floating card */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-[2rem] p-5 shadow-playful max-w-[240px]">
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="material-symbols-outlined text-[#FBBF24]" style={{ fontSize: '16px', fontFamily: 'Material Symbols Outlined', fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-on-surface text-sm font-medium leading-snug">"Got my dream Porsche in 3 days. Unbelievable service."</p>
                <p className="text-on-surface-variant text-xs mt-2">— Marco B., Zürich</p>
              </div>
            </div>

            {/* Right: copy */}
            <div>
              <span className="inline-flex items-center gap-2 bg-white/80 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified</span>
                Trusted by 50,000+ Swiss drivers
              </span>

              <h2 className="font-headline font-bold text-3xl md:text-4xl text-on-surface leading-tight mb-6">
                Switzerland's most loved car leasing platform.
              </h2>

              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                We partner with Migrosbank to offer the most competitive leasing rates in Switzerland. Fully transparent, fully digital, fully yours.
              </p>

              {/* Migrosbank badge */}
              <div className="flex items-center gap-4 p-4 bg-white/80 rounded-[1.5rem] w-fit mb-8">
                <div className="w-10 h-10 rounded-full bg-[#F5A623] flex items-center justify-center">
                  <span className="text-white font-black text-sm">MB</span>
                </div>
                <div>
                  <div className="font-bold text-on-surface text-sm">Migrosbank Partner</div>
                  <div className="text-xs text-on-surface-variant">Best Swiss Leasing Rates</div>
                </div>
              </div>

              <button
                onClick={() => navigate('/search')}
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-container transition-colors cursor-pointer shadow-playful"
              >
                Start browsing
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
              </button>
            </div>
          </div>
        </motion.section>

      </main>

      {/* Sticky bottom search — visible when hero search is scrolled out of view */}
      <AnimatePresence>
        {!isHeroVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-40 pb-6 px-4 pointer-events-none"
          >
            <div className="max-w-2xl mx-auto pointer-events-auto">
              <div
                className="glass-nav rounded-full p-2"
                style={{
                  border: '2px solid #571295',
                  boxShadow: '0 8px 32px -4px rgba(87,18,149,0.35), 0 0 0 6px rgba(87,18,149,0.10)',
                }}
              >
                <SearchBar dropUp />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
