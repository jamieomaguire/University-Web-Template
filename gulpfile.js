var gulp = require('gulp');
// Requires the gulp-sass plugin
var sass = require('gulp-sass');
//Requires browser-sync
var browserSync = require('browser-sync').create();
//Require useref
var useref = require('gulp-useref');
// Other requires
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
// Require run-sequence
var runSequence = require('run-sequence');
//Require autoprefixer
var autoprefixer = require('gulp-autoprefixer');
// Require jade
var jade = require('gulp-jade');


// Development Tasks


// Sass complie to CSS
gulp.task('sass', function() {
  return gulp.src('app/assets/css/main.sass') // Get source files with gulp.src
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('app/assets/css')) // Outputs the file in the destination folder
    .pipe(browserSync.reload({
      stream: true
    }))
});

//Jade complie to html
gulp.task('jade', function() {
  return gulp.src('app/assets/jade/*.jade') // Get source files with gulp.src
    .pipe(jade()) // Using gulp-sass
    .pipe(gulp.dest('app')) // Outputs the file in the destination folder
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Watch files and reload browser
gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('app/assets/css/main.sass', ['sass']);
  //Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/assets/jade/*.jade', browserSync.reload);
  gulp.watch('app/assets/js/**/*.js', browserSync.reload);
  //Other watchers
});

//Browser Sync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})


// Production Tasks

//autoprefixer
gulp.task('autoprefixer', function() {
  gulp.src('app/assets/css/main.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('app/assets'));
});

// useref task
gulp.task('useref', function() {
  return gulp.src('app/*html')
      .pipe(useref())
      // Minifies only if it's a Javascript file
      .pipe(gulpIf('*.js', uglify()))
      //Minifies only if it's a CSS file
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest('dist'))
});

// Minify Images
gulp.task('images', function() {
  return gulp.src('app/assets/img/**/*.+(png|jpg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/img'))
});

//Copy fonts over to dist
gulp.task('fonts', function() {
  return gulp.src('app/assets/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

// Clean dist
gulp.task('clean:dist', function() {
  return del.sync('dist');
})


// Run Sequence
gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'jade', 'useref', 'images', 'fonts'],
    callback
  )
})

// Default Sequence - type 'gulp' to run
gulp.task('default', function (callback) {
  runSequence(['sass', 'jade', 'browserSync', 'watch'],
    callback
  )
})
