
var dataString = 'data-pid';
// var modifiedAxis = require('./d3/axis');
var utils = require('./utils');

module.exports = function (count) {
  var d3;
  var appendCount = count || -1;
  var setD3 = function (_d3) {
    d3 = _d3;
  };
  var start = function () {

    var newEnterAppend = function (name) {
      var ogName = name;
      name = utils.mapAppendName(d3, name);
      var isEmpty = -1;

      return this.select(function () {
        appendCount++;
        if (isEmpty === -1) {
          var selection = d3.select(ogName + '[' + dataString + '="' + appendCount + '"]');
          if (selection.empty()) {
            isEmpty = 1;
          } else {
            isEmpty = 0;
          }
        }

        if (isEmpty === 1) {
          var c = this.appendChild(name.apply(this, arguments));
          return d3.select(c).attr(dataString, appendCount).node();
        }

        return d3.select('[' + dataString + '="' + appendCount + '"]').node();
      });
    };

    if (!utils.isV4OrBetter(d3)) {
      d3.svg._axis = d3.svg.axis;
      d3.svg.axis = modifiedAxis(d3);
      d3.selection.enter.prototype._append = d3.selection.enter.prototype.append;
      d3.selection.enter.prototype.append = newEnterAppend;
    }

    d3.selection.prototype._append = d3.selection.prototype.append;
    d3.selection.prototype.append = newEnterAppend;


    d3.selection.prototype._data = d3.selection.prototype.data;

    d3.selection.prototype.data = function () {
      if (!arguments.length) {
        return this._data.apply(this, arguments);
      }
      var output = this._data.apply(this, arguments);
      var enter = output.enter();

      if (enter.empty()) {
        // var data = output.data();
        // appendCount += data.length;

        var retThis = function () {
          return this;
        };

        // ~should~ be safe to ignore because
        // these got pushed to the DOM already
        this.attr = retThis;
        this.style = retThis;

        var self = this;
        output.enter = function () {
          return self;
        };
      }

      return output;
    };
  };

  var stop = function () {

    d3.selection.prototype.append = d3.selection.prototype._append;
    d3.selection.prototype.data = d3.selection.prototype._data;
    if (!utils.isV4OrBetter(d3)) {
      d3.selection.enter.prototype.append = d3.selection.enter.prototype._append;
      d3.svg.axis = d3.svg._axis;
    }
  };

  return {
    start: start,
    stop: stop,
    setD3: setD3
  };
};
