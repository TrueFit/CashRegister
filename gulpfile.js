const sourcemaps = require('gulp-sourcemaps'),
      minifycss  = require('gulp-minify-css'),
      nodemon    = require('gulp-nodemon'),
      changed    = require('gulp-changed'),
      concat     = require('gulp-concat'),
      notify     = require('gulp-notify'),
      watch      = require('gulp-watch'),
      babel      = require('gulp-babel'),
      gulp       = require('gulp'),
      less       = require('gulp-less');

const filePath = {
  less: {
    src: './public/style.less',
    dest: './public/assets/css'
  },
  js: {
    src: './public/cashRegister.js',
    dest: './public/assets/mainJS'
  }
};

const nodemonOptions = {
  script: 'server.js',
  ext: 'js',
  env: {'NODE_ENV': 'development'},
  verbose: false,
  ignore: [],
  watch: ['server.js']
};

gulp.task('start', () => {
  nodemon(nodemonOptions).on('restart', () => {
    console.log('Nodemon restarted.');
  });
});

gulp.task('less', () => {
  return gulp.src([
    filePath.less.src
  ])
  .pipe(changed(filePath.less.dest))
  .pipe(sourcemaps.init())
  .pipe(less())
  .pipe(minifycss())
  .pipe(concat('style.css'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(filePath.less.dest))
  .pipe(notify({message: 'Less task complete.'}));
});

gulp.task('js', () => {
  return gulp.src([
    filePath.js.src
  ])
  .pipe(changed(filePath.js.dest))
  .pipe(babel())
  .pipe(concat('main.js'))
  .pipe(gulp.dest(filePath.js.dest))
  .pipe(notify({message: 'JS task complete.'}));
});

gulp.task('watch-parts', () => {
  gulp.watch(filePath.js.src, ['js']);
  gulp.watch(filePath.less.src, ['less']);
});

gulp.task('build', ['less', 'js']);
gulp.task('watch', ['watch-parts']);
gulp.task('default', ['watch']);