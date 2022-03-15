let preprocessor = 'sass', // Preprocessor (sass, less, styl); 'sass' also work with the Scss syntax in blocks/ folder.
fileswatch   = 'html,htm,txt,json,md,woff2,ttf,svg,png,jpg' // List of files extensions for watching & hard reload

const { src, dest, parallel, series, watch } = require('gulp')
const browserSync  = require('browser-sync').create()
const bssi         = require('browsersync-ssi')
const ssi          = require('ssi')

//const sass         = require('gulp-sass')
//const sassglob     = require('gulp-sass-glob')
const cssimport = require("gulp-cssimport");

const cleancss     = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const rename       = require('gulp-rename')
const imagemin     = require('gulp-imagemin');

const newer        = require('gulp-newer')
const rsync        = require('gulp-rsync')
const del          = require('del')
const plumber      = require('gulp-plumber')
//const shorthand = require('gulp-shorthand')
const sourcemaps = require('gulp-sourcemaps')
// SVG
const svgSprite = require('gulp-svg-sprite')

const  replace = require('gulp-replace')


function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'src/',
			middleware: bssi({ baseDir: 'src/', ext: '.html' })
		},
		// tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
		notify: false,
		online: true
	})
}


function svgSpriteBuild() {	
	return src('src/template/svg/icons/*.svg')
		.pipe(plumber())

		.pipe(svgSprite({
				log: "info",
				mode: {
					symbol: {
						dest: "../svg/",
						sprite: 'sprite.svg',
						prefix: ".icon-%s",
						dimensions: false,
						inline: true,
						example: true,
						// render: {
						// 	css: {
						// 		//dimensions: false,
						// 	}
						// }
					},
				},
				shape: {
					transform: [
						{
							svgo: {
								plugins: [
									{
										removeAttrs: {
											attrs: ['class', 'data-name', 'fill', 'stroke.*'],
										},
									},
								],
							},
						},
					],
				},
				// css: { // Activate the «css» mode
				// 	render: {
				// 		css: true // Activate CSS output (with default options)
				// 	}
				// }
				// symbol: {
				// 	sprite: "../svg/sprite.svg",
				// 	// render: {
				// 	// 	css: {
							
				// 	// 		dest: '../styles/icons.css',
				// 	// 		//template: "app/_sass/templates/_sprite_template.scss"
				// 	// 	}
				// 	// }
				// }
			
		}))
		.on('error', function (error) {
			console.log(error)
		})
		.pipe(dest('src/template/svg'));
}



function jsSimple() {
	return src(['src/template/js/**/*'])
		.pipe(newer('dist/template/js'))
		.pipe(browserSync.stream())
}


function styles() {
	return src([`src/template/css/src/_main.css`])
		.pipe(plumber())
		.pipe(sourcemaps.init({ largeFile: true }))
		.pipe(sourcemaps.identityMap())
		.pipe(cssimport())
		//.pipe(sass())
		.pipe(autoprefixer({
			cascade: false
		}))

		.pipe(rename({ basename: "style", suffix: '.min' }))
		.pipe(sourcemaps.write('../css/'))
		//.pipe(sourcemaps.write())
		.pipe(dest('src/template/css'))
		.pipe(browserSync.stream())
}


function images_old() {
	return src(['src/template/img/src/**/*'])
		.pipe(newer('src/template/img/dist'))
		.pipe(imagemin())
		.pipe(dest('src/template/img/dist'))
		.pipe(browserSync.stream())
}

const imageminConfig = 
	[
		imagemin.gifsicle({ interlaced: true }),
		imagemin.mozjpeg({
			quality: 85,
			progressive: true
		}),
		imagemin.optipng({ optimizationLevel: 5 }),
		imagemin.svgo({
			plugins: [
				{ removeViewBox: true },
				{ cleanupIDs: false }
			]
		})
	];

function images() {
	return src('src/template/img/**/*.{gif,png,jpg,svg,webp}')
		.pipe(newer('dist/template/img'))
		.pipe(imagemin())
		.pipe(dest('dist/template/img'))
		.pipe(browserSync.stream())
}

function imagesContent() {
	return src('src/assets/images/**/*.{gif,png,jpg,svg,webp}')
		.pipe(newer('dist/assets/images'))
		.pipe(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.mozjpeg({
				quality: 80,
				progressive: true
			}),
			imagemin.optipng({ optimizationLevel: 5 }),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false }
				]
			})
		]))
		.pipe(dest('dist/assets/images'))
		.pipe(browserSync.stream())
}


function buildcopy() {
	return src([
		//'{src/template/js,src/template/css}/*.min.*',
		'{src/template/js,src/template/css}/*.*',
		//'src/template/img/**/*.*',
		//'!src/template/img/src/**/*',
		'src/img/**/*',
		'src/template/font/**/*'
	], { base: 'src/' })
	.pipe(dest('dist'))
}

async function buildhtml() {
	let includes = new ssi('src/', 'dist/', '/**/*.html')
	includes.compile()
	del('dist/parts', { force: true })
}


function fonts() {
	return src('src/template/fonts/**/*')
		.pipe(newer('dist/template/fonts'))
		.pipe(dest('dist/template/fonts'))
}

function svg() {
	return src('src/template/svg/**/*')
		.pipe(newer('dist/template/svg'))
		.pipe(dest('dist/template/svg'))
}


function cleandist() {
	return del('dist/**/*', { force: true })
}

function deploy() {
	return src('dist/')
		.pipe(rsync({
			root: 'dist/',
			hostname: 'username@yousite.com',
			destination: 'yousite/public_html/',
			include: [/* '*.htaccess' */], // Included files to deploy,
			exclude: [ '**/Thumbs.db', '**/*.DS_Store' ],
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}))
}

function startwatch() {
	watch(`src/template/css/src/*`, { usePolling: true }, styles)
	watch(`src/template/svg/icons/*.{svg}`, { usePolling: true }, svgSpriteBuild)
	//watch(['src/template/js/**/*.js', '!src/template/js/**/*.min.js'], { usePolling: true }, jsSimple)
	//watch('src/template/img/**/*.{jpg,jpeg,png,webp,svg,gif}', { usePolling: true }, images)
	//watch('src/template/svg/**/*.{svg}', { usePolling: true }, images)
	//watch('src/img/**/*.{jpg,jpeg,png,webp,svg,gif}', { usePolling: true }, imagesContent)
	//watch(`src/**/*/*.{${fileswatch}}`, { usePolling: true }).on('change', browserSync.reload)
	watch(`src/**/*`, { usePolling: true }).on('change', browserSync.reload)
}
exports.svgSprite = svgSpriteBuild
exports.jsSimple = jsSimple
//exports.scripts = scripts
exports.styles  = styles
exports.images  = images
exports.deploy  = deploy
exports.assets = series(jsSimple, styles, images, imagesContent)
exports.build = series(cleandist, jsSimple, styles, images, imagesContent, buildcopy, buildhtml, fonts, svg)
//exports.default = series(scripts, styles, images, parallel(browsersync, startwatch))

exports.default = series(styles, images, imagesContent, parallel(browsersync, startwatch))
