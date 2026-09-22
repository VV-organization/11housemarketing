import { describe, expect, it } from 'vitest'
import { pricingPlans } from './pricingData'

describe('pricingPlans', () => {
  it('preserves the exact prices and commissions from the approved brief', () => {
    expect(pricingPlans.map(({ name, price, commission }) => ({ name, price, commission }))).toEqual([
      { name: 'Start', price: '0 ₽', commission: '8%*' },
      { name: 'Team Pro', price: '2 490 ₽', commission: '6%*' },
      { name: 'Studio', price: '4 990 ₽', commission: '5%*' },
    ])
  })

  it('preserves Start limits and the Studio team size', () => {
    expect(pricingPlans[0].limits).toEqual(['1 специалист · 1 ГБ*', 'С брендом ElevenHouse. Без AI.'])
    expect(pricingPlans[2].limits).toContain('До 10 специалистов · 100 ГБ*')
  })
})
