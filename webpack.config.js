const webpackDefaults = require('systematic').webpack_get_defaults(__dirname)

webpackDefaults.resolve.alias = {
  'moment': 'cassets/scripts/moment',
  'leaflet': 'moment',  // quite an ugly hack to avoid building & analyzing leaflet.
}

module.exports = webpackDefaults
