/* global Backent */

import geolib from 'geolib'
import moment from 'moment'

import {gettext} from 'src/lang_utils'

export const AVAILABLE_DISTANCES = {
  10: '10km',
  50: '50km',
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

const CURRENCY_EUR = 'EUR'
const CURRENCY_USD = 'USD'
const CURRENCY_SYMBOLS = {
  [CURRENCY_EUR]: '€',
  [CURRENCY_USD]: '$',
}

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
  if (price === 0) {
    return '' // do not display anything if price is null
  }
  return `${Math.round(price / 100)}${CURRENCY_SYMBOLS[currency]}`
}

function BackentEvent (raw) {

  const model = {
    id: raw.slug,
    name: raw.name,
    organization: raw.organization.name,
    summary: raw.summary,
    description: raw.description,
    url: raw.external_url,
    cost: raw.price,
    readable_cost: readableCost(raw.price, raw.currency),
    start: moment(raw.start),
    durationCategory: raw.event_format,
    humanDuration: humanDuration(raw.event_format),
    address: raw.location.name,
    lat: raw.location.latitude,
    lng: raw.location.longitude,
    distance: null,
    isLiked: false,
  }

  model.like = async function () {
    const isLiked = await Backent.postLike(model.id)
    model.isLiked = isLiked
  }

  model.computeDistance = (lat, lng) => {
    if (!model.lat || !model.lng) {
      return
    }
    model.distance = Math.round(geolib.getDistance(
      {latitude: lat, longitude: lng},
      {latitude: model.lat, longitude: model.lng},
      1000, // 1km accuracy
    ) / 1000.0) // get the distance in kilometers
  }

  return model
}


export function transformBackentData (rawEvents) {
  const events = rawEvents.map((rawEvent) => {
    try {
      return BackentEvent(rawEvent)
    } catch (err) {
      console.warn(`parsing event data for ${rawEvent.name} failed: ${err}`)
    }
  })
  return events.sort((a, b) => a.start - b.start)
}
