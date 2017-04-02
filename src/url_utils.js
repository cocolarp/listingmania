/* global moment */

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

function getStringParam (key) {
  const value = getQueryParam(key)
  if (value && value !== '') return value
  return null
}

export function updateParamsWith (key, value, toggle = false) {
  const urlParams = getParams(window.location.href)
  if (toggle && urlParams[key] === value) {
    urlParams[key] = undefined
  } else {
    urlParams[key] = value
  }
  const stringParams = queryString.stringify(urlParams, {encode: false})
  history.pushState(null, '', `?${stringParams}`)
}

export function getIsFree () {
  const isFree = getQueryParam('is_free')
  return isFree == 'true'  // eslint-disable-line eqeqeq
}

export function getMonth () {
  return getStringParam('month')
}

export function getDuration () {
  return getStringParam('duration')
}

export function getCountry () {
  return getStringParam('country')
}

export function getRegion () {
  return getStringParam('region')
}
