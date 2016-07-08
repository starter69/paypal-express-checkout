import gulp from 'gulp';
import runSequence from 'run-sequence';

const buildTask = (cb) => {
  runSequence('clean', 'eslint', 'babel', cb);
};

gulp.task('build', buildTask);

export default buildTask;
