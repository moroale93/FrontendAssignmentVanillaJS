var USearchInput = require("../components/USearchInput");
var URatingFilter = require("../components/URatingFilter");
var UDataDetail = require("../components/UDataDetail");
var UToggleButton = require("../components/UToggleButton");
var UModal = require("../components/UModal");
var UTable = require("../components/UTable");
var ApiRequester = require("../services/ApiRequester");

/*This controller will controll all the table logics. For example the filters interactions, the row detail user request and the table updates*/
function TableController() {
    //the search filter component
    this._searchInput = null;
    //the rating filter component
    this._ratingFilter = null;
    //the table component
    this._table = null;
    //the table filters values
    this._filters = {search: "", ratings: []};
    //this an id to save the last request done (prevent async request bugs)
    this._idLastRequest = null;
    //this is the table configuration to pass to the uTable component
    var TABLE_OPTIONS = {
        columns: [
            {
                title: "Rating",
                getCustomTemplate: function (rowData) {
                    var button = new UToggleButton(null, {text: rowData.rating, active: true, toggleable: false});
                    return button.getHtmlElement();
                }
            }, {
                title: "Comment",
                field: "comment"
            }, {
                title: "Browser",
                getCustomTemplate: function (rowData) {
                    var ret = document.createElement("div");
                    var browser = document.createElement("div");
                    browser.appendChild(document.createTextNode(rowData.computed_browser.Browser));
                    var version = document.createElement("div");
                    version.setAttribute("class", "secondary-text");
                    version.appendChild(document.createTextNode(rowData.computed_browser.Version));
                    ret.appendChild(browser);
                    ret.appendChild(version);
                    return ret;
                }
            }, {
                title: "Device",
                field: "computed_browser.Platform"
            }, {
                title: "Platform",
                field: "computed_browser.Platform"
            }
        ],
        onRowClick: function (rowData, event) {
            var statusString = rowData.status === "new" ? "You have never seen this comment" : "You have already read this comment";
            var statusHtml = "<h6> (" + statusString + ")</h6>";
            var starHtml = rowData.starred ? "<span class='svg-icon-wrapper star'></span>" : "";
            var content = new UDataDetail(rowData);
            var modal = new UModal("Comment details " + starHtml + statusHtml, content.getHtmlElement());
            modal.open();
            content.onRenderCallback();
        }
    };
    var RATING_FILTER_CONFIG = [
        {value: 1, active: true, text: "1", toggleable: true},
        {value: 2, active: true, text: "2", toggleable: true},
        {value: 3, active: true, text: "3", toggleable: true},
        {value: 4, active: true, text: "4", toggleable: true},
        {value: 5, active: true, text: "5", toggleable: true}
    ];

    var self = this;

    this.init = function (tableWrapperElement, ratingsFilterWrapper, searchBarWrapperElement) {
        this._searchInput = new USearchInput(searchBarWrapperElement, this._onSearchInputChange);
        this._searchInput.render();
        this._filters.search = this._searchInput.getFilter();
        this._ratingFilter = new URatingFilter(ratingsFilterWrapper, RATING_FILTER_CONFIG, this._onRatingFilterChange);
        this._ratingFilter.render();
        this._filters.ratings = this._ratingFilter.getFilter();
        this._table = new UTable(tableWrapperElement, TABLE_OPTIONS);
        this._table.render();
        this._updateTable();
    };

    /*when the search filter will change I need to update the local filter values and update the table values */
    this._onSearchInputChange = function (val) {
        console.debug("Changed search", val);
        self._filters.search = val;
        self._updateTable();
    };

    /*when the rating filter will change I need to update the local filter values and update the table values */
    this._onRatingFilterChange = function (vals) {
        console.debug("Changed filter", vals);
        self._filters.ratings = vals;
        self._updateTable();
    };

    /*To update the table I need to request the new filtered data and I will send them to the the table component*/
    this._updateTable = function () {
        var idRequest = new Date().getTime();
        self._idLastRequest = idRequest;
        ApiRequester.getComments(this._filters).then(function (resp) {
            //with an asynchronous request this will ensure that the response used match with the last request done
            if (idRequest === self._idLastRequest) {
                console.debug("updated table data", resp);
                self._table.updateData(resp.items);
            }
        });
    }
}

module.exports = TableController;
