var UToggleButton = require("./UToggleButton");

//this is the rating filter. Its composed by n UToggleButton
function URatingFilter(element, configValues, changeCallback) {
    this._parentElement = element;
    this._ratingBtns = [];
    this._changeCallback = changeCallback;
    this._values = configValues; //[{value: any, active: boolean, text: string, toggleable: boolean}]
    var self = this;

    this.render = function () {
        this._values.forEach(function (value) {
            var tmpElem = new UToggleButton(self._parentElement, value, self._onRatingChange);
            self._ratingBtns.push(tmpElem);
            tmpElem.render();
        });
    };

    this.getFilter = function () {
        return self._values.filter(function (value) {
            return value.active;
        }).map(function (value) {
            return value.value;
        });
    };

    this._onRatingChange = function (value) {
        self._values[value.value - 1] = value;
        self._changeCallback(self.getFilter());
    };
}

module.exports = URatingFilter;
