import moment from 'moment'
import queryString from 'query-string'

function parseUri (uri) {
  // https://gist.github.com/jlong/2428561
  var parser = document.createElement('a')
  parser.href = uri
  return {
    protocol: parser.protocol,
    hostname: parser.hostname,
    port: parser.port,
    pathname: parser.pathname,
    search: parser.search,
    hash: parser.hash,
    host: parser.host,
  }
}

function getParams (uri) {
  if (uri) {
    return queryString.parse(parseUri(uri).search)
  }
  return {}
}

function getQueryParam (key, dflt = null) {
  const value = getParams(window.location.href)[key]
  if ((value !== undefined) && (value != null)) return value
  return dflt
}

export function getStringParam (key) {
  const value = getQueryParam(key)
  if (value && value !== '') return value
  return null
}

export function getMomentParam (key) {
  const value = getStringParam(key)
  if (value) {
    const m = moment(value)
    if (m.isValid()) {
      return m
    }
  }
}

export function updateParamsWith (key, value) {
  const urlParams = getParams(window.location.href)
  if (urlParams[key] === value) return

  urlParams[key] = value
  const stringParams = queryString.stringify(urlParams, {encode: false})
  history.pushState(null, '', `?${stringParams}${window.location.hash}`)
}
