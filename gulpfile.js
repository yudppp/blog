var gulp = require("gulp");
var concat = require("gulp-concat");
var sequence = require("run-sequence").use(gulp);

var LIB_JS_FILES = [
  "bower_components/highlightjs/highlight.pack.js",
  "node_modules/roughjs/dist/rough.min.js",
  "bower_components/cheet.js/cheet.min.js"
];

var SLIDE_JS_FILES = [
  "node_modules/talkiejs/dist/talkie.min.js",
  "bower_components/highlightjs/highlight.pack.js"
];

var APP_JS_FILES = ["static/js/app.js"];

var LIB_CSS_FILES = [
  "node_modules/hack/dist/hack.css",
  "node_modules/hack/dist/dark.css"
];

var SLIDE_CSS_FILES = [
  "node_modules/talkiejs/dist/talkie.min.css",
  "node_modules/talkiejs/dist/talkie-default.min.css",
  "bower_components/highlightjs/styles/monokai_sublime.css"
];

var APP_CSS_FILES = ["static/css/app.css", "static/css/hljs.css"];

gulp.task("watch", function() {
  gulp.watch(APP_JS_FILES, function() {
    gulp.start("js:app");
  });

  gulp.watch(APP_CSS_FILES, function() {
    gulp.start("css:app");
  });
});

gulp.task("build", function() {
  sequence("js", "css");
});

gulp.task("js", function() {
  gulp.start("js:lib", "js:slide", "js:app");
});

gulp.task("css", function() {
  gulp.start("css:lib", "css:slide", "css:app");
});

gulp.task("js:lib", function() {
  gulp
    .src(LIB_JS_FILES)
    .pipe(concat("lib.min.js"))
    .pipe(gulp.dest("static/js"));
});

gulp.task("js:slide", function() {
  gulp
    .src(SLIDE_JS_FILES)
    .pipe(concat("slide.min.js"))
    .pipe(gulp.dest("static/js"));
});

gulp.task("js:app", function() {
  var uglify = require("gulp-uglify");

  gulp
    .src(APP_JS_FILES)
    .pipe(concat("app.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("static/js"));
});

gulp.task("css:lib", function() {
  var csscomb = require("gulp-csscomb");
  var csso = require("gulp-csso");

  gulp
    .src(LIB_CSS_FILES)
    .pipe(concat("lib.min.css"))
    .pipe(csscomb())
    .pipe(csso())
    .pipe(gulp.dest("static/css"));
});

gulp.task("css:slide", function() {
  var csscomb = require("gulp-csscomb");
  var csso = require("gulp-csso");

  gulp
    .src(SLIDE_CSS_FILES)
    .pipe(concat("slide.min.css"))
    .pipe(csscomb())
    .pipe(csso())
    .pipe(gulp.dest("static/css"));
});

gulp.task("css:app", function() {
  var csscomb = require("gulp-csscomb");
  var csso = require("gulp-csso");

  gulp
    .src(APP_CSS_FILES)
    .pipe(concat("app.min.css"))
    .pipe(csscomb())
    .pipe(csso())
    .pipe(gulp.dest("static/css"));
});
