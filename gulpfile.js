'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', ['sass'], function() {
	gulp.watch('./sass/*.sass', ['sass']);
});

gulp.task('sass', function () {
	return gulp.src('./sass/*.sass')
		.pipe(sass().on('error', sass.logError))
    	.pipe(gulp.dest('./public/stylesheets'));
});
