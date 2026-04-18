import { PriceRange } from '@/types'

const options = [
  { label: 'Low', value: PriceRange.LOW },
  { label: 'Medium', value: PriceRange.MEDIUM },
  { label: 'High', value: PriceRange.HIGH },
  { label: 'Premium', value: PriceRange.PREMIUM },
]

export function usePriceRange() {
  return { options, PriceRange }
}
