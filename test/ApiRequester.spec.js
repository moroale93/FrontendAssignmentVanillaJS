global.fetch = require("jest-fetch-mock");
var ApiRequester = require("../src/app/services/ApiRequester");

describe('ApiRequester', function () {
    describe('getComments', function () {

        beforeEach(function () {
            fetch.resetMocks();
            fetch.mockResponseOnce(JSON.stringify({
                "items": [
                    {
                        "comment": "first comment",
                        "computed_browser": {
                            "Browser": "Chrome",
                            "Version": "32.0",
                            "Platform": "MacOSX",
                            "FullBrowser": "Chrome"
                        },
                        "rating": 1,
                        "id": "52efc552b6679cfe6ede406c",
                        "starred": false
                    }, {
                        "comment": "second comment",
                        "computed_browser": {
                            "Browser": "Chrome",
                            "Version": "32.0",
                            "Platform": "MacOSX",
                            "FullBrowser": "Chrome"
                        },
                        "rating": 2,
                        "id": "52efc552b6679cfe6ede406c",
                        "starred": false
                    }, {
                        "comment": "third comment",
                        "computed_browser": {
                            "Browser": "Chrome",
                            "Version": "32.0",
                            "Platform": "MacOSX",
                            "FullBrowser": "Chrome"
                        },
                        "rating": 3,
                        "id": "52efc552b6679cfe6ede406c",
                        "starred": false
                    }, {
                        "comment": "fourth comment",
                        "computed_browser": {
                            "Browser": "Chrome",
                            "Version": "32.0",
                            "Platform": "MacOSX",
                            "FullBrowser": "Chrome"
                        },
                        "rating": 4,
                        "id": "52efc552b6679cfe6ede406c",
                        "starred": false
                    }, {
                        "comment": "fifth comment",
                        "computed_browser": {
                            "Browser": "Chrome",
                            "Version": "32.0",
                            "Platform": "MacOSX",
                            "FullBrowser": "Chrome"
                        },
                        "rating": 5,
                        "id": "52efc552b6679cfe6ede406c",
                        "starred": false
                    }
                ],
                "count": 4347,
                "count_nolimit": 4347,
                "total": 4347
            }));
        });

        it('should return an empty array when an empty array of filter is passed', function (done) {
            ApiRequester.getComments({ratings: []}).then(function (resp) {
                if (resp.items.length === 0) {
                    done();
                } else {
                    done({message: "There are " + resp.items.length + " item in the response"});
                }
            }).catch(done);
        });

        it('should return an array with only the correct ratings', function (done) {
            ApiRequester.getComments({ratings: [1]}).then(function (resp) {
                if (resp.items.length === 1 && resp.items[0].rating === 1) {
                    done();
                } else {
                    done({message: "There are " + resp.items.length + " item in the response and the response is: " + JSON.stringify(resp.items)});
                }
            }).catch(done);
        });

        it('should return an empty array when an impossible search filter is passed', function (done) {
            ApiRequester.getComments({search: "rgergergerger"}).then(function (resp) {
                if (resp.items.length === 0) {
                    done();
                } else {
                    done({message: "There are " + resp.items.length + " item in the response"});
                }
            }).catch(done);
        });

        it('should return an array with only the correct filtered comment texts', function (done) {
            ApiRequester.getComments({search: "rst com"}).then(function (resp) {
                if (resp.items.length === 1 && resp.items[0].comment === "first comment") {
                    done();
                } else {
                    done({message: "There are " + resp.items.length + " item in the response and the response is: " + JSON.stringify(resp.items)});
                }
            }).catch(done);
        });

        it('should return an array with only the correct filtered comment texts and ratings', function (done) {
            ApiRequester.getComments({search: "rst com", ratings: [1]}).then(function (resp) {
                if (resp.items.length === 1 && resp.items[0].comment === "first comment" && resp.items[0].rating === 1) {
                    done();
                } else {
                    done({message: "There are " + resp.items.length + " item in the response and the response is: " + JSON.stringify(resp.items)});
                }
            }).catch(done);
        });

        it('should return an empty array when i pass an impossible filters combination', function (done) {
            ApiRequester.getComments({search: "rst com", ratings: [2]}).then(function (resp) {
                if (resp.items.length === 0) {
                    done();
                } else {
                    done({message: "There are " + resp.items.length + " item in the response and the response is: " + JSON.stringify(resp.items)});
                }
            }).catch(done);
        });
    });
});
