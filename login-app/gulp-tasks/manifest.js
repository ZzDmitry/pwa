const gulp = require('gulp');
const size = require('gulp-size');

function manifestBuild() {
  return gulp.src('app/manifest.json')
    .pipe(gulp.dest('dist'))
    .pipe(size({ title: 'manifest' }));
}

module.exports = {
  build: manifestBuild,
};
