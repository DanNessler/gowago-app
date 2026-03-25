import { cars } from './cars'

const makes = [...new Set(cars.map(c => c.make))].sort()
const models = [...new Set(cars.map(c => `${c.make} ${c.model}`))].sort()
const types = [...new Set(cars.map(c => c.type))].sort()
const fuels = [...new Set(cars.map(c => c.fuel))].sort()

export const CAR_SUGGESTIONS = [
  ...makes,
  ...types,
  ...fuels,
  ...models,
]
