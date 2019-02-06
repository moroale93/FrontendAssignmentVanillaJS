var assert = require('assert');
var ObjectUtil = require('../src/app/services/ObjectUtil');
var testObject = {
    "first": {
        "second": {
            "third": "correct value"
        }
    }
};

describe('ObjectUtil', function () {
    describe('getValue', function () {

        it('should return the correct value of an existing nested path in the object', function () {
            assert.equal(ObjectUtil.getValue(testObject, "first.second.third"), "correct value");
        });

        it('should return null when the nested path doesn\'t exists in the object', function () {
            assert.equal(ObjectUtil.getValue(testObject, "third.second.first"), null);
        });
    });
});
