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

##
## Define paths
sources =
  styles   : 'public/css/sass/application.scss'
  scripts  : 'public/js/scripts/*.js'
  svg_icons: 'public/fonts/svg-icons/*.svg'

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
      .pipe gulp.dest destinations.styles

  gulp.src sources.styles
      .pipe (sass({sourcemap: true})).on 'error', (err) -> console.log err.message
      #.pipe sourcemaps.init({loadMaps: true})
      #.pipe autoprefixer { browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'], cascade: false}
      #.pipe sourcemaps.write()
      .pipe concat('application.css')
      .pipe rename({suffix: '.min'})
      .pipe minifyCSS()
      .pipe gulp.dest destinations.styles

##
## Task scripts:
##
gulp.task 'scripts', ->
  gulp.src mainBowerFiles()
      .pipe filter('*.js')
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
      .pipe iconfontCss {fontName: 'icons', targetPath: '../css/icons.css', fontPath: '../fonts/'}
      .pipe iconfont {fontName: 'icons'}
      .pipe gulp.dest destinations.fonts

##
## Task watch
##
gulp.task 'watch', ['server'], ->
  gulp.watch ['bower.json', sources.styles], ['styles']
  gulp.watch ['bower.json', sources.scripts], ['scripts']
  #gulp.watch(sources.app, ['app']).on 'change', server.restart

##
## Task server:
##
gulp.task 'server', ->
  runSequence 'build', ->
    server.listen {path: 'app.js'}

##
## Build tasks
##
gulp.task 'build', ['styles', 'scripts', 'svg-icons']

##
## Create default task
##
gulp.task 'default', ['build']