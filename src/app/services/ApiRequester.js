var CacheService = require("./CacheService");
var SERVICE_CACHE_KEYS = {
    getComments: "GET_COMMENTS"
};

function ApiRequester() {
}

/*
* this method will fetch all the comments from a file and will cache the response to reuse it later
* This one will filter the list by a comment string or a list of ratings
* in: { search: string , ratings: int[] }
* */
ApiRequester.getComments = function (filters) {
    return new Promise(function (resolve, reject) {
        var cachedData = CacheService.getInstance().getData(SERVICE_CACHE_KEYS.getComments);
        var promise = null;
        if (cachedData) {
            promise = new Promise(function (resolve) {
                resolve(cachedData);
            });
        } else {
            //TODO: CORS problems with https://static.usabilla.com/recruitment/apidemo.json
            promise = fetch('/src/assets/apidemo.json')
                .then(function (response) {
                    return new Promise(function (resolve, reject) {
                        response.json().then(function (jsonResponse) {
                            CacheService.getInstance().setData(SERVICE_CACHE_KEYS.getComments, jsonResponse);
                            resolve(new Promise(function (resolve) {
                                resolve(jsonResponse);
                            }));
                        }).catch(reject)
                    });
                });
        }
        promise.then(function (jsonResponse) {
            var ret = JSON.parse(JSON.stringify(jsonResponse));
            if (filters) {
                ret.items = ret.items.filter(function (item) {
                    var ratingFilterValue = true, searchFilterValue = true;
                    if (filters.ratings !== undefined) {
                        ratingFilterValue = filters.ratings.indexOf(item.rating) !== -1;
                    }
                    if (filters.search !== undefined) {
                        searchFilterValue = item.comment.toUpperCase().includes(filters.search.toUpperCase());
                    }
                    return ratingFilterValue && searchFilterValue;
                });
            }
            return ret;
        }).then(resolve).catch(reject);
    });
};

/*this methods return a random list of @par(size) cats images*/
ApiRequester.getCats = function (size) {
    return fetch('https://api.thecatapi.com/v1/images/search?limit=' + size).then(function (response) {
        return response.json();
    });
};

module.exports = ApiRequester;
