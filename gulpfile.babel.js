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

// -- gulp other packages
import plumber from 'gulp-plumber'




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

// *************** //
// gulp build task //
// *************** //
gulp.task( 'build:html', gulp.series(html) )
