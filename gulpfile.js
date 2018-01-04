const SRC = "./src/**/*.js";
const BUILD = "./build/";

const VERSION = require("./package.json").version;

const gulp = require("gulp");
const zip = require("gulp-zip");
const concat = require("gulp-concat");

gulp.task("scripts", function() {
	return gulp.src(SRC)
		.pipe(concat("content.js"))
		.pipe(gulp.dest(BUILD));
});

gulp.task("zip", function() {
	return gulp.src([BUILD + "content.js", "icon.png", "inject.js", "manifest.json"], { base: "." })
		.pipe(zip("RuMinePP v" + VERSION + ".zip"))
		.pipe(gulp.dest("./"));
});

gulp.task("default", ["scripts"]);