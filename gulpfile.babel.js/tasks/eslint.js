import gulp from 'gulp';
import eslint from 'gulp-eslint';

import * as config from '../config';

const eslintTask = () => {
  return gulp.src(config.lib.src)
    .pipe(eslint())
    .pipe(eslint.format());
};

gulp.task('eslint', eslintTask);

export default eslintTask;
