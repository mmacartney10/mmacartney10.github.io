var gulp = require('gulp');
var changed = require('gulp-changed');
var handlebars = require('gulp-compile-handlebars');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var nodemon = require('gulp-nodemon');
var path = require('path');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var server = require('gulp-express');
var sgc = require('gulp-sass-generate-contents');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var zip = require('gulp-zip');

/* ============================================================ *\
    WEBSITE CONFIGS
\* ============================================================ */

var config = {
	src: './_src',
	dest: './_build',
	views: '/views',
	styles: '/styles',
	scripts: '/javascript',
	images: '/images',
	test: '/spec',
	data: './data'
};

var src = {
	views: config.src + config.views,
	scripts: config.src + config.scripts,
	styles: config.src + config.styles,
	test: config.test + '/test.js',
	images: config.src + config.images
};

var dest = {
	views: config.dest + config.views,
	scripts: config.dest + config.scripts,
	styles: config.dest + config.styles,
	images: config.dest + config.images
};

/* ============================================================ *\
    ENERATE SASS IMPORTS
\* ============================================================ */

gulp.task('sass-generate-contents', function () {
	gulp.src([
		src.styles + '/_settings/*.scss',
		src.styles + '/_settings/*.scss',
		src.styles + '/_tools/*.scss',
		src.styles + '/_tools/*.scss',
		src.styles + '/_tools/*.scss',
		src.styles + '/_scope/*.scss',
		src.styles + '/_generic/*.scss',
		src.styles + '/_elements/*.scss',
		src.styles + '/_objects/*.scss',
		src.styles + '/_components/*.scss',
		src.views + '/**/*.scss',
		src.styles + '/_trumps/*.scss'
	])
	.pipe(sgc(src.styles + '/main.scss'))
	.pipe(gulp.dest(src.styles));
});

/* ============================================================ *\
    STYLES / SCSS
\* ============================================================ */

gulp.task('sass:main', function(){
	gulp.src(src.styles + '/main.scss')
		.pipe(sass())
		.pipe(minifyCSS())
		.pipe(gulp.dest(config.dest));
});

/* ============================================================ *\
    Minfiy images
\* ============================================================ */

gulp.task('images', function() {
	gulp.src(src.images + '/banner.jpg')
		.pipe(gulp.dest(config.dest));
});

/* ============================================================ *\
    COMPILE HTML TEMPLATES
\* ============================================================ */

gulp.task('compile-html', function(){
	var data = require('./data/data.json');
	var options = {
		batch : ['_src/views']
	};
	gulp.src(src.views + '/*.hbs')
		.pipe(handlebars(data, options))
		.pipe(rename({extname: '.html'}))
		//.pipe(minifyHTML())
		.pipe(gulp.dest(config.dest));
});

/* ============================================================ *\
    SCRIPTS and TESTS
\* ============================================================ */

gulp.task('scripts', function(){
	gulp.src(src.scripts + '/*.js')
		.pipe(uglify())
		.pipe(gulp.dest(config.dest));
});

gulp.task('jasmine', function() {
	gulp.src(src.test)
		.pipe(jasmine());
});

/* ============================================================ *\
    PACKAGE FOLDER UP
\* ============================================================ */

gulp.task('package-release', function () {
	var d = new Date();
	var date = d.getDay() + '.' + d.getMonth() + '.' + d.getFullYear();
	var time = d.getHours() + '.' + d.getMinutes();
	var packageName = 'pattern-library-build_' + date + '_' + time;

    return gulp.src('_build/**/*')
        .pipe(zip(packageName + '.zip'))
        .pipe(gulp.dest('release'));
});

/* ============================================================ *\
    RUN AND RESART SERVER
\* ============================================================ */

gulp.task('nodemon', function (cb) {
	var started = false;
	return nodemon({
		script: path.resolve('./website.js'),
		ext: 'js'
	}).on('start', function () {
		if (!started) {
			cb();
			started = true;
		}
	}).on('restart', ['compile-html']);
});

gulp.task('server', server.run(['./bin/www']));

/* ============================================================ *\
    MAIN TASKS
\* ============================================================ */

gulp.task('watch', ['server'], function() {
	gulp.watch(src.views + '/**/*.hbs', ['compile-html']);
	gulp.watch(src.scripts + '/*.js', ['scripts']);
	gulp.watch(src.styles + '/**/*.scss', ['sass:main']);
	gulp.watch(src.views + '/**/*.scss', ['sass:main']);
});

gulp.task('default', ['dev', 'watch']);
gulp.task('test', ['jasmine']);
gulp.task('dev', ['sass-generate-contents', 'sass:main', 'images', 'compile-html', 'scripts', 'jasmine']);
gulp.task('release', ['dev', 'package-release']);