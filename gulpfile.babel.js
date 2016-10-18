import gulp from 'gulp';
import es from 'event-stream';
import inject from 'gulp-inject';
import sort from 'gulp-sort';

const definitions = [
  {
    target: `${__dirname}/src/main.js`,
    imports: [`${__dirname}/src/components/**/!(_)*.tag`],
    ext: 'tag',
    transform: (filepath) => {
      return `import './${filepath}';`;
    }
  },
  {
    target: `${__dirname}/src/main.styl`,
    imports: [`${__dirname}/src/components/**/!(_)*.styl`],
    ext: 'styl',
    transform: (filepath) => {
      const newPath = filepath.replace(`.styl`, '');
      return `@import '${newPath}';`;
    }
  }
];

gulp.task('inject', () => {
  es.merge(definitions.map((obj) => {
    return gulp.src(obj.target)
      .pipe(
        inject(
          gulp.src(obj.imports, { read: false })
            .pipe(sort()),
          {
            starttag: `/* inject:${obj.ext} */`,
            endtag: '/* endinject */',
            relative: true,
            transform: obj.transform
          }
        )
      )
      .pipe(gulp.dest(`${__dirname}/src`));
  }));
});

gulp.task('default', ['inject']);
