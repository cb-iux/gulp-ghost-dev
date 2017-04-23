// GULP
var gulp = require('gulp');

// PLUGINS
var fs = require('fs');
var sourcemaps = require('gulp-sourcemaps');  // create sourcemaps of files
var runSequence = require('run-sequence');    // runs sequences in linear order
var clean = require('gulp-clean');            // delete folders and files
var zip = require('gulp-zip');                // zip files
var rename = require('gulp-rename');          // change the name of the output file { /dirname/prefix-basename-suffix.extname }
var bump = require('gulp-bump');              // change(bumps) version numbers
var exec = require('child_process').exec;

var cleanCSS = require('gulp-clean-css');     // compiles css
var csslint = require('gulp-csslint');        // shows css errors
var less = require('gulp-less');              // converts less to css

var jshint = require('gulp-jshint');          // shows javascript hints and errors
var uglify = require('gulp-uglify');          // uglifies javascript
var concat = require('gulp-concat');          // concatenating javascript


// PLUGINS NOT IN USE
//var lessReporter = require('gulp-csslint-less-reporter'); // shows less errors
//var lesshint = require('gulp-lesshint');    // shows less errors




// TASKS

  // LESS AND CSS TASKS

gulp.task('style-verify', function() {
  gulp.src('less/master.less')
    .pipe(rename({ suffix: "-less-error-map" }))
    .pipe(less())
    .pipe(gulp.dest('.errors/style'))
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
    .pipe(gulp.dest('assets/css'))
});

  // JAVSCRIPT TASKS

gulp.task('js-verify', function() {
  gulp.src('js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter())
});

gulp.task('concat-and-uglify-all-scripts-js', function() {
  gulp.src('js/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter())
    .pipe(concat('all-scripts-min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'))
});

gulp.task('uglify-js', function() {
  gulp.src('js/*.js')
    .pipe(rename({ suffix: "-min" }))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'))
});



// WATCH

gulp.task('watch', function() {
  gulp.watch('./less/**/*.less', ['less']);
  gulp.watch('./assets/css/master-min.css', ['minify-css']);
  gulp.watch('./js/scripts/*.js', ['concat-and-uglify-all-scripts-js']);
  gulp.watch('./js/*.js', ['uglify-js']);
});

gulp.task('watch-and-verify', function() {
  gulp.start('js-verify')
  gulp.watch('./less/**/*.less', ['style-verify']);
  gulp.watch('./js/**/*.js', ['js-verify']);
  gulp.watch('./less/**/*.less', ['less']);
  gulp.watch('./assets/css/master-min.css', ['minify-css']);
  gulp.watch('./js/scripts/*.js', ['concat-and-uglify-all-scripts-js']);
  gulp.watch('./js/*.js', ['uglify-js']);
});



// UPDATE FILES

gulp.task('update-files', function(callback) {
  runSequence(
    'less',
    'minify-css',
    'concat-and-uglify-all-scripts-js',
    'uglify-js',
    callback
  )
});



// ARCHIVE

gulp.task('archive', ['update-files'], function() {

    var packageJSON = JSON.parse(fs.readFileSync('package.json', {encoding: 'utf8'}));
    var version = packageJSON.version;

    var commands = [
        'zip -r ./dist/v' + version + '.zip ./',
        '-x "*node_modules*"',
        '-x "*gulp*"',
        '-x "gulpfile.js"',
        '-x "js*"',
        '-x "less*"',
        '-x "dist*"',
        '-x ".gitignore"',
        '-x ".csslintrc"',
        '-x ".jshintrc"',
        '-x ".git*"',
        '-x "README.md"'
    ];

    try {fs.mkdirSync('dist');} catch(e) {}

    exec(commands.join(' '));
});



// BUMP

gulp.task('bump', function() {
  return gulp.src(['./package.json'])
    .pipe(bump({type: 'patch'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump-minor', function() {
  return gulp.src(['./package.json'])
    .pipe(bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump-major', function() {
  return gulp.src(['./package.json'])
    .pipe(bump({type: 'major'}))
    .pipe(gulp.dest('./'));
});



// DIST

gulp.task('release', function() {
    runSequence('bump', 'archive');
});

gulp.task('release-minor', function() {
    runSequence('bump-minor', 'archive');
});

gulp.task('release-major', function() {
    runSequence('bump-major', 'archive');
});



// DEFAULT TASK

gulp.task('default', function() {
  console.log('\n\nGULP COMMANDS: \n$ gulp watch (all less and js auto compiles to assets) \n$ gulp watch-and-verify (all less and js auto compiles to assets with verification) \n$ gulp less (compiles to css) \n$ gulp minify-css (minifies css) \n$ gulp concat-and-uglify-all-scripts-js (concat all scripts files in the scripts folder) \n$ gulp uglify-js (uglifies javascript)\n\nBUILDS: \n$ gulp release (release 0.0.1) \n$ gulp release-minor (release 0.1.0) \n$ gulp release-major (release 1.0.0)\n\n');
});
