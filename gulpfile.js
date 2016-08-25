var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var print = require('gulp-print');
var merge = require('merge-stream');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');

var $ = require('gulp-load-plugins')({
  lazy: true
});

var paths = {
  sass: ['./scss/**/*.scss'],
  js: [ 'www/js/**/*.js','www/templates/**/js/*.js'],
  libJs: [ 'www/js/**/*.js']
};

gulp.task('default', ['sass']);

gulp.task('sass', function (done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});
gulp.task('jsF', function (done) {
  var mainJs = gulp
    .src(paths.js)
    .pipe(print())
    .pipe($.concat('app.min.js'))

    .pipe(gulp.dest('www/jsBuild'));
  var templatesJs = gulp
    .src(paths.js)
    .pipe(print())
    .pipe(ngAnnotate())
    .pipe($.concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('www/jsBuild'));
  merge(mainJs);
  return done();
});

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['jsF']);
});

gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
function handleError(error) {
}

