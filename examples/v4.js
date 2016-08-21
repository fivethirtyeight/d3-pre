var d3 = require('d3');

require('./app.css');
// Require the library and give it a reference to d3
var Prerender = require('..');
var prerender = Prerender(d3);

prerender.start();

var svg = d3.select('body').append("svg").attr('width', 600).attr('height', 600),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var x = d3.scaleLinear()
    .domain([-1, width + 1])
    .range([-1, width + 1]);

var y = d3.scaleLinear()
    .domain([-1, height + 1])
    .range([-1, height + 1]);

var xAxis = d3.axisBottom(x)
    .ticks((width + 2) / (height + 2) * 10)
    .tickSize(height)
    .tickPadding(8 - height);

var yAxis = d3.axisRight(y)
    .ticks(10)
    .tickSize(width)
    .tickPadding(8 - width);

var view = svg.append("rect")
    .attr("class", "view")
    .attr("x", 0.5)
    .attr("y", 0.5)
    .attr("width", width - 1)
    .attr("height", height - 1);

var gX = svg.append("g")
    .attr("class", "axis axis--x")
    .call(xAxis);

var gY = svg.append("g")
    .attr("class", "axis axis--y")
    .call(yAxis);

svg.append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", height)


prerender.stop();
svg.call(d3.zoom()
   .scaleExtent([1, 40])
   .translateExtent([[-100, -100], [width + 90, height + 100]])
   .on("zoom", zoomed));

function zoomed() {
  svg.select(".x.axis").call(xAxis);
  svg.select(".y.axis").call(yAxis);
}

function zoomed() {
  view.attr("transform", d3.event.transform);
  gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
  gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
}
