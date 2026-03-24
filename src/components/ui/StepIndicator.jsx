export default function StepIndicator({ currentStep }) {
  const steps = [
    { n: 1, label: 'Selection' },
    { n: 2, label: 'Details' },
    { n: 3, label: 'Payment' },
  ]

  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, i) => (
        <div key={step.n} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
              step.n < currentStep
                ? 'bg-primary text-white'
                : step.n === currentStep
                  ? 'bg-primary text-white ring-4 ring-primary/20'
                  : 'bg-surface-container text-on-surface-variant'
            }`}>
              {step.n < currentStep ? (
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
              ) : step.n}
            </div>
            <span className={`text-xs mt-1 font-medium ${step.n === currentStep ? 'text-primary' : 'text-on-surface-variant'}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-16 h-0.5 mb-5 mx-1 transition-all ${step.n < currentStep ? 'bg-primary' : 'bg-surface-container'}`} />
          )}
        </div>
      ))}
    </div>
  )
}
