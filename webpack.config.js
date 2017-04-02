const webpack = require('webpack')
const webpackDefaults = require('systematic').webpack_get_defaults(__dirname)

webpackDefaults.module.rules.push({ test: /\.vue$/, loader: 'vue-loader' })
webpackDefaults.module.rules.push({ test: /\.csv$/, loader: 'dsv-loader' })

webpackDefaults.plugins.push(
  // For Bootstrap to work
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
  }),
  // Selected locales in momentJS
  new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(fr)$/)
)

module.exports = webpackDefaults
