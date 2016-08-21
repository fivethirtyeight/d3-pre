
var isV4OrBetter = function (d3) {
  return (d3.version && (+d3.version.split('.')[0] >= 4));
};

var d3_selection_creator = function (d3, name) {
  return typeof name === 'function' ? name
      : (name = d3.ns.qualify(name)).local ? function () { return this.ownerDocument.createElementNS(name.space, name.local); }
      : function () { return this.ownerDocument.createElementNS(this.namespaceURI, name); };
};

var mapAppendName = function (d3, name) {
  if (isV4OrBetter(d3)) {
    return typeof name === 'function' ? name : d3.creator(name);
  }
  return d3_selection_creator(d3, name);
}

module.exports = {
  isV4OrBetter: isV4OrBetter,
  mapAppendName: mapAppendName
};
