// ************* //
// src file path //
// ************* //

const path = {
  src : {
    html    : './src/pug/',
    css     : './src/scss/',
    script  : './src/scripts/',
    images  : './src/images/'
  },
  dist : {
    html    : './public/',
    css     : './public/css/',
    script  : './public/js/',
    images  : './public/images/'
  }
}


// ******************** //
// import packages list //
// ******************** //

// -- gulp main packages
import gulp from 'gulp'
import fs from 'fs'

// -- gulp html packages
import pug from 'gulp-pug'

// -- gulp sass packages
import autoprefixer from 'gulp-autoprefixer'
import sass         from 'gulp-sass'
import sourcemaps   from 'gulp-sourcemaps'
import cleanCSS     from 'gulp-clean-css'

// -- gulp js packages
import uglify from 'gulp-uglify'
import concat from 'gulp-concat'
import babel  from 'gulp-babel' 

// -- gulp images packages
import imagemin    from 'gulp-imagemin'
import imageminJpg from 'imagemin-jpegtran'
import imageminPng from 'imagemin-optipng'
import imageminGif from 'imagemin-gifsicle'

// -- gulp other packages
import plumber     from 'gulp-plumber'
import rimraf      from 'rimraf'
import changed     from 'gulp-changed'
import browserSync from 'browser-sync'
import gulpEslint  from 'gulp-eslint'

// **************** //
// gulp single task //
// **************** //

// -- build html task
const html = () => {
  const json = JSON.parse(fs.readFileSync( path.src.html + 'data/default.json' ))

  return gulp.src( [path.src.html + '**.pug', path.src.html + '**/[^_]*.pug'], { since: gulp.lastRun(html) } )
    .pipe( plumber({
      errorHandler: function(err) {
        console.log(err.messageFormatted)
        this.emit('end')
      }
    }) )
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe( gulp.dest(path.dist.html) )
}

// -- build css task
const css = () => {
  return gulp.src( [path.src.css + '**.scss', path.src.css + '**/[^_]*.scss'], { since: gulp.lastRun(css) } )
    .pipe( plumber({
      errorHandler: function(err) {
        console.log(err.messageFormatted)
        this.emit('end')
      }
    }) )
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 3 versions'],
        cascade: false
      }))
    .pipe( gulp.dest(path.dist.css) )
}

// -- build js task
const js = () => {
  return gulp.src( [path.src.script + '**/**.js',path.src.script + 'common/[^_]*.js'], { since: gulp.lastRun(js) } )
    .pipe( plumber({
      errorHandler: function(err) {
        console.log(err.messageFormatted)
        this.emit('end')
      }
    }) )
    .pipe(babel())
    .pipe(concat('all.js'))
    .pipe(uglify({
        compress: true,
        mangle: true,
        output:{
          comments: /^!/
        }
      }))
    .pipe( gulp.dest(path.dist.script) )
}

// -- build eslint task
const eslint = () => {
  return gulp.src( [path.src.script + '**.js', path.src.script + 'common/[^_]*.js'], { since: gulp.lastRun(eslint) } )
    .pipe( plumber({
      errorHandler: function(err) {
        console.log(err.messageFormatted)
        this.emit('end')
      }
    }) )
    .pipe(gulpEslint())
    .pipe(gulpEslint.format())
    .pipe(gulpEslint.failOnError())
}

// -- build images task
const img = () => {
  return gulp.src( [path.src.images + '**.+(jpg|jpeg|png|gif)', path.src.images + '**/[^_]*.+(jpg|jpeg|png|gif)'], { since: gulp.lastRun(img) } )
    .pipe( plumber({
      errorHandler: function(err) {
        console.log(err.messageFormatted)
        this.emit('end')
      }
    }) )
    .pipe(changed(path.dist.images))
    .pipe(imagemin([
      imageminJpg({
        quality: 80,
        progressive: true
      }),
      imageminPng(),
      imageminGif({
        interlaced: false,
        optimizationLevel: 3,
        colors: 180
      })
    ]
    ))
    .pipe( gulp.dest(path.dist.images) )
}

// -- build copy task
const copy = () => {
  return gulp.src( [path.src.script + 'lib/[^_]*.js'], { since: gulp.lastRun(copy) } )
    .pipe( plumber({
      errorHandler: function(err) {
        console.log(err.messageFormatted)
        this.emit('end')
      }
    }) )
    .pipe( gulp.dest(path.dist.script + 'lib/') )
}

// -- build server task
const server = done => {
  return browserSync.init({
    open: 'external',
    server: {
      baseDir: path.dist.html,
      index  : 'list.html'
    }
  })
  done()
}

const reload = done => {
  browserSync.reload()
  done()
}

// -- build watch task
const watch = done => {
  gulp.watch([path.src.html + '**.pug', path.src.html + '**/*.pug'], gulp.parallel(html,reload))
  gulp.watch([path.src.css + '**.scss', path.src.css + '**/*.scss'], gulp.parallel(css,reload))
  gulp.watch([path.src.script + '**.js', path.src.script + 'common/*.js'], gulp.parallel(eslint,js,reload))
  gulp.watch([path.src.images + '**.+(jpg|jpeg|png|gif)', path.src.images + '**/[^_]*.+(jpg|jpeg|png|gif)'], gulp.parallel(img,reload))
  done()
}


// *************** //
// gulp build task //
// *************** //
gulp.task( 'build:html', gulp.series(html) )

gulp.task( 'build:css', gulp.series(css) )

gulp.task( 'build:js', gulp.series(js) )

gulp.task( 'build:img', gulp.series(img) )

gulp.task( 'eslint', gulp.series(eslint) )

gulp.task( 'copy', gulp.series(copy) )

gulp.task( 'build', gulp.series(html,css,js,img,copy) )

gulp.task( 'watch', gulp.parallel(server,watch,html,css,js) )
