// GULP
var gulp = require('gulp');

// PLUGINS
var rename = require('gulp-rename');        // change the name of the output file { /dirname/prefix-basename-suffix.extname }
var cleanCSS = require('gulp-clean-css');   // compiles css
var csslint = require('gulp-csslint');      // shows css errors
var less = require('gulp-less');            // converts less to css
var uglify = require('gulp-uglify');        // uglifies javascript
var concat = require('gulp-concat');        // concatenating javascript


// TASKS

gulp.task('css-verify', function() {
  gulp.src('less/**/*.less')
    .pipe(csslint())
    .pipe(csslint.formatter())
});

gulp.task('less', function() {
  gulp.src('less/master.less')
    .pipe(rename({ suffix: "-min" }))
    .pipe(less())

    .pipe(gulp.dest('assets/css'))
});

gulp.task('minify-css', function() {
  return gulp.src('assets/css/master-min.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('assets/css'));
});

gulp.task('concatJs', function() {
  gulp.src('js/scripts/*.js')
    .pipe(concat('all-scripts-min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'))
});

gulp.task('uglifyJs', function() {
  gulp.src('js/*.js')
    .pipe(rename({ suffix: "-min" }))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'))
});


// WATCH

gulp.task('watch', function() {
  gulp.watch('./less/**/*.less', ['css-verify']);
  gulp.watch('./less/**/*.less', ['less']);
  gulp.watch('./assets/css/master-min.css', ['minify-css']);
  gulp.watch('./js/scripts/*.js', ['concatJs']);
  gulp.watch('./js/*.js', ['uglifyJs']);
});



// DEFAULT TASK

gulp.task('default', function() {
  console.log('\n\nGULP COMMANDS: \n$ gulp watch (less and js auto compiles to assets) \n$ gulp less (compiles to css) \n$ gulp minify-css (minifies CSS) \n$ gulp concatJs (concat all /scripts/ files) \n$ gulp uglifyJs (uglifies javascript)\n\n');
});
