var ObjectUtil = require("../services/ObjectUtil");
var DomElementUtil = require("../services/DomElementUtil");

function UTable(element, tableOptions) {
    //the parent dom element of the table (where will be contained)
    this._parentElement = element;
    //table dom element
    this._tableElement = null;
    //table header dom element
    this._headerElement = null;
    //the row values
    this._data = [];
    //the table's configuration object
    this._tableOptions = tableOptions;
    var self = this;

    //this will create the table header
    this._renderHeader = function () {
        if (self._headerElement) {
            self._headerElement.remove();
        }
        self._headerElement = document.createElement("div");
        self._headerElement.setAttribute("class", "u-table-row u-table-header");
        self._tableOptions.columns.forEach(function (column) {
            var columnElement = document.createElement("div");
            columnElement.setAttribute("class", "u-table-cell");
            columnElement.appendChild(document.createTextNode(column.title));
            self._headerElement.appendChild(columnElement);
        });
        this._tableElement.insertBefore(this._headerElement, this._tableElement.firstChild);
    };

    //this will create the table body
    this._renderBody = function () {
        self._tableElement.querySelectorAll(".u-table-row.u-table-body").forEach(function (node) {
            node.remove();
        });
        self._data.forEach(function (data) {
            var row = DomElementUtil.createElement("div", {class: "u-table-row u-table-body"});
            //If the rows are clickable I will set the row's click events listener
            if (self._tableOptions.hasOwnProperty("onRowClick") && typeof self._tableOptions.onRowClick === 'function') {
                row.addEventListener("click", function (event) {
                    self._tableOptions.onRowClick(data, event);
                });
                row.setAttribute("class", row.getAttribute("class") + " clickable");
            }
            //I will render each column in the configuration
            self._tableOptions.columns.forEach(function (column) {
                var columnElement = DomElementUtil.createElement("div", {class: "u-table-cell"});
                var child = null;
                //If is a custom column I render it else I set the simple text
                if (typeof column.getCustomTemplate === "function") {
                    child = column.getCustomTemplate(data);
                } else {
                    child = document.createTextNode(ObjectUtil.getValue(data, column.field));
                }
                var cellContentWrapperElement = DomElementUtil.createElement("div", {class: "u-table-cell-content-wrapper"});
                cellContentWrapperElement.appendChild(DomElementUtil.createElement("div", {class: "u-table-cell-label"}, document.createTextNode(column.title)));
                cellContentWrapperElement.appendChild(child);
                columnElement.appendChild(cellContentWrapperElement);
                row.appendChild(columnElement);
            });
            self._tableElement.appendChild(row);
        });
    };

    this.render = function () {
        this._tableElement = DomElementUtil.createElement("div", {class: "u-table"});
        this._parentElement.appendChild(this._tableElement);
        this._renderHeader();
        this._renderBody();
    };

    //On update I will save the data and render the new body
    this.updateData = function (newData) {
        self._data = newData;
        this._renderBody();
    };
}

module.exports = UTable;
