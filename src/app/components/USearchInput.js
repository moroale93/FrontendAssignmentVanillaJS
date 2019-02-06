var DomElementUtil = require("../services/DomElementUtil");

/*This component is a search filter that will nofity back the change.*/
function USearchInput(element, searchCallback) {
    //the parent dom element of the filter (where will be contained)
    this._parentElement = element;
    //input dom element
    this._inputElement = null;
    //the callback for the change events
    this._searchCallback = searchCallback;
    this.value = "";
    var self = this;

    this.render = function () {
        this._inputElement = DomElementUtil.createElement("input", {class: "u-search-bar"});
        this._inputElement.setAttribute("placeholder", "Search here...");
        this._inputElement.setAttribute("type", "text");
        this._inputElement.addEventListener("keyup", function () {
            self.value = this.value;
            self._searchCallback(self.getFilter());
        });
        this._parentElement.appendChild(this._inputElement);
    };

    this.getFilter = function () {
        return self.value;
    };
}

module.exports = USearchInput;
