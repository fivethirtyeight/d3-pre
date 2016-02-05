/* global it, describe, beforeEach, afterEach */
'use strict';
var expect = require('expect.js');
var fs = require('fs');
var d3 = require('d3');
var Prerender = require('..');
var _ = require('lodash');

var cleanString = function (str) {
  return str.replace(/\s+/g, ' ').trim();
};

var prerender;
describe('In browser', function () {
  beforeEach(function () {
    d3.select('body').append('div').attr('id', 'test-container');
    prerender = new Prerender(d3, { mode: 'browser' });
    prerender.start();
  });

  afterEach(function () {
    prerender.stop();
    d3.select('#test-container').remove();
  });

  it('should handle existing svg elements', function (done) {
    var inner = cleanString(fs.readFileSync(__dirname + '/templates/input/browser/1.svg').toString());
    d3.select('#test-container').html(inner);

    d3.select('#test-container').append('svg');

    var results = d3.select('#test-container').html();
    expect(results).to.eql(inner);
    done();
  });

  it('should handle data', function (done) {
    var inner = cleanString(fs.readFileSync(__dirname + '/templates/input/browser/2.svg').toString());
    d3.select('#test-container').html(inner);

    var data = _.range(10);

    var svg = d3.select('#test-container').append('svg');
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', function (d) { return d; })
      .attr('cy', function (d) { return d; });

    var results = d3.select('#test-container').html();
    expect(results).to.be(inner);
    done();
  });

  it('should handle weird nesting', function (done) {
    var inner = cleanString(fs.readFileSync(__dirname + '/templates/input/browser/3.svg').toString());
    d3.select('#test-container').html(inner);
    var outerData = _.range(10);
    var innerData = _.range(5);

    var svg = d3.select('body').append('svg');

    var groups = svg.selectAll('g.outer')
      .data(outerData)
      .enter()
      .append('g')
      .attr('class', 'outer')
      .attr('i', function (d) { return d; });

    groups.append('rect');

    groups
      .append('g')
      .selectAll('rect')
      .data(innerData)
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return d;
      });

    groups
      .append('circle')
      .attr('dx', function (d) {
        return d;
      })
      .attr('dy', function (d) {
        return d;
      });

    var results = d3.select('#test-container').html();
    expect(results).to.be(inner);
    done();
  });

  it('should handle dataflow correctly', function (done) {
    var inner = cleanString(fs.readFileSync(__dirname + '/templates/input/browser/3.svg').toString());
    d3.select('#test-container').html(inner);
    var outerData = _.range(10);
    var innerData = _.range(5);

    var svg = d3.select('body').append('svg');

    var groups = svg.selectAll('g.outer')
      .data(outerData)
      .enter()
      .append('g')
      .attr('class', 'outer')
      .attr('i', function (d) { return d; });

    groups.append('rect');

    groups
      .append('g')
      .selectAll('rect')
      .data(innerData)
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return d;
      })
      .each(function (d, i) {
        expect(d).to.be(innerData[i]);
      });

    groups
      .append('circle')
      .attr('dx', function (d) {
        return d;
      })
      .attr('dy', function (d) {
        return d;
      })
      .each(function (d, i) {
        expect(d).to.be(outerData[i]);
      });

    var results = d3.select('#test-container').html();
    expect(results).to.be(inner);
    done();
  });

  it('should add new data correctly', function (done) {
    var inner = cleanString(fs.readFileSync(__dirname + '/templates/input/browser/4.svg').toString());
    var expected = cleanString(fs.readFileSync(__dirname + '/templates/output/browser/4.svg').toString());
    d3.select('#test-container').html(inner);
    var outerData = _.range(10);
    var innerData = _.range(5);
    var newData = _.range(25);

    var svg = d3.select('body').append('svg');

    var groups = svg.selectAll('g.outer')
      .data(outerData)
      .enter()
      .append('g')
      .attr('class', 'outer')
      .attr('i', function (d) { return d; });

    groups.append('rect');

    groups
      .append('g')
      .selectAll('rect')
      .data(innerData)
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return d;
      })
      .each(function (d, i) {
        expect(d).to.be(innerData[i]);
      });

    groups
      .append('circle')
      .attr('dx', function (d) {
        return d;
      })
      .attr('dy', function (d) {
        return d;
      })
      .each(function (d, i) {
        expect(d).to.be(outerData[i]);
      });

    groups.append('g')
      .selectAll('line')
      .data(newData)
      .enter()
      .append('line')
      .attr('x1', function (d) { return d; })
      .attr('y1', function (d) { return d; });

    var results = d3.select('#test-container').html();
    expect(results).to.be(expected);
    done();
  });

  it('should work with nested data', function (done) {
    var inner = cleanString(fs.readFileSync(__dirname + '/templates/input/browser/5.svg').toString());

    d3.select('#test-container').html(inner);
    var outerData = _.range(10);
    var innerData = _.range(5);
    var innerInnerData = _.range(15);

    var svg = d3.select('body').append('svg');

    var groups = svg.selectAll('g.outer')
      .data(outerData)
      .enter()
      .append('g')
      .attr('class', 'outer')
      .attr('i', function (d) { return d; })
      .each(function (d, i) {
        expect(d).to.be(outerData[i]);
      });

    groups
      .selectAll('g.inner')
      .data(innerData)
      .enter()
      .append('g')
      .attr('class', 'inner')
      .each(function (d, i) {
        expect(d).to.be(innerData[i]);
      })
      .selectAll('rect')
      .data(innerInnerData)
      .enter()
      .append('rect')
      .each(function (d, i) {
        expect(d).to.be(innerInnerData[i]);
      });

    var results = d3.select('#test-container').html();
    expect(results).to.be(inner);
    done();
  });
});
