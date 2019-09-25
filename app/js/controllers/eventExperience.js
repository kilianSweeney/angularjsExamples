(function () {
    'use strict';

    angular.module('eventExperienceBar', [])
        .controller('eventExperienceController', ['$scope', "APP_CONST", "authInfoService", "refreshTokenService", "$http", "OAUTH_CONSTANT", "breadcrumbs", function ($scope, APP_CONST, authInfoService, refreshTokenService, $http, OAUTH_CONSTANT, breadcrumbs) {
            $scope.breadcrumbs = breadcrumbs;
            $scope.selectedIdx = 0;
            $scope.compareChartOptions = {
                legend: {
                    display: true,
                    position: 'right',
                    fullWidth: false,
                    labels: {
                        boxWidth: 15
                    }
                }
            };

            var updateChart = function () {
                var selectedObj = $scope.raw[$scope.selectedIdx].data,
                    tmpData = [[], [], [], []],
                    tmpLabels = [],
                    tmpSeries = [];
                selectedObj.forEach(function (item) {
                    if (item.active) {
                        tmpData[0].push(item.experienceScore);
                        tmpData[1].push(item.focusScore);
                        tmpData[2].push(item.engagementScore);
                        tmpData[3].push(item.sentimentScore);
                        tmpLabels.push(item.name);
                    }
                });
                $scope.compareChartLabels = tmpLabels;
                $scope.compareChartData = tmpData;
            };

            $http.get(APP_CONST.OAUTH_SERVER + "/api/v1/analytics/roi/salessegment").then(function (response) {
                var data = response.data;

                $scope.raw = data;
                $scope.tableData = $scope.raw[$scope.selectedIdx].data;
                $scope.selectData = [];
                $scope.raw.forEach(function (e) {
                    var cat = e.data;
                    $scope.selectData.push(e);
                    cat.forEach(function (element, index) {
                        if (index < 5) {
                            element.active = true;
                        } else {
                            element.active = false;
                        }
                    });
                });
                $scope.compareBy = $scope.raw[$scope.selectedIdx];
                $scope.compareChartSeries = ['Experience', 'Focus', 'Engagement', 'Sentiment'];
                updateChart();
            }, function (response) {
                // Error handling
            });

            $scope.updateTableAndChart = function (item) {

                if (item == null) {
                    item = $scope.raw[$scope.selectedIdx];
                }
                $scope.data = item.data;
                var k = item.keyword;
                $scope.raw.forEach(function (element) {
                    if (element.keyword == k) {
                        $scope.tableData = element.data;
                    }
                });

                $scope.selectData.forEach(function (option, index) {
                    if (option == item) {
                        $scope.selectedIdx = index;
                    }
                });
                updateChart();
            };

            $scope.checkTableBox = function (value) {
                var tempValue = value.name;
                var tempData = $scope.raw;
                tempData.forEach(function (element, index) {
                    var e = element.data;

                    e.forEach(function (element, index) {
                        if (tempValue == element.name) {
                            tempValue.active = value.active;
                        }
                    });
                });

                updateChart();
            };
        }]);

    angular.module('eventExperienceLine', [])
        .controller('MainCtrl', ['$scope', "APP_CONST", "authInfoService", "refreshTokenService", "$http", "OAUTH_CONSTANT", "breadcrumbs", function ($scope, APP_CONST, authInfoService, refreshTokenService, $http, OAUTH_CONSTANT, breadcrumbs) {

            $scope.breadcrumbs = breadcrumbs;
            $scope.selectedIdx__line = 0;
            $scope.options2 = {
                chart: {
                    type: 'lineChart',
                    height: 352,
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 60,
                        left: 65
                    },
                    x: function (d) {
                        return d[0];
                    },
                    y: function (d) {
                        return d[1] * 1;
                    },
                    interpolate: 'cardinal',
                    duration: 300,
                    useInteractiveGuideline: false,
                    clipVoronoi: false,
                    xAxis: {
                        //label  axisLabel: '',
                        //the below is a function to create random dates for the x axis
                        tickFormat: function (d) {
                            return d3.time.format('%m/%d')(new Date(d))
                        },
                        showMaxMin: false,
                        staggerLabels: true
                    },
                    yAxis: {
                        //label  axisLabel: '',
                        tickFormat: function (d) {
                            return d3.format('1.0f')(d);
                        },
                        axisLabelDistance: 20
                    }
                }
            };

            $http.get(APP_CONST.OAUTH_SERVER + "/api/v1/analytics/score/monthly").then(function (response) {
                var data = response.data;

                $scope.raw__line = data;

                $scope.formatRaw__line($scope.raw__line);

                $scope.tableData__line = $scope.raw__line[$scope.selectedIdx__line].data;

                $scope.chartData__line = mapLineData($scope.raw__line);

                $scope.selectData__line = $scope.chartData__line;

                $scope.data__line = $scope.chartData__line[$scope.selectedIdx__line].data;

                $scope.compareBy__line = $scope.chartData__line[$scope.selectedIdx__line];

            }, function (response) {
                // Error handling
            });

            function getRandomColor() {
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }

            function mapLineData(data) {

                var temp = [];

                data.forEach(function (element) {
                    var tempObj = new Object();
                    tempObj.keyword = element.keyword;

                    var tempData = [];

                    element.data.forEach(function (value) {
                        if (value.active) {
                            var tempDataObj = new Object();
                            tempDataObj.key = value.name;
                            tempDataObj.color = value.color;

                            var tempValues = [];
                            value.monthlyScoreSegmented.forEach(function (e) {
                                var d = new Date(Date.UTC(e.year, e.month, 1));
                                tempValues.push([Date.parse(d), e.experienceScore]);
                            });

                            tempDataObj.values = tempValues;

                            tempData.push(tempDataObj);
                        }
                    });


                    tempObj.data = tempData;
                    temp.push(tempObj);

                });
                return temp;

            }

            $scope.formatRaw__line = function (data) {
                data.forEach(function (e) {
                    var cat = e.data;
                    cat.forEach(function (element, index) {
                        if (index < 5) {
                            element.active = true;
                        } else {
                            element.active = false;
                        }

                        element.color = getRandomColor();
                    });

                });
            }

            $scope.updateChart__line = function (item) {

                $scope.data__line = item.data;
                var k = item.keyword;
                $scope.raw__line.forEach(function (element) {
                    if (element.keyword == k) {
                        $scope.tableData__line = element.data;
                    }
                });

                $scope.selectData__line.forEach(function (option, index) {
                    if (option == item) {
                        $scope.selectedIdx__line = index;
                    }
                });

                $scope.data__line = $scope.chartData__line[$scope.selectedIdx__line].data;

            }
            $scope.checkTableBox__line = function (value) {


                var tempValue = value.name;
                var tempData = $scope.raw__line;
                tempData.forEach(function (element, index) {
                    var e = element.data;

                    e.forEach(function (element, index) {
                        if (tempValue == element.name) {
                            tempValue.active = value.active;
                        }
                    });
                });


                $scope.chartData__line = mapLineData($scope.raw__line);

                $scope.data__line = $scope.chartData__line[$scope.selectedIdx__line].data;

                //  $scope.compareBy__line = $scope.chartData__line[$scope.selectedIdx__line];


            }
        }]);


    angular.module('eventExperienceDataTable', [])
        .controller('DataTableController', ['$scope', "APP_CONST", "authInfoService", "refreshTokenService", "$http", "OAUTH_CONSTANT", "breadcrumbs", function ($scope, APP_CONST, authInfoService, refreshTokenService, $http, OAUTH_CONSTANT, breadcrumbs) {
            $scope.breadcrumbs = breadcrumbs;
            $http.get(APP_CONST.OAUTH_SERVER + "/api/v1/briefs?stage=POSTEVENT").then(function (response) {
                $scope.dataTable = response.data;

            }, function (response) {
                // Error handling
            });
        }]);


})();
