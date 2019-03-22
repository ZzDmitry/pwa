const browsersync = require('browser-sync').create();

// BrowserSync
function init(done) {
  browsersync.init({
    server: {
      baseDir: './dist/',
    },
    port: 8004,
    open: false,
  });
  done();
}

// BrowserSync Reload
function reload(done) {
  browsersync.reload();
  done();
}

module.exports = {
  init,
  reload,
};
