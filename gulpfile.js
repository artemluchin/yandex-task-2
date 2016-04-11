var gulp            = require('gulp');
var sass            = require('gulp-sass');
var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
var uglifycss       = require('gulp-uglifycss');
var rename          = require('gulp-rename');
var sourcemaps      = require('gulp-sourcemaps');
var autoprefixer    = require('gulp-autoprefixer');
var babel						= require('gulp-babel');
var autopolyfiller  = require('gulp-autopolyfiller');

gulp.task('sass', function () {
  return gulp.src('assets/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('dist.css', function () {
  
	return gulp.src('assets/sass/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error',sass.logError))
		.pipe(autoprefixer({ browsers: ['> 1%', 'IE 7'], cascade: false }))
		.pipe(concat('main.css'))
		.pipe(gulp.dest('dist/css'))
		.pipe(uglifycss())
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest('dist/css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('dist.js', function() {
    return gulp.src('assets/js/lib.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('dist'));
})

gulp.task('sass:watch', function () {
  gulp.watch('assets/sass/*.scss', ['sass']);
});