const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const size = require('gulp-size');
const concatCss = require('gulp-concat-css');
const rename = require('gulp-rename');

function stylesBuild() {
  return gulp.src('app/styles/**/*.css')
    .pipe(concatCss('bundle.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
    }))
    .pipe(cleanCss({ format: 'keep-breaks' }))
    .pipe(rename('bundle.min.css'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(size({ title: 'styles' }));
}

module.exports = {
  build: stylesBuild,
};
