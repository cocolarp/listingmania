const webpack = require('webpack')
const webpackDefaults = require('systematic').webpack_get_defaults(__dirname)

webpackDefaults.module.rules.push({ test: /\.csv$/, loader: 'dsv-loader' })

function getOr (x, dflt = null) {
  return x ? JSON.stringify(x) : dflt
}

webpackDefaults.devtool = 'eval'

webpackDefaults.module.rules.push({ test: /\.webp$/, use: 'url-loader?limit=50000' })

webpackDefaults.plugins.push(
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /fr/)
)
webpackDefaults.plugins.push(
  new webpack.DefinePlugin({
    BACKENT_URL: getOr(process.env.BACKENT_URL),
  })
)

module.exports = webpackDefaults
