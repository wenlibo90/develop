// 获取 gulp
var gulp = require('gulp');

// 获取 uglify 模块（用于压缩 JS）
var uglify = require('gulp-uglify');
var cssUglify = require('gulp-minify-css');
var imageMin = require('gulp-imagemin');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var imageminOptipng = require('imagemin-optipng');
var htmlmin = require('gulp-htmlmin');

// 压缩 js 文件
// 在命令行使用 gulp script 启动此任务
gulp.task('script', function() {
    // 1. 找到文件
    gulp.src('js/*.js')
    // 2. 压缩文件
            .pipe(uglify({ mangle: false }))
            // 3. 另存压缩后的文件
            .pipe(gulp.dest('js'))
})
//文件自动编译
gulp.task('auto',function(){
    gulp.watch('js/!*.js',['script']);
    gulp.watch('css/!*.css', ['css']);
    gulp.watch('images/!*.*', ['images'])
})

gulp.task('cssU',function(){
    gulp.src('css/*.*')
            .pipe(cssUglify())
            .pipe(gulp.dest('css'))
})

gulp.task('image', function () {
    var jpgmin = imageminJpegRecompress({
                accurate: true,//高精度模式
                quality: "low",//图像质量:low, medium, high and veryhigh;
                method: "smallfry",//网格优化:mpe, ssim, ms-ssim and smallfry;
                min: 6,//最低质量
                loops: 6,//循环尝试次数, 默认为6;
                progressive: false,//基线优化
                subsample: "default"//子采样:default, disable;
            }),
            pngmin = imageminOptipng({
                optimizationLevel: 7
            });
    gulp.src("img/*.*")
            .pipe(imageMin({
                use: [jpgmin, pngmin]
            }))
            .pipe(gulp.dest('img'));
});


gulp.task('testHtmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('*.html')
            .pipe(htmlmin(options))
            .pipe(gulp.dest('dist/'));
});

//gulp.task('default',['image'])
gulp.task('default',['script','cssU','image','testHtmlmin'])
//gulp.task('default',['testHtmlmin'])