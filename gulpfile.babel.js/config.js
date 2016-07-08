import path from 'path';

export const root = path.join(__dirname, '../');

export const lib = {
  src: [
    `${root}/lib/**/*.js`
  ],
  base: `${root}/src/`
};

export const dist = `${root}/dist`;
