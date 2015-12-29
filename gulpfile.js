var gulp = require('gulp');

var minify = require('gulp-minify');
 
gulp.task('compress', function() {
  gulp.src('lib/*.js')
    .pipe(minify({
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('dist'))
});