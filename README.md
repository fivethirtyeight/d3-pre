# d3-pre
prerender your d3 visualizations


## Usage

There are *two* things that you need to do to use this library.

### 1. Include d3-pre in your javascript

```js
// Require the library and give it a reference to d3
var Prerender = require('@fivethirtyeight/d3-pre');
var prerender = Prerender(d3);


// Then, when you start drawing svg call prerender.start()
// this modifies some d3 functions to allow it to take
// advantage of svg's that have been pre-rendered to the page.
prerender.start();


// If you ever want to go back to the unmodified d3
// just call
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

#### Gulp example

Install the gulp plugin:
```
$ npm install @fivethirtyeight/gulp-d3-pre
```

Create a gulp task:

```
gulp.task('prerender-svgs', function() {
  gulp.src('./public/index.html')
    .pipe(d3Pre())
    .pipe(gulp.dest('./public/'));
})
```
Again, this will modify the file in-place, saving any DOM modifications that
the javascript made.
