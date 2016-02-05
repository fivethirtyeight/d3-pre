/* global it, describe */
'use strict';

var expect = require('expect.js');
var fs = require('fs');
var d3 = require('d3');
var jsdom = require('jsdom');
var Prerender = require('..');
var _ = require('lodash');

var cleanString = function (str) {
  return str.replace(/\s+/g, ' ').trim();
};

var runHeadless = function (inputHtml, fn, cb) {
  jsdom.env({
    html: inputHtml,
    features: {
      QuerySelector: true
    },
    done: function (errors, window) {
      window.d3 = d3.select(window.document);
      fn(window);
      window.close();
      cb();
    }
  });
};

describe('Setup', function () {
  it('should run d3 in jsdom', function (done) {
    var inputHtml = cleanString(fs.readFileSync(__dirname + '/templates/input/preprocess.html').toString());
    var outputHtml = cleanString(fs.readFileSync(__dirname + '/templates/output/preprocess/1.html').toString());

    runHeadless(inputHtml, function (window) {
      window.d3.select('body').append('svg');
      var actualOutput = cleanString(window.document.documentElement.outerHTML);
      expect(actualOutput).to.eql(outputHtml);
    }, done);
  });
});

describe('Preprocessor', function () {
  it('should append svg elements', function (done) {
    var inputHtml = cleanString(fs.readFileSync(__dirname + '/templates/input/preprocess.html').toString());
    var outputHtml = cleanString(fs.readFileSync(__dirname + '/templates/output/preprocess/2.html').toString());

    var data = _.range(10);
    runHeadless(inputHtml, function (window) {
      var prerender = new Prerender(d3, { mode: 'preprocess' });

      prerender.start();
      var svg = window.d3.select('body').append('svg');

      svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', function (d) { return d; })
        .attr('cy', function (d) { return d; });

      var actualOutput = cleanString(window.document.documentElement.outerHTML);
      expect(actualOutput).to.eql(outputHtml);
    }, done);
  });

  it('should handle selections', function (done) {
    var inputHtml = cleanString(fs.readFileSync(__dirname + '/templates/input/preprocess.html').toString());
    var outputHtml = cleanString(fs.readFileSync(__dirname + '/templates/output/preprocess/3.html').toString());

    var data = _.range(10);
    runHeadless(inputHtml, function (window) {
      var prerender = new Prerender(d3, { mode: 'preprocess' });

      prerender.start();
      var svg = window.d3.select('body').append('svg');

      var groups = svg.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('i', function (d) { return d; });

      groups
        .append('circle')
        .attr('dx', function (d) {
          return d;
        })
        .attr('dy', function (d) {
          return d;
        });

      var actualOutput = cleanString(window.document.documentElement.outerHTML);
      expect(actualOutput).to.eql(outputHtml);
    }, done);
  });

  it('should handle weird nesting', function (done) {
    var inputHtml = cleanString(fs.readFileSync(__dirname + '/templates/input/preprocess.html').toString());
    var outputHtml = cleanString(fs.readFileSync(__dirname + '/templates/output/preprocess/4.html').toString());

    var outerData = _.range(10);
    var innerData = _.range(5);

    runHeadless(inputHtml, function (window) {
      var prerender = new Prerender(d3, { mode: 'preprocess' });

      prerender.start();
      var svg = window.d3.select('body').append('svg');

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

      var actualOutput = cleanString(window.document.documentElement.outerHTML);

      expect(actualOutput).to.eql(outputHtml);
    }, done);
  });

  it('should handle multiple levels of nesting', function (done) {
    var inputHtml = cleanString(fs.readFileSync(__dirname + '/templates/input/preprocess.html').toString());
    var outputHtml = cleanString(fs.readFileSync(__dirname + '/templates/output/preprocess/5.html').toString());

    var outerData = _.range(10);
    var innerData = _.range(5);
    var innerInnerData = _.range(15);

    runHeadless(inputHtml, function (window) {
      var prerender = new Prerender(d3, { mode: 'preprocess' });

      prerender.start();
      var svg = window.d3.select('body').append('svg');

      var groups = svg.selectAll('g.outer')
        .data(outerData)
        .enter()
        .append('g')
        .attr('class', 'outer')
        .attr('i', function (d) { return d; });

      groups
        .selectAll('g.inner')
        .data(innerData)
        .enter()
        .append('g')
        .attr('class', 'inner')
        .selectAll('rect')
        .data(innerInnerData)
        .enter()
        .append('rect');

      var actualOutput = cleanString(window.document.documentElement.outerHTML);
      expect(actualOutput).to.eql(outputHtml);
    }, done);
  });
});
