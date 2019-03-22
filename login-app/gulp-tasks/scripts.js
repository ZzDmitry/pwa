const gulp = require('gulp');
const size = require('gulp-size');
const replace = require('gulp-replace-task');
const fs = require('fs');
const terser = require('gulp-terser');

const CONFIG_FILEPATH = './config.json';

function getConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_FILEPATH, 'utf8'));
}

function makeConfigReplace() {
  return replace({
    patterns: [
      {
        json: {
          CONFIG: getConfig(),
        },
      },
    ],
  });
}

function scripts() {
  return gulp.src(['app/scripts/*.js'])
    // .pipe(concat('main.min.js'))
    .pipe(makeConfigReplace())
    .pipe(terser())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(size({ title: 'scripts' }));
}


// copy service worker
function copyServiceWorker() {
  return gulp.src([
    'app/sw.js',
  ])
    .pipe(makeConfigReplace())
    .pipe(terser())
    .pipe(gulp.dest('dist'))
    .pipe(size({ title: 'service worker' }));
}

module.exports = {
  build: scripts,
  buildSW: copyServiceWorker,
};
