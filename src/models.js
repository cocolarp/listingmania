/* global Backent */

import geolib from 'geolib'
import moment from 'moment'
import lodash from 'lodash'

import store from './store'
import {gettext} from 'src/lang_utils'
import {basicXhr} from 'src/services/utils.js'

export const AVAILABLE_DISTANCES = {
  10: '10km',
  50: '50km',
  150: '150km',
  250: '250km',
  500: '500km',
}

export const DURATION_HOURS = 'hours'
export const DURATION_SHORT = 'short'
export const DURATION_MEDIUM = 'medium'
export const DURATION_LONG = 'long'

export const COLOR_SHORT = '#AC73ED'
export const COLOR_MEDIUM = '#3EC89C'
export const COLOR_LONG = '#49AFEB'

export const DURATION_COLOR = {
  [DURATION_HOURS]: COLOR_SHORT,
  [DURATION_SHORT]: COLOR_SHORT,
  [DURATION_MEDIUM]: COLOR_MEDIUM,
  [DURATION_LONG]: COLOR_LONG,
}

export const DURATIONS = [DURATION_SHORT, DURATION_MEDIUM, DURATION_LONG]

const CURRENCY_CHF = 'CHF'
export const CURRENCY_EUR = 'EUR'
const CURRENCY_GBP = 'GBP'
const CURRENCY_SEK = 'SEK'
const CURRENCY_USD = 'USD'

export const CURRENCY_SYMBOLS = {
  [CURRENCY_CHF]: 'CHF',
  [CURRENCY_EUR]: '€',
  [CURRENCY_GBP]: '£',
  [CURRENCY_SEK]: 'kr',
  [CURRENCY_USD]: '$',
}

const AVAILABLE_CURRENCIES = Object.keys(CURRENCY_SYMBOLS)

function humanDuration (fmt) {
  switch (fmt) {
    case DURATION_HOURS:
      return gettext('Quelques heures')
    case DURATION_SHORT:
      return gettext('Une journée')
    case DURATION_MEDIUM:
      return gettext('2 ou 3 jours')
    default:
      return gettext('Plus de 3 jours')
  }
}

function readableCost (price, currency) {
  if (price == null) return null
  return `${Math.round(price / 100)} ${CURRENCY_SYMBOLS[currency]}`
}

function getConvertedCosts (model, toCurrency, conversionTable) {
  const convertedCost = model.original_price / conversionTable[model.original_currency]
  const convertedNPCCost = model.original_npc_price / conversionTable[model.original_currency]

  return {
    cost: convertedCost,
    npc_cost: convertedNPCCost,
    readable_cost: readableCost(convertedCost, toCurrency),
    npc_readable_cost: readableCost(convertedNPCCost, toCurrency),
  }
}

export function BackentEvent (raw, currency, conversionTable) {

  const model = {
    pk: raw.pk,
    id: `${raw.slug}-${raw.pk}`,
    name: raw.name,
    organization: raw.organization.name,
    summary: raw.summary,
    description: raw.description,
    url: raw.external_url,
    original_price: raw.price,
    original_npc_price: raw.npc_price,
    original_currency: raw.currency,
    start: moment(raw.start),
    durationCategory: raw.event_format,
    humanDuration: humanDuration(raw.event_format),
    distance: null,

    raw: raw,
  }

  model.updateCosts = function (currency, conversionTable) {
    lodash.merge(model, getConvertedCosts(model, currency, conversionTable))
  }

  model.updateCosts(currency, conversionTable) // setup the first costs

  model.doLike = async function () {
    try {
      const isLiked = await Backent.postLike(model.pk)
      if (isLiked) {
        store.commit('addLike', model.id)
      } else {
        store.commit('dropLike', model.id)
      }
    } catch (exc) {
      console.log(`could not like event '${model.id}`, exc)
    }
  }

  model.computeDistance = (lat, lng) => {
    if (!model.raw.location.latitude || !model.raw.location.longitude) {
      return null
    }
    return Math.round(geolib.getDistance(
      {latitude: lat, longitude: lng},
      {
        latitude: model.raw.location.latitude,
        longitude: model.raw.location.longitude,
      },
      1000, // 1km accuracy
    ) / 1000.0) // get the distance in kilometers
  }

  return model
}

function storageRateKey (destCurrency) {
  return `exchange-rates-${destCurrency}`
}

function fetchRatesFromStorage (destCurrency) {
  const serializedRates = localStorage.getItem(storageRateKey(destCurrency))
  if (serializedRates) {
    const rates = JSON.parse(serializedRates)
    if (moment(rates['zmw'].date).diff(moment(), 'days') < 30) { // FIXME: here for simplicity we choose a currency we can't select
      return rates
    }
    localStorage.removeItem(storageRateKey(destCurrency))
  }
  return null
}

export async function computeConversionTable (destCurrency) {
  const sourceCurrencies = AVAILABLE_CURRENCIES.filter((d) => d !== destCurrency)

  let rates = fetchRatesFromStorage(destCurrency)
  if (!rates) {
    rates = await basicXhr(
      `https://www.floatrates.com/daily/${destCurrency.toLowerCase()}.json`,
      'GET',
    )
    const key = storageRateKey(destCurrency)
    localStorage.setItem(key, JSON.stringify(rates))
  }
  const conversionTable = {
    [destCurrency]: 1.0,
  }
  sourceCurrencies.forEach((srcCurrency) => {
    const loCaseCurrency = srcCurrency.toLowerCase()
    conversionTable[srcCurrency] = rates[loCaseCurrency].rate
  })
  return conversionTable
}

export function transformBackentData (rawEvents, currency, conversionTable) {
  return rawEvents.map((rawEvent) => {
    try {
      return BackentEvent(rawEvent, currency, conversionTable)
    } catch (err) {
      console.warn(`parsing event data for ${rawEvent.name} failed: ${err}`)
    }
  })
}
