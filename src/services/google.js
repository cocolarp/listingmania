/* global google */

let PlacesService = null

if (typeof google !== 'undefined') {
  PlacesService = new google.maps.places.PlacesService(document.createElement('div'))
}

export function getPlaceDetails (placeId) {
  return new Promise((resolve, reject) => {
    if (!PlacesService) reject(new Error('Google Maps was not initialized!'))
    PlacesService.getDetails({placeId: placeId}, function (value, err) {
      if (err === 'OK' && value) {
        resolve(value)
      } else {
        reject(err)
      }
    })
  })
}
