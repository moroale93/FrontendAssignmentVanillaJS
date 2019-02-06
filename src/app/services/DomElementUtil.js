var DomElementUtil = function () {
};

/*This will return an element of type , attributes and child node specified. Only the first arg is required*/
DomElementUtil.createElement = function (type, attributes, childNode) {
    var ret = document.createElement(type);
    if (attributes) {
        Object.keys(attributes).forEach(function (key) {
            ret.setAttribute(key, attributes[key]);
        });
    }
    if (childNode) {
        ret.appendChild(childNode);
    }
    return ret;
};

module.exports = DomElementUtil;
