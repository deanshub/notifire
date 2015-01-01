var gulp = require('gulp');
var prefix = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var plumber = require('gulp-plumber');
var cssshrink = require('gulp-cssshrink');
var nodemon = require('gulp-nodemon');
var inject = require("gulp-inject");
var bowerFiles = require('main-bower-files');
var htmlmin = require('gulp-htmlmin');
var bower = require('gulp-bower');
var cp = require('child_process');

gulp.task('scripts', function () {
	gulp.src('../client/src/scripts/**/*.js')
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest('../client/build/scripts'));
});

gulp.task('styles', function () {
	gulp.src('../client/src/styles/**/*.css')
		.pipe(plumber())
		.pipe(prefix('last 2 versions'))
		.pipe(cssshrink())
		.pipe(gulp.dest('../client/build/styles'));
});

gulp.task('images', function () {
	gulp.src('../client/src/images/*')
		.pipe(plumber())
		.pipe(imagemin())
		.pipe(gulp.dest('../client/build/images'));
});

gulp.task('views', function() {
  gulp.src('../client/src/views/**/*.ejs')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('../client/build/views'));
});

gulp.task('watch', function () {
	gulp.watch('../client/src/scripts/**/*.js',['scripts']);
	gulp.watch('../client/src/styles/**/*.css',['styles']);
	gulp.watch('../client/src/images/*',['images']);
	gulp.watch('../client/bower.json',['indexInjection']);
	gulp.watch('../client/src/views/**/*.ejs',['views']);
	gulp.watch('../client/src/index.ejs',['indexInjection']);
});

gulp.task('nodemon', function () {
	nodemon({ script: 'app.js', ext: 'js ejs',ignore: ['client/**/*']}).on('restart', function () {
		console.log('restarted!')
	});
});

gulp.task('node', function () {
	var server = cp.spawn("node",["app.js"]);

	server.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
	});

	server.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});
});

gulp.task('bowerDeps', function() {
	bower({cwd: '../client' });
});

gulp.task('copyComps', function () {
	gulp.src('../client/src/bower_components/**/*')
		.pipe(gulp.dest('../client/build/bower_components'));
});

gulp.task('indexInjection', function () {
  var target = gulp.src('../client/src/index.ejs');
  var bowerSources = gulp.src(bowerFiles({paths:{bowerrc:'../client/.bowerrc',bowerJson:'../client/bower.json',bowerDirectory:'../client/src/bower_components'}}), {read: false});
  var regularSources = gulp.src(['!../client/build/scripts/bower_components/**/*','../client/build/scripts/**/*.js','../client/build/styles/**/*.css'], {read: false});

  gulp.start('copyComps');

  return target.pipe(inject(bowerSources,{name:'bower',relative:true,ignorePath:'*'}))
  	.pipe(inject(regularSources,{relative:true,ignorePath:'../build/'}))
    .pipe(gulp.dest('../client/build'));
});

gulp.task('default',['images', 'styles', 'bowerDeps', 'scripts', 'views', 'indexInjection', 'watch', 'nodemon']);
gulp.task('start',['images', 'styles', 'bowerDeps', 'scripts', 'views', 'indexInjection', 'node']);
gulp.task('build',['images', 'styles', 'bowerDeps', 'scripts', 'views', 'indexInjection']);