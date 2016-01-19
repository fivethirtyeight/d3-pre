var appendCount = -1;

var browser = require('./browser');
var preprocess = require('./preprocess');

module.exports = function (_d3) {

  var current = browser;
  // Electron
  if (typeof window !== 'undefined' && window.process && window.process.type === "renderer"){
    current = preprocess;
  } else {
    console.log('in the browser');
  }

  current.setD3(_d3);

  return {
    start: current.start,
    stop: current.stop
  };
};
