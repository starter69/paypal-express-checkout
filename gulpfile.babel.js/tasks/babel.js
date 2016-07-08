import gulp from 'gulp';
import babel from 'gulp-babel';
import { log } from 'gulp-util';

import * as config from '../config';

const babelTask = () => {
  return new Promise((resolve, reject) => {
    gulp.src(config.lib.src)
    .pipe(babel({
      sourceMaps: 'inline'
    }))
    .pipe(gulp.dest(config.dist))
    .on('error', (err) => {
      reject(err);
    })
    .on('end', () => {
      log('Completed ES6 Conversion');
      resolve();
    })
  });
};

gulp.task('babel', babelTask);

export default babelTask;
