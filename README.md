# d3-pre
pre-render your d3 visualizations.

Serving up a page with inline SVG elements can give significant
performance benefits over creating them after pageload,
especially with respect to perceived load time.

The idea behind this library is that you run your d3 script locally on a
fake (jsdom) DOM, allow d3 to build the initial `SVG`, and then attach event listeners
and interactivity in the browser. The cool thing is that this library allows you to run
exactly the same code locally and in the browser.

See a simple example of this concept in action: [with pre-rendering](https://s.538.io/experiments/svg-prerender/prerendered/)
and [without pre-rendering](https://s.538.io/experiments/svg-prerender/standard/).

## Usage

There are **two** things that you need to do to use this library.

### 1. Include d3-pre in your javascript

```js
var d3 = require('d3');

// Require the library and give it a reference to d3
var Prerender = require('@fivethirtyeight/d3-pre');
var prerender = Prerender(d3);


// Then, when you start drawing svg call prerender.start()
// this modifies some d3 functions to allow it to take
// advantage of svg's that have been pre-rendered to the page.
prerender.start();

/*
 * normal d3 code goes here
 * d3.select('body')
 *   .append('svg')
 *      .data(data)
 *   .enter()
 *      .append('rect')
 *      .on('click', clickhandler)
 *      etc. etc.
*/

// If you ever want to go back to the unmodified d3
// just call prerender.stop()
// This is optional and usually not necessary
prerender.stop();

```


### 2. Pass your HTML through the prerendering tool.

This can either be done via a build task (like gulp), or on the command line.

#### Command line example

```
$ npm install -g @fivethirtyeight/d3-pre-cli
$ d3-pre ./path/to/index.html
```

This will modify the `index.html` file, running any scripts that are included,
letting these scripts modify the DOM and saving the modifications.

[See the repo for the command line tool](https://github.com/fivethirtyeight/d3-pre-cli)

#### Gulp example

Install the gulp plugin:
```
$ npm install @fivethirtyeight/gulp-d3-pre
```

Create a gulp task:

```js
var gulp = require('gulp');
var d3Pre = require('@fivethirtyeight/gulp-d3-pre');


gulp.task('prerender-svgs', function() {
  gulp.src('./public/index.html')
    .pipe(d3Pre())
    .pipe(gulp.dest('./public/'));
})
```
Again, this will modify the file in-place, saving any DOM modifications that
the javascript made.

[See the repo for the gulp plugin](https://github.com/fivethirtyeight/gulp-d3-pre)
