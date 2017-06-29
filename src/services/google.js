/* global google, gapi */

const PlacesService = new google.maps.places.PlacesService(document.createElement('div'))

function gapiLoad () {
  return new Promise((resolve, reject) => {
    gapi.load('client', resolve)
  })
}

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

export async function getGoogleSheetsData (apiKey, spreadsheetId, range) {
  await gapiLoad()
  await gapi.client.init({
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    apiKey,
  })
  const {result} = await gapi.client.sheets.spreadsheets.values.get({spreadsheetId, range})
  return result.values
}
