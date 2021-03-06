gulp = require 'gulp'
gulpCoffee = require 'gulp-coffee'
gulpPug = require 'gulp-pug'
gulpChmod = require 'gulp-chmod'

## npm run pug / npx gulp pug: builds index.html from index.pug etc.
exports.pug = pug = ->
  gulp.src '*.pug'
  .pipe gulpPug pretty: true
  .pipe gulpChmod 0o644
  .pipe gulp.dest './'

## npm run coffee / npx gulp coffee: builds index.js from index.coffee etc.
exports.coffee = coffee = ->
  gulp.src 'index.coffee', ignore: 'gulpfile.coffee'
  .pipe gulpCoffee()
  .pipe gulpChmod 0o644
  .pipe gulp.dest './'

## npm run build / npx gulp build: all of the above
exports.build = build = gulp.series pug, coffee

## npm run watch / npx gulp watch: continuously update above
exports.watch = watch = ->
  gulp.watch '*.pug', ignoreInitial: false, pug
  gulp.watch 'index.coffee', ignoreInitial: false, coffee

exports.default = pug
