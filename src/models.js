import geolib from 'geolib'
import moment from 'moment'

export const AVAILABLE_DISTANCES = {
  10: '10km',
  50: '50km',
  250: '250km',
  500: '500km',
}

const CURRENCY_EUR = 'EUR'
const CURRENCY_USD = 'USD'
const CURRENCY_SYMBOLS = {
  [CURRENCY_EUR]: '€',
  [CURRENCY_USD]: '$',
}

export const ANY_DISTANCE = 'Partout'

function BackentEvent (raw) {
  const start = moment(raw.start)
  const end = moment(raw.end)
  const duration = moment.duration(end.diff(start, 'days')).humanize()

  const currency = raw.organization.currency

  const model = {
    id: raw.slug,
    name: raw.name,
    organization: raw.organization.name,
    summary: raw.summary,
    description: raw.description,
    url: raw.external_url,
    cost: raw.price,
    readable_cost: `${Math.round(raw.price / 100)}${CURRENCY_SYMBOLS[currency]}`,
    start: start,
    end: end,
    duration: duration,
    address: raw.location.address,
    lat: raw.location.latitude,
    lng: raw.location.longitude,
    distance: null,

    computeDistance: (lat, lng) => {
      model.distance = Math.round(geolib.getDistance(
        {latitude: lat, longitude: lng},
        {latitude: model.lat, longitude: model.lng},
        1000,  // 1km accuracy
      ) / 1000.0)  // get the distance in kilometers
    },
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
