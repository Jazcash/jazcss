/// <binding ProjectOpened="build, watch" />
const fs           = require("fs");
const gulp         = require("gulp");
const plumber      = require("gulp-plumber");
const runSequence  = require("run-sequence");
const sourcemaps   = require("gulp-sourcemaps");
const rename       = require("gulp-rename");
const sassGlob     = require("gulp-sass-glob");
const sass         = require("gulp-sass");
const babel        = require("gulp-babel");
const concat       = require("gulp-concat");
const uglify       = require("gulp-uglify");
const wait         = require("gulp-wait");
const watch        = require("gulp-watch");
const hb           = require("gulp-hb");
const postcss      = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano      = require("cssnano");
const del          = require("del");
const hbLayouts    = require("handlebars-layouts");
const hbHelpers    = require("handlebars-helpers");
const browserSync  = require("browser-sync").create();

let colors = {};
let pages = {};

gulp.task("styles", function(){
	return gulp.src("src/styles/styles.scss")
		.pipe(plumber({errorHandler: function (err) {
			console.log(err);
			this.emit("end");
		}}))
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(wait(1000)) // this line is if you"re getting @import errors when saving .scss (likely on slower machines)
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

gulp.task("videos", function(){
	return gulp.src("src/videos/**/*")
		.pipe(plumber({errorHandler: function (err) {
			console.log(err);
			this.emit("end");
		}}))
		.pipe(gulp.dest("build/videos"));
});

gulp.task("fonts", function(){
	return gulp.src("src/fonts/**/*")
		.pipe(plumber({errorHandler: function (err) {
			console.log(err);
			this.emit("end");
		}}))
		.pipe(gulp.dest("build/fonts"));
});

gulp.task("colors", function(){
	var fileStr = fs.readFileSync("src/styles/base/variables.scss", "utf-8");
	var re = /\$colors\:\s([.\s\S][^;]*)/;
	var matches = fileStr.match(re);
	var colorStr = matches[1].slice(1, -1).replace(/\s/g, "").split(",");
	for (let i=0; i<colorStr.length; i++){
		let color = colorStr[i].split(":");
		colors[color[0]] = color[1];
	}
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
			.helpers(hbLayouts)
			.helpers("./node_modules/handlebars-helpers/lib/**/!(object).js")
			.data({
				colors: colors
			})
		)
		.pipe(rename({extname: ".html"}))
		.pipe(gulp.dest("build"))
});

gulp.task("browsersync", function(){
	browserSync.init({
		server: {
			baseDir: "build",
			index: "index.html",
			port: 3001,
			serveStaticOptions: {
				extensions: ["html"]
			}
		}
	});
	gulp.start("watch");
});

gulp.task("watch", function(){
	gulp.watch("src/styles/**/*.{css,scss}", ["styles"]);
	gulp.watch("Frontend/src/styles/base/variables.scss", ["colors", "handlebars"]);
	gulp.watch("src/scripts/**/*.js", ["scripts"]);
	gulp.watch("src/fonts/**/*", ["fonts"]);
	gulp.watch("src/images/**/*.{png,jpg,gif}", ["images"]);
	gulp.watch("src/videos/**/*", ["videos"]);
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
	gulp.start("videos");
});

gulp.task("serve", function(){
	runSequence("clean", "colors", ["handlebars", "styles", "scripts", "fonts", "images"], "browsersync");
});

gulp.task("default", [
	"serve"
])
