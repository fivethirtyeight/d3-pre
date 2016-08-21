# d3-pre
A JavaScript library that pre-renders d3 visualizations into inline SVG elements, to reduce perceived page-load time and cut down on unwanted paint flashes.

The pre-rendering tool uses a headless browser to turn d3 code into its resulting SVG, and inserts the markup into your HTML. Then, the `d3-pre` JavaScript library overrides `d3.append` to check  if a pre-rendered DOM node already exists before creating a new one. This approach allows you to use pre-rendered SVG without changing your visualization code.

See an example of the speed benefits of using inline SVG over SVG generated in the client  by refreshing this page [without pre-rendering](http://fivethirtyeight.github.io/d3-pre/examples/standard/)
and [with pre-rendering](http://fivethirtyeight.github.io/d3-pre/examples/prerendered/).

## Examples

* [Axis Pan+Zoom](http://fivethirtyeight.github.io/d3-pre/examples/axes/) ([code](./examples/axis.js))
* [Streamgraph](http://fivethirtyeight.github.io/d3-pre/examples/streamgraph/) ([code](./examples/stream.js))
* [Choropleth](http://fivethirtyeight.github.io/d3-pre/examples/choropleth/) ([code](./examples/choropleth.js))

##### In the wild

* http://projects.fivethirtyeight.com/facebook-primary/
* http://projects.fivethirtyeight.com/2016-election-forecast/

## Installation

```
npm install --save d3-pre
```

## Usage

There are two things that you need to do to use this library:

### 1. Include d3-pre in your javascript

```js
var d3 = require('d3');

// Require the library and give it a reference to d3
var Prerender = require('d3-pre');
var prerender = Prerender(d3);


// Then, when you start drawing SVG, call `prerender.start()`.
// This modifies some d3 functions to make it aware
// of the pre-rendered SVGs.
prerender.start();

/*
 * Existing d3 code goes here
 * d3.select('body')
 *   .append('svg')
 *      .data(data)
 *   .enter()
 *      .append('rect')
 *      .on('click', clickhandler)
 *      etc. etc.
*/

// If you ever want to go back to the unmodified d3,
// just call `prerender.stop()`.
// This is optional and usually not necessary.
prerender.stop();

```


### 2. Pass your HTML through the pre-rendering tool.

This can be done via a build task (like gulp), or on the command line. To provide control over which DOM modifications are saved back to the HTML file, you can add the following data-attributes in the HTML:
* `data-prerender-ignore`: Any modifications that happen inside a node with this attribute will be ignored.
* `data-prerender-only`: Only modifications inside of this node are saved.
* `data-prerender-minify`: Any SVG with this attribute will automatically be passed through an SVG minification tool.

#### Command line example

Install the [command line tool](https://github.com/fivethirtyeight/d3-pre-cli):

```
$ npm install -g d3-pre-cli
```

Run the `d3-pre` command on an HTML file:

```
$ d3-pre ./path/to/index.html
```

This command will open the index.html file in a headless browser, running any JavaScript included on the page. Any modifications that the JavaScript makes to the DOM are saved back to the HTML file.

#### Gulp example

Install the [gulp plugin](https://github.com/fivethirtyeight/gulp-d3-pre):
```
$ npm install gulp-d3-pre
```

Create a gulp task:

```js
var gulp = require('gulp');
var d3Pre = require('gulp-d3-pre');


gulp.task('prerender-svgs', function() {
  gulp.src('./public/index.html')
    .pipe(d3Pre(options))
    .pipe(gulp.dest('./public/'));
})
```

This task will open the index.html file in a headless browser, running any JavaScript included on the page. Any modifications that the JavaScript makes to the DOM are saved back to the HTML file.
The following options may be passed to the gulp plugin:
* `preprocessHTML` - A function to run before running the HTML through the pre-renderer. Takes a string as input and expects a string as output.
* `postprocessHTML` - A function to run after running the HTML through the pre-renderer. Takes a string as input and expects a string as output.

#### Advanced usage

Both of the above modules are thin wrappers around [d3-pre-renderer](https://github.com/fivethirtyeight/d3-pre-renderer). If you require more fine-grained control of when and where the pre-rendering step takes place, use d3-pre-renderer directly.

## Release Notes

#### `v1.3.0`

* Adds support for d3 `v4`.

## Contributors

* [Matthew Conlen](https://github.com/mathisonian)

## License

MIT
