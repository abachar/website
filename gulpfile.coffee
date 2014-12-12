gulp           = require('gulp')
sass           = require('gulp-ruby-sass')
server         = require('gulp-develop-server')
runSequence    = require('run-sequence')
filter         = require('gulp-filter')
iconfont       = require('gulp-iconfont')
iconfontCss    = require('gulp-iconfont-css')
autoprefixer   = require('gulp-autoprefixer')
minifyCSS      = require('gulp-minify-css')
concat         = require('gulp-concat')
rename         = require('gulp-rename')
sourcemaps     = require('gulp-sourcemaps')
uglify         = require('gulp-uglify')
mainBowerFiles = require('main-bower-files')
jshint         = require('gulp-jshint')

##
## Define paths
sources =
  styles     : 'public/css/sass/**/*.scss'
  scripts    : 'public/js/scripts/*.js'
  svg_icons  : 'public/fonts/svg-icons/*'
  need_reload: ['server.js', 'app.js', 'routes/*', 'models/*', 'views/**/*']

destinations =
  styles : 'public/css'
  scripts: 'public/js'
  fonts  : 'public/fonts'

##
## Task styles:
##
gulp.task 'styles', ->
  gulp.src mainBowerFiles()
      .pipe filter('*.css')
      .pipe concat('vendor.min.css')
      .pipe minifyCSS()
      .pipe gulp.dest destinations.styles

  gulp.src sources.styles
      .pipe filter 'application.scss'
      .pipe (sass()).on 'error', (err) -> console.log err.message
      .pipe sourcemaps.init({loadMaps: true})
      #.pipe autoprefixer { browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'], cascade: false}
      .pipe sourcemaps.write()
      .pipe concat('application.css')
      .pipe rename({suffix: '.min'})
      .pipe minifyCSS { keepBreaks: true }
      .pipe gulp.dest destinations.styles

##
## Task scripts:
##
gulp.task 'scripts', ->
  gulp.src mainBowerFiles()
      .pipe filter('*.js')
      .pipe uglify()
      .pipe concat('vendor.min.js')
      .pipe gulp.dest destinations.scripts

  gulp.src sources.scripts
      .pipe uglify()
      .pipe concat('application.min.js')
      .pipe gulp.dest destinations.scripts

##
## Task fonts
##
gulp.task 'svg-icons', ->
  gulp.src sources.svg_icons
      .pipe filter('*.svg')
      .pipe iconfontCss {fontName: 'icons', targetPath: '../css/icons.css', fontPath: '../fonts/'}
      .pipe iconfont {fontName: 'icons', normalize: true}
      .pipe gulp.dest destinations.fonts

##
## Task JSHint
##
gulp.task 'jshint', ->
  gulp.src ['server.js', 'app.js', 'routes/*', 'models/*']
      .pipe jshint '.jshintrc'
      .pipe jshint.reporter 'jshint-stylish'

##
## Task watch
##
gulp.task 'watch', ['server'], ->
  gulp.watch ['bower.json', sources.styles], ['styles']
  gulp.watch ['bower.json', sources.scripts], ['scripts']
  gulp.watch(sources.need_reload).on 'change', server.restart

##
## Task server:
##
gulp.task 'server', ->
  runSequence 'build', ->
    server.listen {path: 'server.js'}

##
## Build tasks
##
gulp.task 'build', ['jshint', 'styles', 'scripts', 'svg-icons']

##
## Create default task
##
gulp.task 'default', ['build']