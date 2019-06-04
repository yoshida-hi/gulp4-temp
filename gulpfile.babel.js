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
import rename       from 'gulp-rename'


// -- gulp other packages
import plumber from 'gulp-plumber'
import rimraf  from 'rimraf'




// **************** //
// gulp single task //
// **************** //

// -- build html task
const html = () => {
  const json = JSON.parse(fs.readFileSync( path.src.html + 'data/default.json' ));

  return gulp.src( [path.src.html + '**.pug', path.src.html + '**/[^_]*.pug'], { since: gulp.lastRun(html) } )
    .pipe( plumber({
      errorHandler: function(err) {
        console.log(err.messageFormatted);
        this.emit('end');
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
  return gulp.src( [path.src.css + '**.scss', path.src.css + '!**/[^_]*.scss'], { since: gulp.lastRun(css) } )
    .pipe( plumber({
      errorHandler: function(err) {
        console.log(err.messageFormatted);
        this.emit('end');
      }
    }) )
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(cleanCSS())
    .pipe(rename({
        extname: '.min.css'
    }))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 3 versions'],
        cascade: false
      }))
    .pipe( gulp.dest(path.dist.css) )
}


// *************** //
// gulp build task //
// *************** //
gulp.task( 'build', gulp.series(html,css) )
