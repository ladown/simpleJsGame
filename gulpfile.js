'use strict';

const gulp = require('gulp');
const webpack = require('webpack-stream');
const browsersync = require('browser-sync');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const newer = require('gulp-newer');

const dist = './dist/';

gulp.task('watch', function () {
  browsersync.init({
    server: { baseDir: dist },
    notify: true,
    online: true,
  });
});

gulp.task('html', function () {
  return gulp
    .src('./src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(dist))
    .pipe(browsersync.stream());
});

gulp.task('styles', function () {
  return gulp
    .src('./src/scss/**/*.+(scss|sass|css)')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(rename({ suffix: '.min', prefix: '' }))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browsersync.stream());
});

gulp.task('images', function () {
  return gulp
    .src('./src/img/**/*')
    .pipe(newer('./dist/img/'))
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img/'))
    .pipe(browsersync.stream());
});

gulp.task('fonts', function () {
  return gulp.src('./src/fonts/**/*').pipe(gulp.dest('./dist/fonts/')).pipe(browsersync.stream());
});

gulp.task('build-js', () => {
  return gulp
    .src('./src/js/main.js')
    .pipe(
      webpack({
        mode: 'development',
        output: {
          filename: 'script.js',
        },
        watch: false,
        devtool: 'source-map',
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        debug: true,
                        corejs: 3,
                        useBuiltIns: 'usage',
                      },
                    ],
                  ],
                },
              },
            },
          ],
        },
      }),
    )
    .pipe(gulp.dest(`${dist}/js/`))
    .on('end', browsersync.reload);
});

gulp.watch('./src/index.html', gulp.parallel('html'));
gulp.watch('./src/js/**/*.js', gulp.parallel('build-js'));
gulp.watch('./src/scss/**/*.+(scss|sass|css)', gulp.parallel('styles'));
gulp.watch('./src/img/**/*').on('all', gulp.parallel('images'));
gulp.watch('./src/fonts/**/*').on('all', gulp.parallel('fonts'));
gulp.task('build', gulp.parallel('html', 'build-js', 'styles', 'images', 'fonts'));

gulp.task('build-prod-js', () => {
  return gulp
    .src('./src/js/main.js')
    .pipe(
      webpack({
        mode: 'production',
        output: {
          filename: 'script.js',
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        corejs: 3,
                        useBuiltIns: 'usage',
                      },
                    ],
                  ],
                },
              },
            },
          ],
        },
      }),
    )
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest(`${dist}/js/`))
    .pipe(browsersync.stream())
    .on('end', browsersync.reload);
});

gulp.task('default', gulp.parallel('watch', 'build', 'build-prod-js'));
