import geolib from 'geolib'
import moment from 'moment'

export const AVAILABLE_DISTANCES = {
  10: '10km',
  50: '50km',
  250: '250km',
  500: '500km',
}

export const ANY_DISTANCE = 'Partout'


function BackentLarpModel (raw) {
  const start = moment(raw.start)
  const end = moment(raw.end)
  const duration = moment.duration(end.diff(start, 'days')).humanize()

  return {
    id: raw.slug,
    name: raw.name,
    organization: raw.organization,
    location: raw.location,
    summary: raw.summary,
    description: raw.description,
    url: raw.external_url,
    cost: raw.price,
    readable_cost: `${Math.round(raw.price / 100)}€`,  // TODO: use org currency
    start: start,
    end: end,
    duration: duration,
    address: raw.address,  // nope, location :(
    lat: raw.lat,
    lng: raw.lng,
    distance: null,

    computeDistance: (lat, lng) => {
      model.distance = Math.round(geolib.getDistance(
        {latitude: lat, longitude: lng},
        {latitude: model.lat, longitude: model.lng},
        1000,  // 1km accuracy
      ) / 1000.0)  // get the distance in kilometers
    },
  }
}


export function transformBackentData (rawCollection) {
  const larps = rawCollection.map((rawLarp) => {
    try {
      return BackentLarpModel(rawLarp)
    } catch (err) {
      console.warn(`parsing larp data for ${rawLarp.name} failed: ${err}`)
    }
  })
  return larps.sort((a, b) => a.start - b.start)
}
