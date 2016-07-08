import del from 'del';
import gulp from 'gulp';
import { dist } from '../config';

const cleanTask = () => {
  return del(dist);
};

gulp.task('clean', cleanTask);

export default cleanTask;
