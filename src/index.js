const API_KEY = 'AIzaSyCDjYyOPVtg43sXCTvJtdHtlJySKa4EN0I';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SPREADSHEET_ID = '1zQZM5nrsHXLO74MXa7EBnL4aUiJe6BhSvIRWWbRtDNc'
const SPREADSHEET_RANGE = 'PROCHAINS GNs FRANCE'

const preItem = document.getElementById('content');

function initClient() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    apiKey: API_KEY,
  }).then(function () {
    listMajors()
  });
}

function appendPre(row) {
  const item = document.createElement('tr')
    item.innerHTML = row.map((col) => `<td>${col}</td>`).join('')
    preItem.appendChild(item)
}

function listMajors() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: SPREADSHEET_RANGE,
  }).then(function(response) {
    for (let [idx, row] of response.result.values.entries()) {
      if (idx < 3) continue
        appendPre(row)
    }
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });
}

window.bootstrapApplication = function () {
  gapi.load('client:auth2', initClient);
}
