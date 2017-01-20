//top-level gulp stuff
import gulp from 'gulp'
import notify from 'gulp-notify'
import plumber from 'gulp-plumber'

//css processing
import stylus from 'gulp-stylus'
import rupture from 'rupture'
import rucksack from 'gulp-rucksack'
import cssnano from 'gulp-cssnano'
import concatCSS from 'gulp-concat-css'
import axis from 'axis'

//postCSS modules
import postcss from 'gulp-postcss' 
import autoprefixer from 'autoprefixer'
import lost from 'lost'

//html processing
import pug from 'gulp-pug'

//js processing
import uglify from 'gulp-uglify'

//browser-sync
import browserSync from 'browser-sync'
const reload = browserSync.reload;

//from a Wes Bos tutorial
function handleErrors() {
    //arguments needs to be an array, so slicey-dicey.
    var args = Array.prototype.slice.call(arguments)
    console.log(args);
    notify.onError({
        title: "Gulp done fucked up",
        message: '<% error.message %>'
    }).apply(this, args); //apply - not call - the notify.onError to every 
    this.emit('end'); //keeps gulp from hanging on task
}

//process our styles
gulp.task('styles', function() {

    return gulp.src('build/styles/*.styl')
        .pipe(plumber({ errorHandler: handleErrors }))
        .pipe(stylus({
             use: [ axis(), rupture() ]
           }))
        .pipe( postcss([
            lost(),
            autoprefixer({browsers: ['last 2 versions']}),
        ]))
        .pipe( rucksack() )
        .pipe( concatCSS('bundle.css') )
        .pipe( cssnano() )
        .pipe( notify("CSS good to go!") )
        .pipe( gulp.dest('./public/css/') )
});

//do the browser_sync thing
gulp.task('browserSync', function() {
    browserSync({
        server: { baseDir: './public/'}
    });
});

gulp.task('indexify', function() {
    return gulp.src('build/index.pug')
        .pipe( plumber({ errorHandler: handleErrors}) )
        .pipe( pug() )
        .pipe( gulp.dest('./public/'))
        .pipe( notify("HTML compiled!") )
        .pipe( reload({stream:true}) );
})

//compiles the jade template(s) to HTML
gulp.task('compile_html', function() {
    return gulp.src('build/views/*.pug')
        .pipe( plumber({ errorHandler: handleErrors }) )
        .pipe( pug() )
        .pipe( gulp.dest('./public/html'))
        .pipe( notify("HTML compiled!") )
        .pipe( reload({stream:true}) );
});

//pug-watch needs compile_html to be a dependency for the reload to work when editing everything
gulp.task('pug-watch', ['compile_html', 'indexify'], reload);

//watch, style and reload 
gulp.task('watch', function() {

    //our the tasks used to compile styles, pug -> html and uglify JS  
    gulp.watch('./build/index.pug', ['indexify']);
    gulp.watch('./build/views/*.pug', ['compile_html']);
    gulp.watch('./build/styles/*.styl', ['styles']);
    gulp.watch('./build/js/*.js', ['minify']);

    //reload when these files have compiled & changed
    gulp.watch('./public/**/*.html', reload);
    gulp.watch('./public/*.html', reload);
    gulp.watch('./public/css/*.css', reload);
    gulp.watch('./public/scripts/*.js', reload);

});

//minify our js
gulp.task('minify', function(){

    return gulp.src('build/js/*.js')
        .pipe(plumber({ errorHandler: handleErrors }))
        .pipe( uglify() )
        .pipe( gulp.dest('public/js') )
        .pipe( reload({stream:true}) );
});

//default task runs on gulp - run styles, open up browsersync and watch our files
gulp.task('default', ['styles', 'minify','browserSync', 'compile_html', 'indexify', 'watch'])

