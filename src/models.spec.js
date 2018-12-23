import moment from 'moment'

import { _getConvertedCosts } from './models'

const rawPrices = {
  original_currency: 'EUR',
  original_price: 20000, // in cents
  original_npc_price: 10000,
}

describe('_getConvertedCosts', () => {
  it('when I have prices in EUR, current currency is CHF and I have no conversion table', () => {
    expect(_getConvertedCosts(rawPrices, 'CHF', { 'CHF': 1.0 })).toEqual({
      'cost': 20000,
      'npc_cost': 10000,
      'npc_readable_cost': '100 €',
      'readable_cost': '200 €',
    })
  })

  it('when I have prices in EUR, current currency is EUR and I have no conversion table', () => {
    expect(_getConvertedCosts(rawPrices, 'EUR', { 'EUR': 1.0 })).toEqual({
      'cost': 20000,
      'npc_cost': 10000,
      'npc_readable_cost': '100 €',
      'readable_cost': '200 €',
    })
  })

  it('when I have prices in EUR, current currency is CHF and I have a conversion table', () => {
    expect(_getConvertedCosts(rawPrices, 'CHF', { 'EUR': 1.2 })).toEqual({
      'cost': 16667,
      'npc_cost': 8333,
      'npc_readable_cost': '83 CHF',
      'readable_cost': '167 CHF',
    })
  })

  it('when I have prices in EUR, current currency is EUR and I have a conversion table', () => {
    expect(_getConvertedCosts(rawPrices, 'EUR', { 'CHF': 1.2 })).toEqual({
      'cost': 20000,
      'npc_cost': 10000,
      'npc_readable_cost': '100 €',
      'readable_cost': '200 €',
    })
  })

})
