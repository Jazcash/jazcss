const gulp         = require("gulp");
const plumber      = require("gulp-plumber");
const sourcemaps   = require("gulp-sourcemaps");
const rename       = require("gulp-rename");
const sassGlob     = require("gulp-sass-glob");
const sass         = require("gulp-sass");
const babel        = require('gulp-babel');
const concat       = require("gulp-concat");
const uglify       = require("gulp-uglify");
const wait         = require("gulp-wait");
const watch        = require('gulp-watch');
const hb           = require('gulp-hb');
const postcss      = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano      = require("cssnano");
const del          = require('del');
const hbLayouts    = require('handlebars-layouts');
const browserSync  = require("browser-sync").create();

gulp.task("styles", function(){
	return gulp.src("src/styles/styles.scss")
		.pipe(plumber({errorHandler: function (err) {
			console.log(err);
			this.emit("end");
		}}))
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(wait(500)) // uncomment this line if you're getting @import errors when saving .scss (likely on slower machines)
		.pipe(sass())
		.pipe(postcss([
			autoprefixer({browsers: ["last 50 versions", "ie >= 9"]}),
			cssnano()
		]))
		.pipe(rename({suffix: ".min"}))
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("build"))
		.pipe(browserSync.stream({match: "**/*.css"}));
});

gulp.task("scripts", function(){
	return gulp.src([
			"src/scripts/vendor/**/*.js",
			"src/scripts/util/**/*.js",
			"src/scripts/components/**/*.js"
		])
		.pipe(plumber({errorHandler: function (err) {
			console.log(err);
			this.emit("end");
		}}))
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ["es2015"]
		}))
		.pipe(concat("scripts.min.js"))
		.pipe(uglify())
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("build"))
		.pipe(browserSync.stream({match: "**/*.js"}));
});

gulp.task("images", function(){
	return gulp.src("src/images/**/*.{png,jpg,gif}")
		.pipe(plumber({errorHandler: function (err) {
			console.log(err);
			this.emit("end");
		}}))
		.pipe(gulp.dest("build/images"));
});

gulp.task("fonts", function(){
	return gulp.src("src/fonts/**/*")
		.pipe(plumber({errorHandler: function (err) {
			console.log(err);
			this.emit("end");
		}}))
		.pipe(gulp.dest("build/fonts"));
});

gulp.task("handlebars", function(){
	return gulp.src("src/pages/**/*.hbs")
		.pipe(plumber({errorHandler: function (err) {
			console.log(err);
			this.emit("end");
		}}))
		.pipe(hb()
			.partials("src/partials/**/*.hbs")
			.partials("src/layouts/**/*.hbs")
			.helpers(hbLayouts))
		.pipe(rename({extname: ".html"}))
		.pipe(gulp.dest("build"))
});

gulp.task("browsersync", function(){
	browserSync.init({
		server: {
			baseDir: "build",
			index: "index.html"
		}
	});
	gulp.start("watch");
});

gulp.task("watch", function(){
	gulp.watch("src/styles/**/*.{css,scss}", ["styles"]);
	gulp.watch("src/scripts/**/*.js", ["scripts"]);
	gulp.watch("src/images/**/*.{png,jpg,gif}", ["images"]);
	gulp.watch("src/**/*.hbs", ["watch:handlebars"]);
});

gulp.task("watch:handlebars", ["handlebars"], function(){
	browserSync.reload();
});

gulp.task("clean", function(){
	return del(["build/**/*"]);
});

gulp.task("build", ["clean"], function(){
	gulp.start("handlebars");
	gulp.start("styles");
	gulp.start("scripts");
	gulp.start("fonts");
	gulp.start("images");
});

gulp.task("serve", ["build"], function(){
	gulp.start("browsersync");
});

gulp.task("default", [
	"serve"
])
