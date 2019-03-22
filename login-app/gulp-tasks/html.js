const gulp = require('gulp');
const fs = require('fs');
const htmlreplace = require('gulp-html-replace');
const useref = require('gulp-useref');
const size = require('gulp-size');
const htmlmin = require('gulp-htmlmin');


const CONFIG_FILEPATH = './config.json';

function getConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_FILEPATH, 'utf8'));
}

function htmlBuild() {
  return gulp.src('app/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(htmlreplace({ version: getConfig().VERSION }))
    .pipe(useref({ searchPath: '{app}' }))
    .pipe(gulp.dest('dist'))
    .pipe(size({ title: 'html' }));
}

module.exports = {
  build: htmlBuild,
};
