var assert = require('assert');
var CacheService = require("../src/app/services/CacheService");

describe('CacheServiceSingleton', function () {
    describe('getInstance', function () {
        it('should return a singleton instance', function () {
            assert.equal(CacheService.getInstance(), CacheService.getInstance());
        });
        it('should return the same value that I stored', function () {
            var key = "cache_key";
            var value = {a: {b: 2}};
            var stringJsonValue=JSON.stringify(value);
            CacheService.getInstance().setData(key, value);
            value.a.b=3;
            assert.equal(JSON.stringify(CacheService.getInstance().getData(key)), stringJsonValue);
        });
    });
});
