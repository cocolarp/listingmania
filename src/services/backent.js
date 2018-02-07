import urljoin from 'url-join'
import {basicXhr} from './utils.js'


let baseUrl = null

export const client = {
  init: function (url) {
    baseUrl = url
  },
  getEvents () {
    return basicXhr(urljoin(baseUrl, 'api/events/'))
  },
  getToken: async function (username, password) {
    const data = await basicXhr(urljoin(baseUrl, 'token/'), 'POST', JSON.stringify({
      'username': username,
      'password': password,
    }))
    if (data.token) {
      localStorage.setItem('token', data.token)
      return data.token
    }
    throw "unexpected error"
  },
  getUser () {
    return basicXhr(urljoin(baseUrl, 'profile/'), 'GET', null, {
      'Authorization': `Token ${localStorage.getItem('token')}`,
    })
  },
  postLike: async function (eventSlug, doLike = true) {
    const url = urljoin(baseUrl, `api/events/${eventSlug}/like/`)
    try {
      await basicXhr(
        url,
        'POST',
        null, {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        }
      )
      return true
    } catch (response) {
      if (response.status === 204) return false // 204 no content => deleted
      throw response
    }
  },
}
