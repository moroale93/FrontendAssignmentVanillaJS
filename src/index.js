'use strict';
require('./styles/index.scss');
var TableController = require('./app/controllers/tableController.js');

var controller = new TableController();
controller.init(document.querySelector(".u-table-wrapper"), document.querySelector(".u-ratings-wrapper"), document.querySelector(".u-search-bar-wrapper"));
