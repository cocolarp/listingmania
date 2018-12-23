/* global google, GoogleLoad */

let PlacesService = null

export function getPlaceDetails (placeId) {
  return new Promise(async function (resolve, reject) {
    try {
      await GoogleLoad
    } catch (err) {
      reject(err)
    }

    PlacesService = new google.maps.places.PlacesService(document.createElement('div'))

    if (!PlacesService) reject(new Error('Google Maps was not initialized!'))
    PlacesService.getDetails({ placeId: placeId }, function (value, err) {
      if (err === 'OK' && value) {
        resolve(value)
      } else {
        reject(err)
      }
    })
  })
}
