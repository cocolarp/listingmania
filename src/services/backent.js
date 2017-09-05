import urljoin from 'url-join'
import {basicXhr} from './utils.js'


let baseUrl = null

export const client = {
  init: function (url) {
    baseUrl = url
  },
  getEvents: function () {
    return basicXhr(urljoin(baseUrl, 'api/events/'))
  },
  getToken: async function (username, password) {
    const data = await basicXhr(urljoin(baseUrl, 'token/'), 'POST', JSON.stringify({
      'username': username,
      'password': password,
    }))
    return data.token
  },
  getUser: function () {
    return basicXhr(urljoin(baseUrl, 'profile/'), 'GET', null, {
      'Authorization': `Token ${localStorage.getItem('token')}`,
    })
  },
}
