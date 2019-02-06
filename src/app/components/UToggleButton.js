var DomElementUtil = require("../services/DomElementUtil");

/*This component is an toggleable button that will nofity back the change.*/
function UToggleButton(element, value, changeCallback) {
    //the parent dom element of the button (where will be contained)
    this._parentElement = element;
    //button dom element
    this._buttonElement = null;
    //the callback for the change events
    this._changeCallback = changeCallback;
    //the button configuration.
    this._value = value; //{value:any, text: string, active:boolean, toggleable:boolean}
    var self = this;

    this._init = function () {
        this._buttonElement = DomElementUtil.createElement("div", {class: "u-circle" + (this._value.active ? " active" : "")});
        this._buttonElement.appendChild(document.createTextNode(this._value.text));
        //if the button will be togglable I set the event to change the component values
        if (this._value.toggleable) {
            this._buttonElement.setAttribute("role", "button");
            this._buttonElement.setAttribute("aria-pressed", this._value.active);
            this._buttonElement.addEventListener("click", function () {
                self._value.active = !self._value.active;
                this.setAttribute("aria-pressed", self._value.active);
                var classes = this.getAttribute("class");
                if (!classes.includes("active") && self._value.value) {
                    classes += " active"
                } else {
                    classes = classes.replace(" active", "");
                }
                this.setAttribute("class", classes);
                if (self._changeCallback) {
                    self._changeCallback(self._value);
                }
            });
        }
    };

    this.render = function () {
        if (this._parentElement) {
            this._parentElement.appendChild(this._buttonElement);
        }
    };

    this.getHtmlElement = function () {
        return self._buttonElement;
    };

    this._init();
}

module.exports = UToggleButton;
