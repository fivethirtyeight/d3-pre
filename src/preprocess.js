var appendCount = -1;
var d3;

var retThis = function () {
  return this;
};

var setD3 = function (_d3) {
  d3 = _d3;
  d3.selection.prototype._append = d3.selection.prototype.append;
  d3.selection.enter.prototype._append = d3.selection.enter.prototype.append;
  d3.selection.prototype._data = d3.selection.prototype.data;

  d3.selection.prototype.append = retThis;
  d3.selection.enter.prototype.append = retThis;
  d3.selection.prototype.data = retThis;
};

var start = function () {
  function d3_selection_creator (name) {
    return typeof name === 'function' ? name
        : (name = d3.ns.qualify(name)).local ? function () { return this.ownerDocument.createElementNS(name.space, name.local); }
        : function () { return this.ownerDocument.createElementNS(this.namespaceURI, name); };
  }

  var newAppend = function (name) {
    appendCount++;
    return this._append.apply(this, arguments).attr('data-dpre-id', appendCount);
  };

  d3.selection.prototype.append = newAppend;

  var newEnterAppend = function (name) {
    var ogName = name;
    name = d3_selection_creator(name);

    var isEmpty = -1;

    var topNode = null;
    var allNodes = null;

    return this.select(function () {
      appendCount++;

      if (isEmpty === -1) {
        topNode = d3.select(this);
        var selection = topNode.select(ogName + '[data-dpre-id="' + appendCount + '"]');

        if (selection.empty()) {
          isEmpty = 1;
        } else {
          isEmpty = 0;
          allNodes = topNode.select('*');
        }
      }

      if (isEmpty === 1) {
        var c = this.appendChild(name.apply(this, arguments));
        return d3.select(c).attr('data-dpre-id', appendCount).node();
      } else if (isEmpty === 0) {
        return allNodes[arguments[1]];
      }

      console.log('THERE WAS A PROBLEM');
      return selection;
    });
  };

  d3.selection.enter.prototype.append = newEnterAppend;

  d3.selection.prototype.data = function () {
    if (!arguments.length) {
      return this._data();
    }

    var output = this._data.apply(this, arguments);
    var enter = output.enter();

    if (enter.empty()) {
      var data = output.data();
      appendCount += data.length;


      // ~should~ be safe to ignore because
      // these got pushed to the DOM already
      this.attr = retThis;
      this.style = retThis;
      this.append = retThis;

      var self = this;
      output.enter = function () {
        return self;
      };
    }

    return output;
  };
};

var stop = function () {
  d3.selection.enter.prototype.append = retThis;
  d3.selection.prototype.append = retThis;
  d3.selection.prototype.data = retThis;
};


module.exports = {
  start: start,
  stop: stop,
  setD3: setD3
};
