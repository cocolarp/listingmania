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
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function (module) {
      // this assumes your vendor imports exist in the node_modules directory
      return module.context && module.context.indexOf('node_modules') !== -1;
    }
  })
)

module.exports = webpackDefaults
