/*This is a singleton object that will manage a simple cache store*/

function CacheService() {
    this.cacheMap = {};

    this.setData = function (key, data) {
        var toInsert = data;
        if (typeof toInsert === "object") {
            toInsert = JSON.parse(JSON.stringify(toInsert));
        }
        this.cacheMap[key] = toInsert;
    };

    this.getData = function (key) {
        return this.cacheMap[key];
    };
}

var CacheServiceSingleton = (function () {
    var instance;

    function createInstance() {
        return new CacheService();
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

module.exports = CacheServiceSingleton;
