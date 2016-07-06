var gulp = require('gulp'),
    gulpWatch = require('gulp-watch'),
    del = require('del'),
    runSequence = require('run-sequence'),
    argv = process.argv,
    appDir= 'app',
    testDir= 'test',
    testDest= 'www/build/test',
    typingsDir= 'typings';


/**
 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */
gulp.task('serve:before', ['watch']);
gulp.task('emulate:before', ['build']);
gulp.task('deploy:before', ['build']);
gulp.task('build:before', ['build']);

// we want to 'watch' when livereloading
var shouldWatch = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1;
gulp.task('run:before', [shouldWatch ? 'watch' : 'build']);

/**
 * Ionic Gulp tasks, for more information on each see
 * https://github.com/driftyco/ionic-gulp-tasks
 *
 * Using these will allow you to stay up to date if the default Ionic 2 build
 * changes, but you are of course welcome (and encouraged) to customize your
 * build however you see fit.
 */
var buildBrowserify = require('ionic-gulp-browserify-typescript');
//var buildWebpack = require('ionic-gulp-webpack');
var buildSass = require('ionic-gulp-sass-build');
var copyHTML = require('ionic-gulp-html-copy');
var copyFonts = require('ionic-gulp-fonts-copy');
var copyScripts = require('ionic-gulp-scripts-copy');

var isRelease = argv.indexOf('--release') > -1;

gulp.task('watch', ['clean'], function(done){
  runSequence(
    ['sass', 'html', 'fonts', 'scripts', 'assets'],
    function(){
      gulpWatch('app/**/*.scss', function(){ gulp.start('sass'); });
      gulpWatch('app/**/*.html', function(){ gulp.start('html'); });
      buildBrowserify({ watch: true }).on('end', done);
//      buildWebpack({ watch: true }).then(done);    
    }
  );
});

gulp.task('build', ['clean'], function(done){
  runSequence(
    ['sass', 'html', 'fonts', 'scripts', 'assets'],
    function(){
//      buildWebpack().then(done);
      buildBrowserify({
        minify: isRelease,
        browserifyOptions: {
          debug: !isRelease
        },
        uglifyOptions: {
          mangle: false
        }
      }).on('end', done);
    }
  );
});

gulp.task('sass', buildSass);copyScripts
gulp.task('html', copyHTML);
gulp.task('fonts', copyFonts);
gulp.task('scripts', copyScripts);
gulp.task('clean', function(){
  return del('www/build');
});

gulp.task("assets", function() {
    return gulp.src(["app/assets/images/*"])
        .pipe(gulp.dest("www/build/images"));
});

gulp.task('clean-test', () => {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del([testDest]).then((paths) => {
    console.log('Deleted', paths && paths.join(', ') || '-');
  });
});

// run jasmine unit tests using karma with PhantomJS2 in single run mode
gulp.task('karma', (done) => {
  let karma = require('karma');
  let karmaOpts = {
    configFile: join(process.cwd(), testDir, 'karma.config.js'),
    singleRun: true,
  };
  new karma.Server(karmaOpts, done).start();
});

// run jasmine unit tests using karma with Chrome, Karma will be left open in Chrome for debug
gulp.task('karma-debug', (done) => {

  let karma = require('karma');
  let karmaOpts = {
    configFile: join(process.cwd(), testDir, 'karma.config.js'),
    singleRun: false,
    browsers: ['Chrome'],
    reporters: ['mocha'],
  };
  new karma.Server(karmaOpts, done).start();
});

// run tslint against all typescript
gulp.task('lint', () => {
  let tslint = require('gulp-tslint');
  return gulp.src(join(appDir, '**/*.ts'))
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

// build unit tests, run unit tests, remap and report coverage
gulp.task('unit-test', (done) => {
  runSequence(
    ['lint', 'html'],
    'karma',
    (done)
  );
});