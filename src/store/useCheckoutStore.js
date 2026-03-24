import { create } from 'zustand'

const useCheckoutStore = create((set) => ({
  selectedCar: null,
  leaseDuration: 48,
  annualMileage: 10000,
  downPayment: 0,
  monthlyPayment: 0,
  paymentMethod: null,
  billingInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    street: '',
    city: '',
    postalCode: '',
  },

  setSelectedCar: (car) => set({
    selectedCar: car,
    leaseDuration: car.leaseDuration,
    annualMileage: car.annualMileage,
    downPayment: car.downPayment,
  }),

  setLeaseDuration: (duration) => set({ leaseDuration: duration }),
  setAnnualMileage: (mileage) => set({ annualMileage: mileage }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setBillingInfo: (info) => set((state) => ({
    billingInfo: { ...state.billingInfo, ...info }
  })),

  calculateMonthly: (carPrice) => {
    // Will be computed dynamically in the component
  },

  reset: () => set({
    selectedCar: null,
    leaseDuration: 48,
    annualMileage: 10000,
    downPayment: 0,
    monthlyPayment: 0,
    paymentMethod: null,
    billingInfo: {
      firstName: '', lastName: '', email: '', phone: '',
      dob: '', street: '', city: '', postalCode: '',
    },
  }),
}))

export default useCheckoutStore
