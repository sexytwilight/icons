
# npm install -save-dev react@latest jquery@latest semantic-ui@latest aui@latest baconjs@latest react-bacon@latest
Global = global or window
React = Global.React = require 'react/addons'
jQuery = Global.jQuery = require 'jquery'
require 'semantic-ui/dist/semantic.min.js'
exports = module.exports = {
  React
  Bacon: require 'baconjs'
  Aui: require 'aui'
}
exports.Bacon.Mixin = require 'react-bacon'
