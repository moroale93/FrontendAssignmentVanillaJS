'use strict';
require('./styles/index.scss');
require('chart.js');
var TableController = require('./app/controllers/tableController.js');

var controller = new TableController();
controller.init(document.querySelector(".u-table-wrapper"), document.querySelector(".u-ratings-wrapper"), document.querySelector(".u-search-bar-wrapper"), document.querySelector(".u-action-buttons-wrapper"));
