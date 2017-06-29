const CURRENCY_EURO = 'EUR'

const DEFAULT_CURRENCY = CURRENCY_EURO

const CURRENCY_SYMBOLS = {
  [CURRENCY_EURO]: '€',
}

export function parsePrice (rawPrice) {
  if (rawPrice === '?') {
    return {
      // FIXME(vperron): Nope, if cost is ? it should not be 0 :)
      amount: 0,  // cents
      currency: DEFAULT_CURRENCY,
      symbol: CURRENCY_SYMBOLS[DEFAULT_CURRENCY],
    }
  }

  if (rawPrice.includes('€')) {  // FIXME(vperron): Should do a generic way, but meh.
    const currency = CURRENCY_EURO
    const symbol = CURRENCY_SYMBOLS[CURRENCY_EURO]
    return {
      amount: parseFloat(rawPrice.replace(symbol, '')) * 100,  // cents
      currency: currency,
      symbol: symbol,
    }
  }
  // throw new Error(`the price '${rawPrice}' was not parseable`)
  throw new Error(`the price '${rawPrice}' was not parseable`)
}
