var DomElementUtil = require("../services/DomElementUtil");

/*This is a modal component*/
function UModal(titleHtml, contentElement) {
    //is the element to put in body of the modal
    this._contentElement = contentElement;
    //this is the HTML string in the header of the modal
    this._titleHtml = titleHtml;
    //the modal dom element
    this._modalElement = null;
    var self = this;

    //this will open the modal
    this.open = function () {
        document.querySelector("body").appendChild(self._modalElement);
    };

    //this will close the modal
    this.close = function () {
        self._modalElement.remove();
        document.removeEventListener("keyup", eventFunctionOnEsc);
    };

    this._init = function () {
        this._modalElement = DomElementUtil.createElement("div", {class: "u-modal-wrapper"});
        var overlayElement = DomElementUtil.createElement("div", {class: "u-modal-backdrop"});
        this._modalElement.appendChild(overlayElement);
        var modalWrapperElement = DomElementUtil.createElement("div", {class: "u-modal"});
        var modalHeaderElement = DomElementUtil.createElement("div", {class: "u-modal-header"});
        modalHeaderElement.innerHTML = self._titleHtml;
        var closeButtonElement = DomElementUtil.createElement("button", {class: "close"});
        closeButtonElement.appendChild(document.createTextNode("X"));
        modalHeaderElement.appendChild(closeButtonElement);
        modalWrapperElement.appendChild(modalHeaderElement);
        var modalBodyElement = DomElementUtil.createElement("div", {class: "u-modal-body"});
        if (this._contentElement) {
            modalBodyElement.appendChild(this._contentElement);
        }
        modalWrapperElement.appendChild(modalBodyElement);
        this._modalElement.appendChild(modalWrapperElement);

        //setup the close events
        overlayElement.addEventListener("click", self.close.bind(this));
        closeButtonElement.addEventListener("click", self.close.bind(this));
        document.addEventListener("keyup", eventFunctionOnEsc);
    };

    function eventFunctionOnEsc(event) {
        if (event.key === "Escape") {
            self.close.call(this);
        }
    };

    this._init();
}

module.exports = UModal;
