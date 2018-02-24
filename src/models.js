/* global Backent */

import geolib from 'geolib'
import moment from 'moment'

import store from './store'
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
  if (price == null) return null
  return `${Math.round(price / 100)} ${CURRENCY_SYMBOLS[currency]}`
}

export function BackentEvent (raw, user = null) {

  const model = {
    id: raw.slug,
    name: raw.name,
    organization: raw.organization.name,
    summary: raw.summary,
    description: raw.description,
    url: raw.external_url,
    cost: raw.price,
    readable_cost: readableCost(raw.price, raw.currency),
    npc_readable_cost: readableCost(raw.npc_price, raw.currency),
    start: moment(raw.start),
    durationCategory: raw.event_format,
    humanDuration: humanDuration(raw.event_format),
    distance: null,

    raw: raw,
  }

  model.doLike = async function () {
    try {
      const isLiked = await Backent.postLike(model.id)
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
      return
    }
    model.distance = Math.round(geolib.getDistance(
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
