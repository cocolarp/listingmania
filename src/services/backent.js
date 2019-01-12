import urljoin from 'url-join'
import { basicXhr } from './utils.js'
import {
  clearUserData,
  getStoredToken,
  saveToken,
  setRemember,
  shouldRemember,
} from 'src/storage'


let baseUrl = null

export const client = {
  init: function (url) {
    baseUrl = url
    if (!shouldRemember()) {
      clearUserData()
    }
  },
  getEvents () {
    return basicXhr(urljoin(baseUrl, 'api/events/'))
  },
  getEvent: async function (slug) {
    return basicXhr(urljoin(baseUrl, `api/events/${slug}/`))
  },
  signup: async function (username, email, password1, password2) {
    await basicXhr(
      urljoin(baseUrl, 'json_signup/'),
      'POST',
      JSON.stringify({
        'username': username,
        'email': email,
        'password1': password1,
        'password2': password2,
      })
    )
  },
  getToken: async function (username, password, rememberMe) {
    const data = await basicXhr(urljoin(baseUrl, 'token/'), 'POST', JSON.stringify({
      'username': username,
      'password': password,
    }))
    if (data.token) {
      saveToken(data.token)
      if (rememberMe) setRemember()
      return data.token
    }
    throw new Error('unexpected error')
  },
  getUser () {
    return basicXhr(urljoin(baseUrl, 'profile/'), 'GET', null, {
      'Authorization': `Token ${getStoredToken()}`,
    })
  },
  postLike: async function (eventSlug, doLike = true) {
    const url = urljoin(baseUrl, `api/events/${eventSlug}/like/`)
    try {
      await basicXhr(
        url,
        'POST',
        null, {
          'Authorization': `Token ${getStoredToken()}`,
        }
      )
      return true
    } catch (response) {
      if (response.status === 204) return false // 204 no content => deleted
      throw response
    }
  },
}
