/* global google */

const PlacesService = new google.maps.places.PlacesService(document.createElement('div'))

export function getPlaceDetails (placeId) {
  return new Promise((resolve, reject) => {
    PlacesService.getDetails({placeId: placeId}, function (value, err) {
      if (err === 'OK' && value) {
        resolve(value)
      } else {
        reject(err)
      }
    })
  })
}
