var DomElementUtil = require("../services/DomElementUtil");

//this is the component that will create the comment detail
function URatingChart(chartId) {
    this._chartId = chartId;
    this._canvasElement = null;
    var self = this;

    this.updateChart = function (commentsData) {
        var data = [0, 0, 0, 0, 0];
        commentsData.forEach(function (comment) {
            data[comment.rating - 1]++;
        });
        var barChartData = {
            labels: ['Rating 1', 'Rating 2', 'Rating 3', 'Rating 4', 'Rating 5'],
            datasets: [{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderColor: "rgb(255, 255, 255)",
                borderWidth: 1,
                data: data
            }]

        };

        var ctx = document.getElementById(self._chartId);
        new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                responsive: true,
                legend: {
                    display: false,
                },
                title: {
                    display: false
                },
                scaleLabel:{
                    fontColor: "rgb(255, 255, 255)"
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: "rgb(255, 255, 255)"
                        },
                        gridLines: {
                            color: "rgb(255, 255, 255)"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: "rgb(255, 255, 255)"
                        },gridLines: {
                            color: "rgb(255, 255, 255)"
                        }
                    }]
                }
            }
        });
    };

    this._init = function () {
        this._canvasElement = DomElementUtil.createElement("div", {"class": "section-primary"});
        var content = DomElementUtil.createElement("div", {"class": "section-content"});
        content.appendChild(DomElementUtil.createElement("canvas", {"class": "chart", id: self._chartId}));
        this._canvasElement.appendChild(content);
    };


    //This return the comment detail dom element
    this.getHtmlElement = function () {
        return self._canvasElement;
    };

    this._init();
}

module.exports = URatingChart;
