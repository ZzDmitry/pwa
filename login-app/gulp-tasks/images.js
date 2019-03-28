const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const size = require('gulp-size');

function imagesBuild() {
  return gulp.src('app/images/**/*')
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
    }))
    .pipe(gulp.dest('dist/images'))
    .pipe(size({ title: 'images' }));
}

module.exports = {
  build: imagesBuild,
};
