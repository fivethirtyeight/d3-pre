'use strict';

var d3 = require('d3');
// Require the library and give it a reference to d3
var Prerender = require('..');
var prerender = Prerender(d3);


// Then, when you start drawing svg call `prerender.start()`
// this modifies some d3 functions to allow it to be
// aware of SVGs that already exist on the page.
prerender.start();

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear()
    .domain([-width / 2, width / 2])
    .range([0, width]);

var y = d3.scaleLinear()
    .domain([-height / 2, height / 2])
    .range([height, 0]);

var xAxis = d3.axisBottom()
    .scale(x)
    .tickSize(-height);

var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(5)
    .tickSize(-width);

var zoom = d3.zoom()
    // .x(x)
    // .y(y)
    .scaleExtent([1, 32])
    .on("zoom", zoomed);

var svg = d3.select("body").append("svg")
    .attr("viewBox", ' 0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom))
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("rect")
    .attr("width", width)
    .attr("height", height);

var xg = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

var yg = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

prerender.stop();
svg.call(zoom);

function zoomed() {
  svg.select(".x.axis").call(xAxis);
  svg.select(".y.axis").call(yAxis);
}
