// Load plugins
const gulp = require('gulp');

// import tasks
const js = require('./gulp-tasks/scripts.js');
const server = require('./gulp-tasks/browsersync.js');
const clean = require('./gulp-tasks/clean.js');
const html = require('./gulp-tasks/html.js');
const styles = require('./gulp-tasks/css.js');
const manifest = require('./gulp-tasks/manifest');
const images = require('./gulp-tasks/images');

// define tasks
const build = gulp.series(
  clean.dist,
  html.build,
  js.build,
  js.buildSW,
  styles.build,
  manifest.build,
  images.build,
);

// Watch files
function watchFiles() {
  gulp.watch('app/**/*.html', gulp.series(html.build, server.reload));
  gulp.watch('app/**/*.js', gulp.series(js.build, js.buildSW, server.reload));
  gulp.watch('app/**/*.css', gulp.series(styles.build, server.reload));
  gulp.watch('app/manifest.json', gulp.series(manifest.build, server.reload));
  gulp.watch('app/images/**/*', gulp.series(images.build, server.reload));
  gulp.watch('./config.json', gulp.series(build, server.reload));
}

const watch = gulp.parallel(watchFiles, server.init);

// expose tasks to CLI
exports.build = build;
exports.watch = watch;
exports.default = build;
