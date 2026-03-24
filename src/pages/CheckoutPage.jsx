import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import StepIndicator from '../components/ui/StepIndicator'
import PaymentOption from '../components/ui/PaymentOption'
import { cars } from '../data/cars'

const DURATION_OPTIONS = [24, 36, 48, 60]
const MILEAGE_OPTIONS = [5000, 10000, 15000, 20000]

function calcMonthly(car, duration, mileage) {
  const base = car.pricePerMonth
  const durationMod = (48 - duration) * 4
  const mileageMod = (mileage - 10000) / 5000 * 15
  return Math.max(199, Math.round(base + durationMod + mileageMod))
}

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

export default function CheckoutPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const car = cars.find(c => c.id === id)

  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [duration, setDuration] = useState(car?.leaseDuration || 48)
  const [mileage, setMileage] = useState(car?.annualMileage || 10000)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [personal, setPersonal] = useState({
    firstName: '', lastName: '', email: '', phone: '', dob: '',
    street: '', city: '', postalCode: '',
  })

  const [billing, setBilling] = useState({
    firstName: '', lastName: '', street: '', city: '', postalCode: '',
  })

  const monthly = car ? calcMonthly(car, duration, mileage) : 0

  useEffect(() => { window.scrollTo(0, 0) }, [step])

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button onClick={() => navigate('/search')} className="bg-primary text-white px-6 py-3 rounded-full cursor-pointer">Back to search</button>
      </div>
    )
  }

  const goToStep = (n) => {
    setDirection(n > step ? 1 : -1)
    setStep(n)
  }

  const validateBilling = () => {
    const errs = {}
    if (!billing.firstName) errs.firstName = 'Required'
    if (!billing.lastName) errs.lastName = 'Required'
    if (!billing.street) errs.street = 'Required'
    if (!billing.city) errs.city = 'Required'
    if (!billing.postalCode) errs.postalCode = 'Required'
    if (!paymentMethod) errs.paymentMethod = 'Please select a payment method'
    return errs
  }

  const handleSubmit = async () => {
    const errs = validateBilling()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    navigate('/success', { state: { car, monthly, duration, mileage } })
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <main className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Step indicator */}
          <div className="mb-10">
            <StepIndicator currentStep={step} />
          </div>

          {/* Step content */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >

                {/* STEP 1: Selection */}
                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="rounded-[2.5rem] overflow-hidden aspect-[4/3] mb-4">
                        <img src={car.image} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8">
                      <h2 className="font-headline font-bold text-2xl text-on-surface mb-1">
                        {car.make} {car.model}
                      </h2>
                      <p className="text-on-surface-variant mb-6">{car.year} · {car.fuel} · {car.transmission}</p>

                      {/* Duration */}
                      <div className="mb-5">
                        <label className="text-sm font-semibold text-on-surface mb-3 block">
                          Lease Duration: <span className="text-primary">{duration} months</span>
                        </label>
                        <div className="flex gap-2">
                          {DURATION_OPTIONS.map(d => (
                            <button key={d} onClick={() => setDuration(d)}
                              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all ${duration === d ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-primary/10'}`}>
                              {d}m
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Mileage */}
                      <div className="mb-6">
                        <label className="text-sm font-semibold text-on-surface mb-3 block">
                          Annual Mileage: <span className="text-primary">{mileage.toLocaleString('de-CH')} km</span>
                        </label>
                        <div className="flex gap-2">
                          {MILEAGE_OPTIONS.map(m => (
                            <button key={m} onClick={() => setMileage(m)}
                              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${mileage === m ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-primary/10'}`}>
                              {m/1000}k
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Monthly */}
                      <div className="bg-pastel-purple rounded-2xl p-4 mb-6 text-center">
                        <div className="text-3xl font-headline font-extrabold text-primary">
                          CHF {monthly.toLocaleString('de-CH')}.-
                        </div>
                        <div className="text-sm text-on-surface-variant">per month</div>
                      </div>

                      <button onClick={() => goToStep(2)}
                        className="w-full bg-primary text-white py-4 rounded-full font-bold cursor-pointer hover:bg-primary-container transition-colors">
                        Continue to Details →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Personal Details */}
                {step === 2 && (
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-[2.5rem] p-8">
                      <h2 className="font-headline font-bold text-2xl text-on-surface mb-6">Personal Details</h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="First Name" value={personal.firstName}
                          onChange={v => setPersonal(p => ({...p, firstName: v}))} placeholder="Hans" />
                        <FormField label="Last Name" value={personal.lastName}
                          onChange={v => setPersonal(p => ({...p, lastName: v}))} placeholder="Müller" />
                        <FormField label="Email" type="email" value={personal.email}
                          onChange={v => setPersonal(p => ({...p, email: v}))} placeholder="hans@example.ch" className="sm:col-span-2" />
                        <FormField label="Phone" type="tel" value={personal.phone}
                          onChange={v => setPersonal(p => ({...p, phone: v}))} placeholder="+41 79 000 00 00" />
                        <FormField label="Date of Birth" type="date" value={personal.dob}
                          onChange={v => setPersonal(p => ({...p, dob: v}))} />
                        <FormField label="Street & No." value={personal.street}
                          onChange={v => setPersonal(p => ({...p, street: v}))} placeholder="Bahnhofstrasse 1" className="sm:col-span-2" />
                        <FormField label="City" value={personal.city}
                          onChange={v => setPersonal(p => ({...p, city: v}))} placeholder="Zürich" />
                        <FormField label="Postal Code" value={personal.postalCode}
                          onChange={v => setPersonal(p => ({...p, postalCode: v}))} placeholder="8001" />
                      </div>

                      {/* ID Upload UI */}
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-on-surface mb-2">ID Document</label>
                        <div className="border-2 border-dashed border-outline-variant rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                          <span className="material-symbols-outlined text-outline mb-2 block" style={{ fontSize: '40px' }}>upload_file</span>
                          <p className="text-on-surface-variant text-sm">Drop your ID here or <span className="text-primary font-medium">click to browse</span></p>
                          <p className="text-xs text-outline mt-1">JPG, PNG, PDF up to 5MB</p>
                          <input type="file" className="hidden" accept=".jpg,.png,.pdf" />
                        </div>
                      </div>

                      <div className="flex gap-3 mt-8">
                        <button onClick={() => goToStep(1)}
                          className="flex-1 border-2 border-outline-variant text-on-surface py-3 rounded-full font-semibold cursor-pointer hover:border-primary transition-colors">
                          Back
                        </button>
                        <button onClick={() => goToStep(3)}
                          className="flex-1 bg-primary text-white py-3 rounded-full font-bold cursor-pointer hover:bg-primary-container transition-colors">
                          Continue to Payment →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Payment */}
                {step === 3 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: payment form */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-[2.5rem] p-8">
                        <h2 className="font-headline font-bold text-xl text-on-surface mb-5">Payment Method</h2>

                        {errors.paymentMethod && (
                          <p className="text-error text-sm mb-4 flex items-center gap-1">
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>
                            {errors.paymentMethod}
                          </p>
                        )}

                        <div className="space-y-3">
                          <PaymentOption
                            id="card"
                            label="Credit Card"
                            description="Visa, Mastercard, Amex"
                            icon="credit_card"
                            selected={paymentMethod === 'card'}
                            onSelect={v => { setPaymentMethod(v); setErrors(e => ({...e, paymentMethod: undefined})) }}
                          />
                          <PaymentOption
                            id="bank"
                            label="Bank Transfer"
                            description="Swiss bank account (3-5 days)"
                            icon="account_balance"
                            selected={paymentMethod === 'bank'}
                            onSelect={v => { setPaymentMethod(v); setErrors(e => ({...e, paymentMethod: undefined})) }}
                          />
                          <PaymentOption
                            id="leasing"
                            label="Leasing Plan"
                            description="via Migrosbank — best rates"
                            icon="payments"
                            selected={paymentMethod === 'leasing'}
                            onSelect={v => { setPaymentMethod(v); setErrors(e => ({...e, paymentMethod: undefined})) }}
                          />
                        </div>
                      </div>

                      <div className="bg-white rounded-[2.5rem] p-8">
                        <h2 className="font-headline font-bold text-xl text-on-surface mb-5">Billing Address</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField label="First Name" value={billing.firstName}
                            onChange={v => setBilling(b => ({...b, firstName: v}))}
                            error={errors.firstName} placeholder="Hans" />
                          <FormField label="Last Name" value={billing.lastName}
                            onChange={v => setBilling(b => ({...b, lastName: v}))}
                            error={errors.lastName} placeholder="Müller" />
                          <FormField label="Street" value={billing.street}
                            onChange={v => setBilling(b => ({...b, street: v}))}
                            error={errors.street} placeholder="Bahnhofstrasse 1" className="sm:col-span-2" />
                          <FormField label="City" value={billing.city}
                            onChange={v => setBilling(b => ({...b, city: v}))}
                            error={errors.city} placeholder="Zürich" />
                          <FormField label="Postal Code" value={billing.postalCode}
                            onChange={v => setBilling(b => ({...b, postalCode: v}))}
                            error={errors.postalCode} placeholder="8001" />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => goToStep(2)}
                          className="flex-1 border-2 border-outline-variant text-on-surface py-3.5 rounded-full font-semibold cursor-pointer hover:border-primary transition-colors">
                          Back
                        </button>
                        <motion.button
                          onClick={handleSubmit}
                          disabled={loading}
                          whileHover={!loading ? { scale: 1.02 } : {}}
                          whileTap={!loading ? { scale: 0.95 } : {}}
                          className={`flex-1 py-3.5 rounded-full font-bold cursor-pointer flex items-center justify-center gap-2 transition-colors ${loading ? 'bg-primary/50 text-white' : 'bg-primary text-white hover:bg-primary-container'}`}
                        >
                          {loading ? (
                            <>
                              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>Complete Payment</>
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Right: order summary */}
                    <div>
                      <div className="bg-white rounded-[2.5rem] p-8 sticky top-28">
                        <h2 className="font-headline font-bold text-xl text-on-surface mb-5">Order Summary</h2>

                        <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-5">
                          <img src={car.image} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
                        </div>

                        <h3 className="font-bold text-on-surface text-lg">{car.make} {car.model}</h3>
                        <p className="text-on-surface-variant text-sm mb-5">{car.year} · {car.fuel}</p>

                        <div className="space-y-3 mb-5 pb-5 border-b border-outline-variant">
                          <SummaryRow label="Lease Duration" value={`${duration} months`} />
                          <SummaryRow label="Annual Mileage" value={`${mileage.toLocaleString('de-CH')} km`} />
                          <SummaryRow label="Down Payment" value={`CHF ${car.downPayment.toLocaleString('de-CH')}.-`} />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-on-surface">Monthly Total</span>
                          <span className="font-headline font-extrabold text-2xl text-primary">
                            CHF {monthly.toLocaleString('de-CH')}.-
                          </span>
                        </div>

                        <div className="mt-4 p-3 bg-pastel-green rounded-xl flex items-center gap-2">
                          <span className="material-symbols-outlined text-green-600" style={{ fontSize: '18px' }}>verified_user</span>
                          <span className="text-xs text-green-700 font-medium">Secured by Migrosbank — Swiss standard encryption</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function FormField({ label, value, onChange, error, type = 'text', placeholder = '', className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-on-surface mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all text-sm ${
          error
            ? 'border-error bg-error-container/10 focus:border-error'
            : 'border-outline-variant bg-surface-container-low focus:border-primary focus:shadow-[0_0_0_4px_rgba(87,18,149,0.08)]'
        }`}
      />
      {error && <p className="text-error text-xs mt-1 flex items-center gap-1">
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>error</span>{error}
      </p>}
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-medium text-on-surface">{value}</span>
    </div>
  )
}
