var gulp = require('gulp');
var lint = require('gulp-eslint');
var nodemon = require('gulp-nodemon');

gulp.task('lint', function() {
  return gulp.src(['**/*.js', '!node_modules/**', '!public/semantic/**', '!semantic/**', '!hoot.js'])
    .pipe(lint())
    .pipe(lint.format())
    .pipe(lint.failAfterError())
})

gulp.task('default', ['lint'], function() {
  nodemon({
    script: 'app.js'
  })
})
