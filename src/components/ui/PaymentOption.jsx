import { motion } from 'framer-motion'

export default function PaymentOption({ id, label, description, icon, selected, onSelect }) {
  return (
    <motion.button
      onClick={() => onSelect(id)}
      className={`w-full text-left p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer ${
        selected
          ? 'border-primary bg-pastel-purple ring-4 ring-primary/5'
          : 'border-outline-variant bg-white hover:border-primary/40'
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${selected ? 'bg-primary' : 'bg-surface-container'}`}>
          <span className={`material-symbols-outlined ${selected ? 'text-white' : 'text-on-surface-variant'}`} style={{ fontSize: '24px' }}>
            {icon}
          </span>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-on-surface">{label}</div>
          <div className="text-sm text-on-surface-variant mt-0.5">{description}</div>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
          selected ? 'border-primary bg-primary' : 'border-outline-variant'
        }`}>
          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>
    </motion.button>
  )
}
