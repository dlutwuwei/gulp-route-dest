[![NPM](https://nodei.co/npm/gulp-route-dest.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-route-dest/)

#How to use
`npm install gulp-route-dest`

Use routes to pipe files into different directory


```
var dest = require('gulp-route-dest');

//dump list.html file to test/list
gulp.task('test', function (params) {
    gulp.src(['*.html',])
        .pipe(dest({
            dest:'test',
            routes:{
                'list.html':'list/',
                'alter.html':['list','temp'],
                '*':['dist'] //or 'dist'
            }
        }));
})
```
> '*' in routes means the default directory otherwise define the file dest path.

Or you can use it the same as gulp.dest
```
//dump all files to test directory
gulp.task('test', function (params) {
    gulp.src(['*.html',])
        .pipe(dest('test'));
})
```

##options

###options.dest
the base direcotry of dest

###options.routes
the routes for divide stream to different path