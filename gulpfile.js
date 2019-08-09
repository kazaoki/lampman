

const distPath = './dist';

const gulp         = require('gulp');
const browserSync  = require('browser-sync');
const ts           = require('gulp-typescript');
const uglify       = require('gulp-uglify');

/**
 * browser sync
 */
gulp.task('server', ()=>{
	browserSync.init({
		startPath: '/',
		notify: false,
		https: false,
		// server: {baseDir: 'html'} // static
		// proxy: 'localhost:8000', // connect php
		proxy: {
			target: 'http://localhost', // lampman run
			proxyReq: [
				proxyReq=>proxyReq.setHeader('X-BrowserSync-Proxy-Port', '3000')
			]
		}
	});
});

// TypeScript
gulp.task('ts', function () {
	return gulp.src('src/**/*.ts')
		.pipe(ts({
			noImplicitAny: true,
			outFile: 'lampman.js'
		}))
		.pipe(gulp.dest(distPath))
		.pipe(uglify())
		.pipe(gulp.dest(distPath))
})

/**
 * watch files change
 */
gulp.task('watch', ()=>{
	gulp.watch('src/**/*.ts', gulp.task('ts'))
	gulp.watch('public_html/**/*.{html,php,js,css}').on('change', browserSync.reload)
});

/**
 * default
 */
gulp.task('default',
	gulp.series(
		gulp.parallel(
			'ts',
			'server',
			'watch',
		)
	)
);
