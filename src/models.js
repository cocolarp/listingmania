import moment from 'moment'

import {parsePrice} from 'src/cost_utils.js'

export const CODE_ANY = '__choice_any__'
export const FRANCE = 'France'

const COLUMNS = [
  'name',
  'organization',
  'description',
  'url',
  'raw_cost',
  'raw_npc_cost',
  'raw_start',
  'raw_duration',
  'raw_location',
  'address',
  'comment',
]

const DURATION_HOURS = 'hours'
const DURATION_DAY = 'day'
const DURATION_FEW_DAYS = 'few_days'
const DURATION_MORE_3_DAYS = 'more_3_days'

// FIXME(vperron): Translate this.
export const DURATIONS = {
  [DURATION_HOURS]: 'Quelques heures',
  [DURATION_DAY]: 'Une journée',
  [DURATION_FEW_DAYS]: 'Quelques jours',
  [DURATION_MORE_3_DAYS]: 'Plus de 3 jours',
}


function parseLocation (rawLocation) {
  let region = null
  let country = null
  try {
    region = parseInt(rawLocation, 10)
    if (isNaN(region)) throw new Error('region was NaN')
    region = '' + region
    country = FRANCE  // FIXME(vperron): Get an actual country list FFS, with ISO country codes
  } catch (exc) {
    if (rawLocation && rawLocation !== '') {
      region = 'N/A'
      country = rawLocation  // safe bet as of now
    } else {
      throw new Error(`location '${rawLocation}' was not parseable`)
    }
  }
  return {region, country}
}


function parseDuration (rawDuration) {
  switch (rawDuration) {
    case 'Plus de 3 jours':
      return DURATION_MORE_3_DAYS
    case '2 ou 3 jours':
      return DURATION_FEW_DAYS
    case '1 journée':
      return DURATION_DAY
    case 'Quelques heures':
      return DURATION_HOURS
  }
  throw new Error(`duration '${rawDuration}' was not parseable`)
}

function parseMoment (rawDate) {
  moment.locale('fr')
  const m = moment(rawDate, 'ddd D MMM YYYY')
  const check = m.format('ddd D MMM YYYY')
  if (m.isValid() && check === rawDate) {
    return m
  }
  throw new Error(`date '${rawDate}' was invalid`)
}

function lineToDict (line) {
  return line.reduce((obj, value, i) => {
    obj[COLUMNS[i]] = value
    return obj
  }, {})
}

function LarpModel (raw, id) {

  const price = parsePrice(raw.raw_cost)
  let npc_price = null
  if (raw.raw_npc_cost === 'x') {
    npc_price = parsePrice(raw.raw_cost)
  } else {
    npc_price = parsePrice(raw.raw_npc_cost)
  }


  const {country, region} = parseLocation(raw.raw_location)

  const start = parseMoment(raw.raw_start)
  const duration = parseDuration(raw.raw_duration)
  const end = start.clone().add(duration, 'days')

  return {
    id: id,  // just there for the 'for' key
    name: raw.name,
    organization: raw.organization,
    description: raw.description,
    url: raw.url,
    cost: price.amount,
    currency: price.currency,
    npc_cost: npc_price.amount,
    start: start,
    end: end,
    duration: duration,
    country: country,
    region: region,
    address: raw.address,
    comment: raw.comment,
  }
}

export function transformRawData (raw) {
  raw.shift()  // remove Cocolarp headline
  raw.shift()  // remove titles, unusable anyway

  let i = 0
  const larps = []
  for (const rawLarp of raw.map(lineToDict)) {
    try {
      larps.push(LarpModel(rawLarp, i))
    } catch (err) {
      console.warn(`parsing larp data for ${rawLarp.name} failed: ${err}`)
    }
    i += 1
  }

  return larps.sort((a, b) => a.start - b.start)
}
