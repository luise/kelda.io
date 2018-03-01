import gulp from "gulp";
import {spawn} from "child_process";
import hugoBin from "hugo-bin";
import gutil from "gulp-util";
import flatten from "gulp-flatten";
import postcss from "gulp-postcss";
import cssImport from "postcss-import";
import cssnext from "postcss-cssnext";
import nestedcss from "postcss-nested";
import colorfunctions from "postcss-color-function";
import hdBackgrounds from "postcss-at2x";
import cssvars from "postcss-simple-vars-async";
import postcssGrid from "postcss-flexboxgrid";
import styleVariables from "./config/variables";
import BrowserSync from "browser-sync";
import watch from "gulp-watch";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";
import runSequence from "run-sequence";
import imagemin from "gulp-imagemin";
import responsive from "gulp-responsive";
import imgRetina from "gulp-img-retina";
import connect from "gulp-connect";

const $ = require('gulp-load-plugins')();
const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ["-d", "../dist", "-s", "site", "-v"];
const hugoArgsPreview = ["--buildDrafts", "--buildFuture"];

// Development tasks
gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, hugoArgsPreview));

// Build/production tasks
gulp.task("build", function(callback) {
  runSequence(["css", "js", "fonts", "images", "hugo"], "optimize")
});
gulp.task("build-preview", function(callback) {
  runSequence(["css", "js", "fonts", "images", "hugo"], "optimize")
});

// Compile CSS with PostCSS
gulp.task("css", () => (
  gulp.src("./src/css/*.css")
    .pipe(postcss([
      cssImport({from: "./src/css/main.css"}),
      postcssGrid({columns: 12, gutter: 20}),
      nestedcss(),
      hdBackgrounds(),
      cssvars({variables: styleVariables}),
      colorfunctions(),
      cssnext()]))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream())
));

// Compile Javascript
gulp.task("js", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
});

// Move all fonts in a flattened directory
gulp.task('fonts', () => (
  gulp.src("./src/fonts/**/*")
    .pipe(flatten())
    .pipe(gulp.dest("./dist/fonts"))
    .pipe(browserSync.stream())
));

// Move all images in a flattened directory
gulp.task("images", () => (
  gulp.src(["./src/img/**/*"])
    .pipe(gulp.dest("./dist/img"))
    .pipe(browserSync.stream())
));

// Development server with browsersync
gulp.task("server-dev", ["hugo", "css", "js", "fonts", "images"], () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    },
    notify: false
  });
  watch("./src/js/**/*.js", () => { gulp.start(["js"]) });
  watch("./src/css/**/*.css", () => { gulp.start(["css"]) });
  watch("./src/img/**/*", () => { gulp.start(["images"]) });
  watch("./src/fonts/**/*", () => { gulp.start(["fonts"]) });
  watch("./site/**/*", () => { gulp.start(["hugo"]) });
});

// Production server.
gulp.task("server", ["hugo", "css", "js", "fonts", "images"], () => {
  connect.server({
    root: './dist',
    port: 80,
    host: '0.0.0.0',
  });
});

// Optimize images through compression and responsive sizes
gulp.task("optimize", () => (
  // resize and compress images
   gulp.src(["dist/img/**/*.jpg", "dist/img/**/*.png", "!dist/img/**/white-pixel.jpg", "!dist/img/favicon/**/*"])
    .pipe($.responsive({
      '**/*.jpg': [{
        width: '33.33%',
      }, {
        width: '66.66%',
        rename: { suffix: '@2x' }
      }, {
        width: '100%',
        rename: { suffix: '@3x' }
      }],
      '**/*.png': [{
        width: '33.33%',
      }, {
        width: '66.66%',
        rename: { suffix: '@2x' }
      }, {
        width: '100%',
        rename: { suffix: '@3x' }
      }],
    }, {
      withoutEnlargement: true,
      skipOnEnlargement: false,
      errorOnEnlargement: false
    }))
    .pipe(imagemin([
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 7
      })
    ]))
    .pipe(gulp.dest("./dist/img"))
    .pipe(browserSync.stream()),

  gulp.src(["dist/img/**/*.svg", "dist/img/**/*.gif"])
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true,
        optimizationLevel: 3
      }),
      imagemin.svgo({plugins: [{
        removeViewBox: true
      }]})
    ]))
    .pipe(gulp.dest("./dist/img"))
    .pipe(browserSync.stream()),

  gulp.src(["dist/img/favicon/**/*"])
    .pipe(gulp.dest("./dist/img/favicon"))
    .pipe(browserSync.stream()),

  // add srcset to images
  gulp.src("dist/**/*.html")
    .pipe(imgRetina())
    .pipe(gulp.dest("./dist/"))
));

/**
 * Run hugo and build the site
 */
function buildSite(cb, options, environment = "development") {
  const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;

  process.env.NODE_ENV = environment;

  return spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}
