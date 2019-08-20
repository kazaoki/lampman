

const distPath = './dist';

const gulp         = require('gulp');
const browserSync  = require('browser-sync');
const uglify       = require('gulp-uglify');
const rename       = require('gulp-rename');
const concat       = require("gulp-concat");
const ts           = require('gulp-typescript');

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
gulp.task('lampmants', function () {
	return gulp.src(['src/modules/*.ts', 'src/*.ts'])
		.pipe(ts({
			noImplicitAny: true,
		}))
		.pipe(concat('lampman.js'))
		.pipe(rename({ extname: '' }))
		.pipe(uglify())
		.pipe(gulp.dest(distPath))
})

/**
 * watch files change
 */
gulp.task('watch', ()=>{
	gulp.watch('src/**/*.ts', gulp.task('lampmants'))
	gulp.watch('public_html/**/*.{html,php,js,css}').on('change', browserSync.reload)
});

/**
 * default
 */
gulp.task('default',
	gulp.series(
		gulp.parallel(
			'lampmants',
			'server',
			'watch',
		)
	)
);
