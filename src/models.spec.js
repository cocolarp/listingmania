import { BackentEvent, _getConvertedCosts, _readableCost } from './models'

describe('BackentEvent', () => {

  function getRawData () {
    return {
      'pk': 3392,
      'slug': 'voyage-imprevu',
      'name': 'Voyage imprévu',
      'organization': {
        'slug': 'brumes',
        'name': 'Brumes',
      },
      'location': {
        'slug': 'castelnau-de-levis',
        'name': 'Castelnau-de-Lévis',
        'address': '44190 Gorges',
        'latitude': 43.9425117,
        'longitude': 2.074713299999985,
      },
      'summary': 'GN Firefly',
      'description': 'GN Firefly',
      'price': 10500,
      'npc_price': null,
      'currency': 'EUR',
      'start': '2019-01-25T00:00:00Z',
      'languages': ['en', 'fr'],
      'event_format': 'medium',
      'external_url': 'https://www.facebook.com/events/688229804704888/',
      'facebook_event': null,
      'facebook_page': null,
      'facebook_group': null,
      'player_signup_page': null,
      'npc_signup_page': null,
      'tags': ['international'],
    }
  }

  it('outputs a correct model from raw data', () => {
    const rawData = getRawData()
    expect(BackentEvent(rawData, 'EUR', { 'EUR': 1.0 })).toMatchObject({
      'id': 'voyage-imprevu-3392',
      'pk': 3392,
      'name': 'Voyage imprévu',
      'description': 'GN Firefly',
      'cost': 10500,
      'summary': 'GN Firefly',
      'url': 'https://www.facebook.com/events/688229804704888/',
      'distance': null,
      'durationCategory': 'medium',
      'humanDuration': '2 ou 3 jours',
      'npc_cost': null,
      'npc_readable_cost': '?',
      'organization': 'Brumes',
      'original_currency': 'EUR',
      'original_npc_price': null,
      'original_price': 10500,
      'readable_cost': '105 €',
      'tags': [{ key: 'international', label: 'International' }],
      'languages': 'English, French',
      'raw': {
        'currency': 'EUR',
        'description': 'GN Firefly',
        'event_format': 'medium',
        'external_url': 'https://www.facebook.com/events/688229804704888/',
        'facebook_event': null,
        'facebook_group': null,
        'facebook_page': null,
        'location': {
          'address': '44190 Gorges',
          'latitude': 43.9425117,
          'longitude': 2.074713299999985,
          'name': 'Castelnau-de-Lévis',
          'slug': 'castelnau-de-levis',
        },
        'name': 'Voyage imprévu',
        'npc_price': null,
        'npc_signup_page': null,
        'organization': {
          'name': 'Brumes',
          'slug': 'brumes',
        },
        'pk': 3392,
        'player_signup_page': null,
        'price': 10500,
        'slug': 'voyage-imprevu',
        'start': '2019-01-25T00:00:00Z',
        'summary': 'GN Firefly',
      },
    })
  })
})

describe('_readableCost', () => {

  it('returns a readable cost with the currency and such', () => {
    expect(_readableCost(12000, 'EUR')).toEqual('120 €')
  })

  it('returns ? when the cost is unknown', () => {
    expect(_readableCost(null, 'EUR')).toEqual('?')
  })

})

describe('_getConvertedCosts', () => {

  const rawPrices = {
    original_currency: 'EUR',
    original_price: 20000, // in cents
    original_npc_price: 10000,
  }

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
