//top-level gulp stuff
var gulp = require('gulp');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber')

//css processing
var stylus = require('gulp-stylus');
var rupture = require('rupture');
var rucksack = require('gulp-rucksack');
var cssnano = require('gulp-cssnano');
var concatCSS = require('gulp-concat-css');
var nib = require('nib');

//postCSS modules
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var lost = require('lost');

//html processing
var pug = require('gulp-pug');

//js processing
var uglify = require('gulp-uglify');

//browser-sync
var browser_sync = require('browser-sync');
var reload = browser_sync.reload;

//images
var imagemin = require ('gulp-imagemin');

//from a Wes Bos 
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
             use: [nib(), rupture()]
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
gulp.task('browser_sync', function() {
    browser_sync({
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
    gulp.watch('./build/index.pug', ['compile_html']);
    gulp.watch('./build/views/*.pug', ['compile_html']);
    gulp.watch('./build/styles/*.styl', ['styles']);
    gulp.watch('./build/js/*.js', ['minify']);

    //reload when these files have compiled & changed
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

//compress those images
gulp.task('crush_imgs', function() {
    return gulp.src('build/assets/*')
    .pipe(imagemin({
            progressive: true,
        }))
    .pipe(gulp.dest('public/assets/'));
});

//default task runs on gulp - run styles, open up browsersync and watch our files
//build_baby_build is only used when you deploy a project :D
gulp.task('default', ['styles', 'minify','browser_sync', 'compile_html', 'indexify', 'watch'])
gulp.task('build_baby_build', ['styles', 'minify', 'crush_imgs', 'compile_html'])