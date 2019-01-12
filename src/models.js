/* global Backent */

import geolib from 'geolib'
import moment from 'moment'
import merge from 'lodash/merge'

import store from './store'
import { $gettext } from 'src/lang_utils'
import { basicXhr } from 'src/services/utils.js'

import * as enums from 'src/enums'


function humanDuration (fmt) {
  switch (fmt) {
    case enums.DURATION_SHORT:
      return $gettext('Une journée')
    case enums.DURATION_MEDIUM:
      return $gettext('2 ou 3 jours')
    default:
      return $gettext('Plus de 3 jours')
  }
}

export function _readableCost (price, currency) {
  if (price == null) return '?'
  return `${Math.round(price)} ${enums.CURRENCY_SYMBOLS[currency]}`
}

function convertCost (price, divider) {
  if (price == null) return null
  return Math.round(price / divider)
}

export function _getConvertedCosts (model, toCurrency, conversionTable) {
  if (Object.keys(conversionTable).includes(model.original_currency)) {
    const convertedCost = convertCost(model.original_price, conversionTable[model.original_currency])
    const convertedNPCCost = convertCost(model.original_npc_price, conversionTable[model.original_currency])
    return {
      cost: convertedCost,
      npc_cost: convertedNPCCost,
      readable_cost: _readableCost(convertedCost, toCurrency),
      npc_readable_cost: _readableCost(convertedNPCCost, toCurrency),
    }
  }

  return {
    cost: model.original_price,
    npc_cost: model.original_npc_price,
    readable_cost: _readableCost(model.original_price, model.original_currency),
    npc_readable_cost: _readableCost(model.original_npc_price, model.original_currency),
  }
}


function safeParsePrice (x) {
  if (x == null) return x
  return parseFloat(x)
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
    original_price: safeParsePrice(raw.price),
    original_npc_price: safeParsePrice(raw.npc_price),
    original_currency: raw.currency,
    start: moment(raw.start),
    durationCategory: raw.event_format,
    humanDuration: humanDuration(raw.event_format),
    distance: null,
    tags: raw.tags.map((tagKey) => {
      return {
        key: tagKey,
        label: enums.TAG_LABELS[tagKey],
      }
    }),
    languages: raw.languages
      .map((code) => enums.LANGUAGE_LABELS[code])
      .sort((a1, a2) => a1.localeCompare(a2))
      .join(', '),
    raw: raw,
  }

  model.updateCosts = function (currency, conversionTable) {
    merge(model, _getConvertedCosts(model, currency, conversionTable))
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
    if (!model.raw.location) return null
    if (!model.raw.location.latitude || !model.raw.location.longitude) {
      return null
    }
    return Math.round(geolib.getDistance(
      { latitude: lat, longitude: lng },
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
  const sourceCurrencies = enums.AVAILABLE_CURRENCIES.filter((d) => d !== destCurrency)

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
