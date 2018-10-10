import gulp from 'gulp';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import gulpif from 'gulp-if';
import del from 'del';

function clean() {
  return del([
    'dist',
  ]);
}

function build() {
  return gulp.src('src/**/*')
    .pipe(gulpif(/\.js$/, babel()))
    .pipe(gulpif(/\.js?$/, uglify()))
    .pipe(gulp.dest('lib/passport-ropc'));
}

gulp.task('build', build);
gulp.task('clean', clean);

gulp.task('default', gulp.series('clean', 'build'));
