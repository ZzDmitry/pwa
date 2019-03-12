/* eslint-disable strict */

'use strict';

// Include Gulp & Tools We'll Use
const gulp = require('gulp');
const replace = require('gulp-replace-task');
const htmlreplace = require('gulp-html-replace');
const $ = require('gulp-load-plugins')();
const del = require('del');
const browserSync = require('browser-sync');
const useref = require('gulp-useref');
const fs = require('fs');


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

const { reload } = browserSync;

// Lint JavaScript
gulp.task('jshint', () => (
  gulp.src(['app/scripts/**/*.js'])
    .pipe(reload({ stream: true, once: true }))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')))
));

// Optimize Images
gulp.task('images', () => (
  gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({ title: 'images' }))
));

// Copy All Files At The Root Level (app)
gulp.task('copy', () => (
  gulp.src([
    'app/*',
    '!app/*.html',
    // 'node_modules/apache-server-configs/dist/.htaccess',
  ], {
    dot: true,
  }).pipe(gulp.dest('dist'))
    .pipe($.size({ title: 'copy' }))
));

gulp.task('copy-sw', () => (
  gulp.src([
    'app/sw.js',
  ])
    .pipe(makeConfigReplace())
    .pipe(gulp.dest('dist'))
    .pipe($.size({ title: 'scripts' }))
));

// Copy Web Fonts To Dist
gulp.task('fonts', () => (
  gulp.src(['app/fonts/**'])
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size({ title: 'fonts' }))
));

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10',
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'app/styles/**/*.css',
  ])
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    // Concatenate And Minify Styles
    .pipe($.if('*.css', $.csso()))
    .pipe(gulp.dest('dist/styles'))
    .pipe($.size({ title: 'styles' }));
});

// Concatenate And Minify JavaScript
gulp.task('scripts', () => {
  const sources = [
    'app/scripts/*.js'];

  return gulp.src(sources)
  // .pipe($.concat('main.min.js'))
  // .pipe($.uglify({preserveComments: 'some'}))
  // Output Files
    .pipe(makeConfigReplace())
    .pipe(gulp.dest('dist/scripts'))
    .pipe($.size({ title: 'scripts' }));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', () => {
  // const assets = $.useref.assets({ searchPath: '{app}' });

  return gulp.src('app/**/*.html')
    .pipe(htmlreplace({
      version: getConfig().VERSION,
    }))
    .pipe(useref({ searchPath: '{app}'}))
    // Remove Any Unused CSS
    // Note: If not using the Style Guide, you can delete it from
    // the next line to only include styles your project uses.
    // .pipe($.if('*.css', uncss({
    //   html: [
    //     'app/index.html',
    //   ],
    //   // CSS Selectors for UnCSS to ignore
    //   ignore: [],
    // })))

    // Concatenate And Minify Styles
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.csso()))
    //.pipe(useref().restore())
    .pipe(useref())
    // Minify Any HTML
    .pipe($.if('*.html', $.minifyHtml()))
    // Output Files
    .pipe(gulp.dest('dist'))
    .pipe($.size({ title: 'html' }));
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['dist/*', '!dist/.git'], { dot: true }));

// Build Production Files, the Default Task
gulp.task('default',
  gulp.series(
    'clean',
    'styles',
    gulp.parallel('html', 'scripts', 'styles', 'images', 'fonts', 'copy'),
    'copy-sw',
  )
);

// Watch Files For Changes & Reload
gulp.task('serve', gulp.series('default', () => {
  browserSync({
    ui: null,
    port: 8004,
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['dist'],
  });

  gulp.watch(['app/**/*.html'], gulp.series(reload));
  gulp.watch(['app/**/*.js'], gulp.series('scripts', reload));
  gulp.watch(['app/**/*.{scss,css}'], gulp.series('styles', reload));
  gulp.watch(['app/scripts/**/*.js'], gulp.series('jshint'));
  gulp.watch(['app/images/**/*'], gulp.series(reload));
  gulp.watch(['app/sw.js'], gulp.series('copy-sw', reload));
  gulp.watch([CONFIG_FILEPATH], gulp.series('html', 'scripts', 'copy-sw', reload));
}));

// Build and serve the output from the dist build
gulp.task('serve:dist', gulp.series('default', () => {
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist',
    baseDir: 'dist',
  });
}));

// Load custom tasks from the `tasks` directory
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }
