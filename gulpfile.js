const gulp = require(`gulp`),
  uglify = require(`gulp-uglify`),
  concat = require(`gulp-concat`),
  rename = require(`gulp-rename`);

gulp.task(`compress`, function() {
  return gulp.src(`./mocha.js`)
    .pipe(uglify({
      mangle: false
    }))
    .pipe(rename(`mochaMin.js`))
    .pipe(gulp.dest(`./dist`));
});

gulp.task(`default`, [`compress`], function() {
  return gulp.src([`./dist/chaiMin.js`, `./dist/mochaMin.js`])
    .pipe(concat('mochaChaiMin.js'))
    .pipe(gulp.dest(`./dist`));
});