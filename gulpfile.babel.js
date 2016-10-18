import gulp from 'gulp';
import es from 'event-stream';
import inject from 'gulp-inject';
import sort from 'gulp-sort';

const definitions = [
  {
    target: `${__dirname}/src/main.js`,
    imports: [
      {
        files: [`${__dirname}/src/components/**/!(_)*.tag`],
        ext: 'tag',
        transform: (filepath) => {
          return `import './${filepath}';`;
        }
      },
      {
        files: [`${__dirname}/src/components/**/!(_)*.svg`],
        ext: 'svg',
        transform: (filepath) => {
          return `import './${filepath}';`;
        }
      }
    ]
  },
  {
    target: `${__dirname}/src/main.styl`,
    imports: [
      {
        files: [`${__dirname}/src/components/**/!(_)*.styl`],
        ext: 'styl',
        transform: (filepath) => {
          const newPath = filepath.replace(`.styl`, '');
          return `@import '${newPath}';`;
        }
      }
    ]
  }
];

const injection = (obj) => {
  return inject(
    gulp.src(obj.files, { read: false })
      .pipe(sort()),
    {
      starttag: `/* inject:${obj.ext} */`,
      endtag: `/* endinject:${obj.ext} */`,
      relative: true,
      transform: obj.transform
    }
  )
}

gulp.task('inject', () => {
  es.merge(definitions.map((def) => {
    let stream = gulp.src(def.target);
    def.imports.map((obj) => {
      stream = stream.pipe(injection(obj));
    })
    return stream.pipe(gulp.dest(`${__dirname}/src`));
  }));
});

gulp.task('default', ['inject']);
