/**
 * Created by Rodey on 2015/11/5.
 */

var fs = require('fs'),
    path = require('path'),
    through2 = require('through2'),
    PluginError = require('gulp-util').PluginError,
    mkdirp = require('mkdirp');

//获取文件内容
var getFileContent = function (file) {
    if (!fs.existsSync(file)) throw new Error('File not find: ' + file);
    var fileContent = fs.readFileSync(file, { encoding: 'utf8' });
    return fileContent;
};

var getContent = function (file, options) {
    var fileContents = file.contents.toString('utf8');
    if (typeof fileContents === 'undefined') {
        fileContents = getFileContent(file.path);
    }
    return fileContents;
};
function getPaths(filename, routes, destPath) {
    var paths = [];
    if (Array.isArray(routes[filename])) {
        var paths = routes[filename].map(function (item, index) {
            return path.join(destPath, item);
        })
    } else if (typeof routes[filename] === 'string') {
        paths.push(path.join(destPath, routes[filename]));
    }
    return paths;
}
//将压缩后的内容替换到html中
var desto = function (options) {
    var options = options || {},
        destPath = options.dest || '',
        routes = options.routes || {};
    var PLUGIN_NAME = 'gulp-route-dest';

    if (typeof options === 'string') destPath = options;

    return through2.obj(function (file, enc, next) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Stream content is not supported'));
            return next(null, file);
        }
        if (file.isBuffer()) {
            try {
                var content = getContent(file, options);
                var paths = getPaths(file.relative, routes, destPath);
                if (paths.length == 0) paths = getPaths('*', routes, destPath);
                if (paths.length == 0) paths.push(destPath);
                file.contents = new Buffer(content);
                paths.forEach(function (p) {
                    mkdirp(p, function (e) {
                        if (e) console.log(e);
                        fs.writeFile(path.join(p, file.relative), file.contents, function (e) {
                            if (e) console.log(e);
                            console.log('write file', file.relative, 'to', p)
                        });
                    });
                })

            }
            catch (err) {
                console.log(err)
                this.emit('error', new PluginError(PLUGIN_NAME, err));
            }
        }
        this.push(file);
        return next();


    });

};

module.exports = desto;