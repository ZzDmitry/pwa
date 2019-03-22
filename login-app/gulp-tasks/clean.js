const del = require('del');

// Clean
function cleanDist() {
  return del(['./dist/']);
}

module.exports = {
  dist: cleanDist,
};
