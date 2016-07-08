import gulp from 'gulp';
import babel from 'gulp-babel';
import { log } from 'gulp-util';

const buildTask = () => {
  return new Promise((resolve, reject) => {
    gulp.src([
      'lib/**/*.js'
    ])
    .pipe(babel({
      sourceMaps: 'inline'
    }))
    .pipe(gulp.dest('./dist'))
    .on('error', (err) => {
      reject(err);
    })
    .on('end', () => {
      log('Completed ES6 Conversion');
      resolve();
    })
  });
};

gulp.task('build', buildTask);

export default buildTask;
