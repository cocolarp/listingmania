import urljoin from 'url-join'
import {basicXhr} from './utils.js'


let baseUrl = null

export const client = {
  init: function (url) {
    baseUrl = url
  },
  getEvents: function () {
    return basicXhr(urljoin(baseUrl, 'api/events/'))
  }
}
