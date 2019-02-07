var USearchInput = require("../components/USearchInput");
var URatingFilter = require("../components/URatingFilter");
var UDataDetail = require("../components/UDataDetail");
var UToggleButton = require("../components/UToggleButton");
var UModal = require("../components/UModal");
var URatingChart = require("../components/URatingChart");
var UTable = require("../components/UTable");
var DomElementUtil = require("../services/DomElementUtil");
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
    //the table values
    this._tableData = [];
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
            var starHtml = "<span class='svg-icon-wrapper star " + (rowData.starred ? "active" : "") + "'></span>";
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

    this.init = function (tableWrapperElement, ratingsFilterWrapper, searchBarWrapperElement, actionButtonsWrapper) {
        this._searchInput = new USearchInput(searchBarWrapperElement, this._onSearchInputChange);
        this._searchInput.render();
        this._filters.search = this._searchInput.getFilter();
        this._ratingFilter = new URatingFilter(ratingsFilterWrapper, RATING_FILTER_CONFIG, this._onRatingFilterChange);
        this._ratingFilter.render();
        this._filters.ratings = this._ratingFilter.getFilter();
        this._table = new UTable(tableWrapperElement, TABLE_OPTIONS);
        this._table.render();
        var buttonRatingsChart = DomElementUtil.createElement("div", {"class": "icon-button"});
        buttonRatingsChart.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 1000 1000\" enable-background=\"new 0 0 1000 1000\" xml:space=\"preserve\"><g><path d=\"M951.7,821.6H48.3c-21.1,0-38.3,17.1-38.3,38.3v15.3c0,21.1,17.1,38.3,38.3,38.3h903.4c21.1,0,38.3-17.1,38.3-38.3v-15.3C990,838.7,972.9,821.6,951.7,821.6z M714.4,775.6h91.9c25.4,0,45.9-20.6,45.9-45.9V316.3c0-25.4-20.6-45.9-45.9-45.9h-91.9c-25.4,0-45.9,20.6-45.9,45.9v413.4C668.4,755.1,689,775.6,714.4,775.6z M454.1,775.6h91.9c25.4,0,45.9-20.6,45.9-45.9V132.5c0-25.4-20.6-45.9-45.9-45.9h-91.9c-25.4,0-45.9,20.6-45.9,45.9v597.2C408.1,755.1,428.7,775.6,454.1,775.6z M193.8,775.6h91.9c25.4,0,45.9-20.6,45.9-45.9V545.9c0-25.4-20.6-45.9-45.9-45.9h-91.9c-25.4,0-45.9,20.6-45.9,45.9v183.8C147.8,755.1,168.4,775.6,193.8,775.6z\"></path></g></svg>";
        buttonRatingsChart.addEventListener("click", this._onRatingChartClick);
        actionButtonsWrapper.appendChild(buttonRatingsChart);
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

    /*when the rating chart button will be clicked will be show a modal with the chart */
    this._onRatingChartClick = function () {
        var ratingChart = new URatingChart("ratingChart");
        var modal = new UModal("Ratings chart", ratingChart.getHtmlElement());
        modal.open();
        ratingChart.updateChart(self._tableData);
    };

    /*To update the table I need to request the new filtered data and I will send them to the the table component*/
    this._updateTable = function () {
        var idRequest = new Date().getTime();
        self._idLastRequest = idRequest;
        ApiRequester.getComments(this._filters).then(function (resp) {
            //with an asynchronous request this will ensure that the response used match with the last request done
            if (idRequest === self._idLastRequest) {
                console.debug("updated table data", resp);
                self._tableData = resp.items;
                self._table.updateData(self._tableData);
            }
        });
    }
}

module.exports = TableController;
