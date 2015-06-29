# npm install -g coffee-script@latest
# npm install -save-dev cake-gulp@latest browserify@latest watchify@latest coffee-reactify@latest vinyl-buffer@latest send@latest
require 'cake-gulp'
send = require 'send'
(require 'http')
  .createServer (request, response) ->
    log "--> #{request.url}"
    response.setHeader 'Cache-Control', 'private, no-cache, no-store, must-revalidate'
    response.setHeader 'Expires', '-1'
    response.setHeader 'Pragma', 'no-cache'
    send request, request.url, root: __dirname
      .pipe response
    request.on 'end', ->
      log "#{(if response.statusCode < 400 then green else red) "<-- [#{response.statusCode}] #{request.url}"}"
  .listen 80
pkg = require './package.json'
browserify = require 'browserify'
watchify = require 'watchify'
coffeereactify = require 'coffee-reactify'
buffer = require 'vinyl-buffer'
opts =
  entries: [ "./src/#{pkg.name}.cjsx" ]
  debug: true
opts[key] = value for own key, value of watchify.args when not key of opts
bundler = watchify browserify opts
  .transform { global: true }, coffeereactify
files = ("#{__dirname}/src/**/#{type}" for type in ['*.html', '*.min.*'])
task 'build:copy', 'Copies static files.', (options, callback) ->
  src files
    .pipe debug 'COPY: '
    .pipe dest "#{__dirname}/dist"
bundle = (options, callback) ->
  invoke 'build:copy'
  watch files, ['build:copy']
  bundler
    .bundle()
    .on 'error', log, 'Browserify Error'
    .pipe source "#{pkg.name}.js"
    .pipe buffer()
    # .pipe sourcemaps.init loadMaps: true
    # .pipe sourcemaps.write './'
    .pipe dest "#{__dirname}/dist"
    .pipe debug 'BUNDLE: '
task 'build', 'Bundles all the scripts with Browserify', bundle
bundler.on 'update', bundle
bundler.on 'log', log
