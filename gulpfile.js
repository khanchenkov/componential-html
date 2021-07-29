const project_folder = 'dist'
const source_folder  = 'src'

const path = {
    build: {
        html  : `${project_folder}/`,
        css   : `${project_folder}/css/`,
        js    : `${project_folder}/js/`,
        img   : `${project_folder}/img/`,
        res   : `${project_folder}/res/`,
        fonts : `${project_folder}/fonts/`
    },
    src: {
        html  : `${source_folder}/*.html`,
        css   : `${source_folder}/sass/style.sass`,
        js    : `${source_folder}/js/script.js`,
        img   : `${source_folder}/img/**/*.{jpg,png,svg,gif,ico,webp}`,
        res   : `${source_folder}/res/**`,
        fonts : `${source_folder}/fonts/*.ttf`
    },
    watching: {
        html  : `${source_folder}/**/*.html`,
        css   : `${source_folder}/**/*.sass`,
        js    : `${source_folder}/js/**/*.js`,
        img   : `${source_folder}/img/**/*.{jpg,png,svg,gif,ico,webp}`,
        res   : `${source_folder}/res/**`
    },
    clean: `./${project_folder}/`
}

const {src, dest, parallel, series, watch, task} = require('gulp')
const fs            = require('fs')
const browsersync   = require('browser-sync').create()
const fileinclude   = require('gulp-file-include')
const del           = require('del')
const sass          = require('gulp-dart-sass')
const autoprefixer  = require('gulp-autoprefixer')
const group_media   = require('gulp-group-css-media-queries')
const clean_css     = require('gulp-clean-css')
const rename        = require('gulp-rename')
const imagemin      = require('gulp-imagemin')
// const webp          = require('gulp-webp')
// const webp_html     = require('gulp-webp-html')
// const webp_css      = require('gulp-webpcss')
const svg_sprite    = require('gulp-svg-sprite')
const ttf2woff      = require('gulp-ttf2woff')
const ttf2woff2     = require('gulp-ttf2woff2')
const fonter        = require('gulp-fonter')
const webpack       = require('webpack-stream')
const util          = require('gulp-util')
// const ftp           = require('vinyl-ftp')


const browserSync = () => {
    browsersync.init({
        server: {
            baseDir: `./${project_folder}/`
        },
        port: 3000,
        notify: false 
    })
}

const html = () => {
    return src(path.src.html)
        .pipe(fileinclude({
            prefix: '@',
            // basepath: '@file'
        }))
        // .pipe(webp_html())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

const css = () => {
    return src(path.src.css)
        .pipe(sass({
            outputStyle: 'expanded',
        }).on('error', util.log))
        .pipe(group_media())
        .pipe(autoprefixer({
            overrideBrowserlist: ["last 5 versions"],
            grid: "true",
            // cascade: true //make it prettier
        }))
        //.pipe(webp_css())
        .pipe(dest(path.build.css))
        .pipe(clean_css({level: 2}))
        .pipe(rename({extname: '.min.css'}))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

const js = () => {
    return src(path.src.js)
        .pipe(webpack({
            output: {
                filename: 'script.min.js'
            },
            mode: 'production',
            devtool: 'source-map',
            module: {
                rules: [
                  {
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: {
                      loader: 'babel-loader',
                      options: {
                        presets: [
                          ['@babel/preset-env', { targets: "defaults" }]
                        ]
        }}}]}}))
        .on('error', function handleError() {
            this.emit('end'); // Recover from errors
        })
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

const images = () => {
    return src(path.src.img)
        // .pipe(webp({
        //         quality: 70 // 0-100; configure it with optimizationLevel
        // }))
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          interlaced: true,
          optimizationLevel: 3 // 0-7
        }))
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

const resources = () => {
    return src(path.src.res)
      .pipe(dest(path.build.res))
}

const fonts = () => {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
}

const watchFiles = () => {
    watch([path.watching.html], html)
    watch([path.watching.css], css)
    watch([path.watching.js], js)
    watch([path.watching.img], images)
}

const clean = () => {
    return del(path.clean)
}

const fontsStyle = () => {
    let file_content = fs.readFileSync(`${source_folder}/sass/mix/_fonts.sass`)
    if (file_content == '') {
        fs.writeFile(`${source_folder}/sass/_fonts.sass`, '', cb)
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.')
                    fontname = fontname[0]
                    if (c_fontname != fontname) {
                        // Название, имя файла, начертание (300, 400, 700), стиль
                        fs.appendFile(`${source_folder}/sass/mix/_fonts.sass`, '@include font("' + fontname + '", "' + fontname + '", "400", "normal")\r\n', cb);
                    }
                    c_fontname = fontname
                }
            }
        })
    }
}
function cb() {}

task('svgSprite', () => {
    return src([`${source_folder}/img/icons/*.svg`])
        .pipe(
            svg_sprite({
                mode: {
                    stack: {
                        sprite: "../sprite/icons.svg"
        }}}))
        .pipe(dest(path.build.img))
})

task('otf2ttf', () => {
    return src([`${source_folder}/fonts/*.otf`])
            .pipe(fonter({
              formats: ['ttf'] 
            }))
            .pipe(dest(`${source_folder}/fonts/`))
})

// task('deploy', () => {
//     let conn = ftp.create({
//         host: '',
//         user: '',
//         password: '',
//         parallel: 10,
//         log: util.log
//     })
    
//     let globs = ['dist/**']
    
//     return src(globs, {
//         base: './dist',
//         buffer: false
//     })
//         .pipe(conn.newer('')) // need URL; only upload newer files    
//         .pipe(conn.dest(''))
// })

const build = series(clean, parallel(html, js, css, images, fonts, resources), fontsStyle)
const run   = parallel(build, watchFiles, browserSync)
 
exports.fontsStyle = fontsStyle 
exports.fonts      = fonts
exports.images     = images
exports.html       = html
exports.js         = js
exports.css        = css
exports.build      = build
exports.watch      = run
exports.default    = run   

