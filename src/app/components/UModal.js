var DomElementUtil = require("../services/DomElementUtil");

/*This is a modal component*/
function UModal(titleHtml, contentElement) {
    //is the element to put in body of the modal
    this._contentElement = contentElement;
    //this is the HTML string in the header of the modal
    this._titleHtml = titleHtml;
    //the backdrop element
    this._overlayElement = null;
    //the wrapper element
    this._modalWrapperElement = null;
    //the modal dom element
    this._modalElement = null;
    var self = this;

    //this will open the modal
    this.open = function () {
        document.querySelector("body").appendChild(self._modalElement);
        setTimeout(function () {//I'm waiting for the animation
        self._modalWrapperElement.setAttribute("class", self._modalWrapperElement.getAttribute("class").replace(/\sclosed/g, ""));
        }, 10);
    };

    //this will close the modal
    this.close = function () {
        self._overlayElement.remove();
        self._modalWrapperElement.setAttribute("class", self._modalWrapperElement.getAttribute("class")+ " closed");
        document.removeEventListener("keyup", eventFunctionOnEsc);
        setTimeout(function () {//I'm waiting for the animation
            self._modalElement.remove();
        }, 300);
    };

    this._init = function () {
        this._modalElement = DomElementUtil.createElement("div", {class: "u-modal-wrapper"});
        this._overlayElement = DomElementUtil.createElement("div", {class: "u-modal-backdrop"});
        this._modalElement.appendChild(this._overlayElement);
        this._modalWrapperElement = DomElementUtil.createElement("div", {class: "u-modal closed"});
        var modalHeaderElement = DomElementUtil.createElement("div", {class: "u-modal-header"});
        modalHeaderElement.innerHTML = self._titleHtml;
        var closeButtonElement = DomElementUtil.createElement("button", {class: "close"});
        closeButtonElement.appendChild(document.createTextNode("X"));
        modalHeaderElement.appendChild(closeButtonElement);
        this._modalWrapperElement.appendChild(modalHeaderElement);
        var modalBodyElement = DomElementUtil.createElement("div", {class: "u-modal-body"});
        if (this._contentElement) {
            modalBodyElement.appendChild(this._contentElement);
        }
        this._modalWrapperElement.appendChild(modalBodyElement);
        this._modalElement.appendChild(this._modalWrapperElement);

        //setup the close events
        this._overlayElement.addEventListener("click", self.close.bind(this));
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
