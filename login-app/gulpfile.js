// Load plugins
const gulp = require('gulp');

// import tasks
const js = require('./gulp-tasks/scripts.js');
const server = require('./gulp-tasks/browsersync.js');
const clean = require('./gulp-tasks/clean.js');
const html = require('./gulp-tasks/html.js');
const styles = require('./gulp-tasks/css.js');

// Watch files
function watchFiles() {
  gulp.watch('app/**/*.html', gulp.series(html.build, server.reload));
  gulp.watch('app/**/*.js', gulp.series(js.build, js.buildSW, server.reload));
  gulp.watch('app/**/*.css', gulp.series(styles.build, server.reload));
}

// define tasks
const scripts = gulp.series(html.build, js.build, js.buildSW, styles.build);
const watch = gulp.parallel(watchFiles, server.init);
const build = gulp.series(
  clean.dist,
  scripts,
);

// expose tasks to CLI
exports.build = build;
exports.watch = watch;
exports.default = build;
