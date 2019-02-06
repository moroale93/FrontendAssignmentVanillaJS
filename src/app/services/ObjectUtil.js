/*This is an object like lodash */

var ObjectUtil = function () {
};

var PathNotFoundException = function () {
};

/*This method accept an object and a dotted path and will return the value at the specified path*/
ObjectUtil.getValue = function (obj, path) {
    var pathSplit = path.split(".");
    var ret = Object.assign({}, obj);
    try {
        pathSplit.forEach(function (path) {
            if (!ret.hasOwnProperty(path)) {
                throw new PathNotFoundException();
            }
            ret = ret[path];
        });
    } catch (PathNotFoundException) {
        return null;
    }
    return ret;
};

module.exports = ObjectUtil;
