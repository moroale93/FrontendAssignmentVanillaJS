var DomElementUtil = require("../services/DomElementUtil");
var ApiRequester = require("../services/ApiRequester");
var ObjectUtil = require("../services/ObjectUtil");

function initializeMap(lon, lat) {
    console.log(lon, lat);
    var map = new OpenLayers.Map("map");
    map.addLayer(new OpenLayers.Layer.OSM());
    // create layer switcher widget in top right corner of map.
    var layer_switcher = new OpenLayers.Control.LayerSwitcher({});
    map.addControl(layer_switcher);
    //Set start centrepoint and zoom
    var lonLat = new OpenLayers.LonLat(lon, lat)
        .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            map.getProjectionObject() // to Spherical Mercator Projection
        );
    var zoom = 15;
    map.setCenter(lonLat, zoom);
};

//this is the component that will create the comment detail
function UDataDetail(commentData) {
    this._rootElement = null;
    this._commentData = commentData;
    var self = this;

    function getLabelsElement(commentData) {
        var ret = DomElementUtil.createElement("div", {"class": "labels-wrapper"});
        if (commentData.labels) {
            commentData.labels.forEach(function (label) {
                ret.appendChild(DomElementUtil.createElement("div", {"class": "label"}, document.createTextNode(label)));
            });
        }
        return ret;
    }

    function getTagsElement(commentData) {
        var ret = DomElementUtil.createElement("div");
        commentData.tags.forEach(function (tag) {
            var isPositive = ["attractive", "usable", "interesting"].indexOf(tag) !== -1;
            ret.appendChild(DomElementUtil.createElement("div", {"class": "tag to-right" + (isPositive ? " positive" : " negative")}, document.createTextNode(tag)));
        });
        ret.appendChild(DomElementUtil.createElement("div", {"class": "clear-float"}));
        return ret;
    }

    function getCommentInfoSectionElement(commentData) {
        var ret = DomElementUtil.createElement("div", {"class": "section-primary"});
        var content = DomElementUtil.createElement("div", {"class": "section-content"});
        ret.appendChild(content);
        var customSubject = ObjectUtil.getValue(commentData, "custom.subject");
        var creationDate = (new Date(commentData.creation_date)).toLocaleDateString();
        var title = (customSubject !== null ? customSubject + " - " : "") + creationDate;
        content.appendChild(DomElementUtil.createElement("h3", null, document.createTextNode(title)));
        content.appendChild(DomElementUtil.createElement("p", null, document.createTextNode(commentData.comment)));
        if (commentData.url) {
            var siteButton = DomElementUtil.createElement("a", {
                "class": "action-button with-icon secondary to-right",
                "target": "_blank",
                "href": commentData.url
            });
            siteButton.innerHTML = "<svg width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M14 4h-13v18h20v-11h1v12h-22v-20h14v1zm10 5h-1v-6.293l-11.646 11.647-.708-.708 11.647-11.646h-6.293v-1h8v8z\"/></svg>";
            siteButton.appendChild(document.createTextNode("Go to the site"));
            content.appendChild(siteButton);
        }
        if (commentData.email) {
            var emailButton = DomElementUtil.createElement("a", {
                "class": "action-button with-icon secondary to-right",
                "href": "mailto:" + commentData.email
            });
            emailButton.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M24 21h-24v-18h24v18zm-23-16.477v15.477h22v-15.477l-10.999 10-11.001-10zm21.089-.523h-20.176l10.088 9.171 10.088-9.171z\"/></svg>";
            emailButton.appendChild(document.createTextNode("Contact the user"));
            content.appendChild(emailButton);
        }
        content.appendChild(DomElementUtil.createElement("div", {"class": "clear-float"}));
        return ret;
    }

    function getLocationSectionElement(commentData) {
        var ret = DomElementUtil.createElement("div", {"class": "background-section"});
        ret.appendChild(DomElementUtil.createElement("div", {
            "id": "map"
        }));
        var content = DomElementUtil.createElement("div", {"class": "background-section-content"});
        content.appendChild(DomElementUtil.createElement("h3", null, document.createTextNode("Location")));
        var contentCenter = DomElementUtil.createElement("div", {"class": "center-content"});
        contentCenter.appendChild(DomElementUtil.createElement("h1", null, document.createTextNode(commentData.geo.city ? commentData.geo.city : "City not specified")));
        contentCenter.appendChild(DomElementUtil.createElement("img", {"src": "https://countryflags.io/" + commentData.geo.country + "/flat/64.png"}));
        content.appendChild(contentCenter);
        ret.appendChild(content);
        return ret;
    }

    function getBrowserInfoSectionElement(commentData) {
        var ret = DomElementUtil.createElement("div");
        ret.appendChild(DomElementUtil.createElement("h3", null, document.createTextNode("Browser & device info")));
        var content = DomElementUtil.createElement("div", {"class": "center-content"});
        ret.appendChild(content);
        content.appendChild(DomElementUtil.createElement("h1", null, document.createTextNode(commentData.computed_browser.FullBrowser)));
        content.appendChild(DomElementUtil.createElement("h2", null, document.createTextNode("for " + commentData.computed_browser.Platform)));
        content.appendChild(DomElementUtil.createElement("h4", null, document.createTextNode("Version" + commentData.computed_browser.Version)));
        content.appendChild(DomElementUtil.createElement("h5", null, document.createTextNode(commentData.screen.width + "x" + commentData.screen.height)));
        return ret;
    }

    function getImagesSectionElement(commentData) {
        var ret = DomElementUtil.createElement("div", {"class": "section-primary dark"});
        var content = DomElementUtil.createElement("div", {"class": "section-content"});
        ret.appendChild(content);
        var grid = DomElementUtil.createElement("div", {"class": "image-grid"});
        content.appendChild(grid);
        var row = DomElementUtil.createElement("div", {"class": "image-grid-row"});
        grid.appendChild(row);
        var firstCol = DomElementUtil.createElement("div", {"class": "image-grid-column"});
        row.appendChild(firstCol);
        var secondCol = DomElementUtil.createElement("div", {"class": "image-grid-column"});
        row.appendChild(secondCol);
        ApiRequester.getCats(Object.keys(commentData.images).length).then(function (cats) {
            cats.forEach(function (cat, index) {
                var cell = DomElementUtil.createElement("div", {"class": "polaroid"});
                cell.appendChild(DomElementUtil.createElement("img", {src: cat.url}));
                var imageKey = Object.keys(commentData.images)[index];
                cell.appendChild(DomElementUtil.createElement("div", {
                        "class": "polaroid-title"
                    },
                    document.createTextNode(imageKey)));
                cell.appendChild(DomElementUtil.createElement("div", {
                        "class": "polaroid-subtitle"
                    },
                    document.createTextNode(commentData.images[imageKey].width + "x" + commentData.images[imageKey].height)));
                var scrollView = DomElementUtil.createElement("div", {"class": "scrolling-view"}, DomElementUtil.createElement("a", {
                    "target": "_blank",
                    "href": commentData.images[imageKey].url
                }, DomElementUtil.createElement("span", null, document.createTextNode("view"))));
                cell.appendChild(scrollView);
                cell.addEventListener("mouseover", function () {
                    scrollView.setAttribute("class", scrollView.getAttribute("class").replace(/\sactive/, "") + " active")
                });
                cell.addEventListener("mouseleave", function () {
                    scrollView.setAttribute("class", scrollView.getAttribute("class").replace(/\sactive/, ""))
                });
                if (index % 2) {
                    firstCol.appendChild(cell);
                } else {
                    secondCol.appendChild(cell);
                }
            });
        });
        return ret;
    }

    this._init = function () {
        console.log(this._commentData);
        this._rootElement = DomElementUtil.createElement("div"); // TODO check the tags
        this._rootElement.appendChild(getLabelsElement(this._commentData));
        this._rootElement.appendChild(getTagsElement(this._commentData));
        this._rootElement.appendChild(getCommentInfoSectionElement(this._commentData));
        this._rootElement.appendChild(getLocationSectionElement(this._commentData));
        this._rootElement.appendChild(getBrowserInfoSectionElement(this._commentData));
        this._rootElement.appendChild(getImagesSectionElement(this._commentData));
    };

    //This return the comment detail dom element
    this.getHtmlElement = function () {
        return self._rootElement;
    };

    /*On render callback I need to initialize the OL map*/
    this.onRenderCallback = function () {
        if (self._commentData.geo && self._commentData.geo.lon !== null && self._commentData.geo.lat !== null) {
            initializeMap(self._commentData.geo.lon, self._commentData.geo.lat);
        } else {
            initializeMap(0, 0);
        }
    };

    this._init();
}

module.exports = UDataDetail;
