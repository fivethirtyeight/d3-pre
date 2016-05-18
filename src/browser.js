var d3;
var dataString = 'data-pid';

var setD3 = function (_d3) {
  d3 = _d3;
};

var start = function () {
  var appendCount = -1;

  function d3_selection_creator (name) {
    return typeof name === 'function' ? name
        : (name = d3.ns.qualify(name)).local ? function () { return this.ownerDocument.createElementNS(name.space, name.local); }
        : function () { return this.ownerDocument.createElementNS(this.namespaceURI, name); };
  }

  var newEnterAppend = function (name) {
    var ogName = name;
    name = d3_selection_creator(name);
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

  d3.svg._axis = d3.svg.axis;
  d3.svg.axis = require('./d3/axis');

  d3.selection.prototype._append = d3.selection.prototype.append;
  d3.selection.prototype.append = newEnterAppend;

  d3.selection.enter.prototype._append = d3.selection.enter.prototype.append;
  d3.selection.enter.prototype.append = newEnterAppend;

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
  d3.selection.enter.prototype.append = d3.selection.enter.prototype._append;
  d3.selection.prototype.append = d3.selection.prototype._append;
  d3.selection.prototype.data = d3.selection.prototype._data;
  d3.svg.axis = d3.svg._axis;
};

module.exports = {
  start: start,
  stop: stop,
  setD3: setD3
};
