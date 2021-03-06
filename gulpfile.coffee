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
mocha          = require('gulp-mocha')

##
## Define paths
sources =
  styles     : 'public/css/sass/**/*.scss'
  scripts    : 'public/js/scripts/*.js'
  svg_icons  : 'public/fonts/svg-icons/*.svg'
  need_reload: ['server.js', 'app.js', 'routes/*', 'models/*', 'views/**/*']
  tests      : 'spec/**/*.spec.js'

destinations =
  styles : 'public/css'
  scripts: 'public/js'
  fonts  : 'public/fonts'

##
## Task fonts
##
gulp.task 'iconfont', ->
  gulp.src sources.svg_icons
      .pipe iconfontCss {fontName: 'icons', targetPath: '../css/sass/_icons.scss', fontPath: '../../fonts/'}
      .pipe iconfont {fontName: 'icons', normalize: true}
      .pipe gulp.dest destinations.fonts

##
## Task styles:
##
gulp.task 'styles', ['iconfont'], ->
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
      # .pipe uglify()
      .pipe concat('vendor.min.js')
      .pipe gulp.dest destinations.scripts

  gulp.src sources.scripts
      .pipe concat('application.min.js')
      # .pipe uglify()
      .pipe gulp.dest destinations.scripts

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
## Task test
##
gulp.task 'test', ->
  gulp.src sources.tests, read: false
      .pipe mocha(reporter: 'spec')
      .once 'end', -> process.exit()

##
## Task test
##
gulp.task 'build', ['jshint', 'styles', 'scripts']

##
## Create default task
##
gulp.task 'default', ['build']
