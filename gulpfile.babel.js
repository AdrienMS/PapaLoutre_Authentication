const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const path = require('path');
const del = require('del');

const plugins = gulpLoadPlugins();

const paths = {
    js: ['./**/*.js', '!dist/**', '!node_modules/**', '!coverage/**'],
    nonJs: ['./package.json', './.env'],
    swagger: './config/swagger.json',
    keys: './keys/*.key',
    tests: './server/tests/*.js',
};

// Clean up dist and coverage directory
gulp.task('clean', (done) => {
    del.sync(['dist/**', 'dist/.*', 'coverage/**', '!dist', '!coverage']);
    done();
});

// Copy non-js files to dist
gulp.task('copy', (done) => {
    gulp
        .src(paths.nonJs)
        .pipe(plugins.newer('dist'))
        .pipe(gulp.dest('dist'));
    gulp
        .src(paths.swagger)
        .pipe(plugins.newer('dist'))
        .pipe(gulp.dest('dist/config'));
    gulp
        .src(paths.keys)
        .pipe(plugins.newer('dist'))
        .pipe(gulp.dest('dist/keys'));
    done();
});

// Compile to ES6 and copy to dist
gulp.task('babel', () => gulp
    .src([...paths.js, '!gulpfile.babel.js'], { base: '.' })
    .pipe(plugins.newer('dist'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.sourcemaps.write('.', {
        includeContent: false,
        sourceRoot(file) {
            return path.relative(file.path, __dirname);
        },
    }))
    .pipe(gulp.dest('dist')));

// Start server with restart on file changes
gulp.task('nodemon', gulp.series(gulp.parallel('copy', 'babel'), () => plugins.nodemon({
    script: path.join('dist', 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['copy', 'babel'],
})));

// gulp serve for development
gulp.task('serve', gulp.series('clean', 'nodemon'));

// default task: clean dist, compile js files and copy non-js files.
gulp.task('default', gulp.series('clean', gulp.parallel(['copy', 'babel'])));
