
var browser = require('./browser');
var preprocess = require('./preprocess');

module.exports = function (_d3, options) {
  options = options || {};

  var current = browser();

  var isPreprocessing = false;

  if (options.mode) {
    if (options.mode === 'preprocess') {
      current = preprocess();
      isPreprocessing = true;
    }
  } else if (navigator.userAgent && navigator.userAgent.indexOf('Electron') > -1) {
    // Electron
    current = preprocess();
    isPreprocessing = true;
  }

  current.setD3(_d3);

  return {
    start: current.start,
    stop: current.stop,
    isPreprocessing: isPreprocessing
  };
};
