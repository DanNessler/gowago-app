import { useEffect, useRef } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const STATUS_STEPS = [
  { label: 'Applied', status: 'done', icon: 'check_circle' },
  { label: 'Reviewing', status: 'active', icon: 'pending' },
  { label: 'Signature', status: 'upcoming', icon: 'draw' },
  { label: 'Delivery', status: 'upcoming', icon: 'local_shipping' },
]

const REF = `GW-${Date.now().toString(36).toUpperCase().slice(-8)}`

export default function SuccessPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  const car = state?.car
  const monthly = state?.monthly || 0

  // CSS-only confetti burst simulation via Framer Motion particles
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-20 space-y-4">

        {/* Confetti particles */}
        <ConfettiParticles />

        {/* Hero */}
        <section className="section-block bg-white px-8 py-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 bg-pastel-green text-green-700 px-5 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
                Application Sent!
              </span>

              <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-on-surface leading-tight mb-4">
                Congratulations! 🎉
              </h1>

              <p className="text-on-surface-variant text-xl leading-relaxed mb-8">
                {car ? `Your ${car.make} ${car.model} application has been submitted.` : 'Your application has been submitted.'}{' '}
                Our team will review it and get back to you within 24 hours.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 border-2 border-outline-variant text-on-surface px-6 py-3.5 rounded-full font-semibold hover:border-primary hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                  Go back to Home
                </Link>
                <button
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-full font-semibold hover:bg-primary-container transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>description</span>
                  View My Application
                </button>
              </div>
            </motion.div>

            {/* Right: rotated car image + badge */}
            <div className="relative">
              <motion.div
                animate={{ rotate: -4 }}
                whileHover={{ rotate: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-[3rem] overflow-hidden aspect-[4/3] shadow-playful"
              >
                {car ? (
                  <img
                    src={car.image}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-pastel-purple flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '80px' }}>directions_car</span>
                  </div>
                )}
              </motion.div>

              {/* Bouncing badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 bg-white rounded-[1.5rem] p-4 shadow-playful flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-pastel-green flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600" style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <div>
                  <div className="font-bold text-on-surface text-sm">Verified Identity</div>
                  <div className="text-xs text-on-surface-variant">Swiss ID Confirmed</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="section-block bg-pastel-blue px-8 py-16"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="font-headline font-bold text-3xl text-on-surface mb-10 text-center">What happens next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { icon: 'fact_check', title: 'Review Phase', desc: 'Our team reviews your application and runs a credit check. This usually takes 2-4 hours during business hours.', bg: 'bg-white' },
                { icon: 'call', title: 'Personal Contact', desc: 'A dedicated gowago advisor will call you to confirm details and finalise your leasing agreement.', bg: 'bg-white' },
                { icon: 'drive_eta', title: 'Ready to Drive', desc: 'Sign digitally, pay your deposit, and your car gets delivered straight to your door. Welcome to the road!', bg: 'bg-primary text-white' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`${item.bg} rounded-[2rem] p-7`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${item.bg === 'bg-primary text-white' ? 'bg-white/20' : 'bg-pastel-purple'}`}>
                    <span className={`material-symbols-outlined ${item.bg === 'bg-primary text-white' ? 'text-white' : 'text-primary'}`} style={{ fontSize: '24px' }}>{item.icon}</span>
                  </div>
                  <h3 className={`font-headline font-bold text-lg mb-3 ${item.bg === 'bg-primary text-white' ? 'text-white' : 'text-on-surface'}`}>{item.title}</h3>
                  <p className={`text-sm leading-relaxed ${item.bg === 'bg-primary text-white' ? 'text-white/80' : 'text-on-surface-variant'}`}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Track Your Status */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="section-block bg-zinc-50 px-8 py-16"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-headline font-bold text-3xl text-on-surface mb-3">Track Your Status</h2>
            <p className="text-on-surface-variant mb-2">Reference: <span className="font-bold text-primary font-mono">{REF}</span></p>
            <p className="text-on-surface-variant text-sm mb-12">Application submitted — we'll update you by email</p>

            {/* Status tracker */}
            <div className="flex items-center justify-center gap-0">
              {STATUS_STEPS.map((s, i) => (
                <div key={s.label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`relative w-14 h-14 rounded-full flex items-center justify-center ${
                      s.status === 'done' ? 'bg-primary text-white' :
                      s.status === 'active' ? 'bg-primary/10 text-primary ring-2 ring-primary' :
                      'bg-surface-container text-outline'
                    }`}>
                      <span className="material-symbols-outlined" style={{ fontSize: '24px', fontVariationSettings: s.status === 'done' ? "'FILL' 1" : "'FILL' 0" }}>{s.icon}</span>
                      {s.status === 'active' && (
                        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-primary rounded-full animate-ping" />
                      )}
                    </div>
                    <span className={`text-xs mt-2 font-semibold ${s.status === 'done' ? 'text-primary' : s.status === 'active' ? 'text-primary' : 'text-outline'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`w-16 md:w-24 h-0.5 mb-6 mx-1 ${i === 0 ? 'bg-primary' : 'bg-surface-container'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Download confirmation */}
            <button className="mt-12 inline-flex items-center gap-2 text-primary font-semibold hover:underline cursor-pointer">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
              Download confirmation PDF
            </button>
          </div>
        </motion.section>

      </main>

      <Footer />
    </div>
  )
}

// Simple CSS confetti burst
function ConfettiParticles() {
  const colors = ['#571295', '#E0F2FE', '#FDF2F8', '#FEFCE8', '#F0FDF4', '#FFF7ED']
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random(),
    size: 6 + Math.random() * 8,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          className="absolute rounded-sm"
          style={{ width: p.size, height: p.size * 0.5, backgroundColor: p.color, top: 0 }}
        />
      ))}
    </div>
  )
}
