
var browser = require('./browser');
var preprocess = require('./preprocess');

module.exports = function (_d3) {

  var current = browser;
  // Electron
  if (navigator.userAgent && navigator.userAgent.indexOf('Electron') > -1){
    current = preprocess;
  }

  current.setD3(_d3);

  return {
    start: current.start,
    stop: current.stop
  };
};
