(function () {
    'use strict';

    angular.module('charts', [])
        .config(['ChartJsProvider', function (ChartJsProvider) {
            // Configure all charts
            ChartJsProvider.setOptions({
                colours: ['#BBD85F', '#33BEF2', '#EDBE63', '#E0ACE6'],
                responsive: true
            });
            ChartJsProvider.setOptions('Line', {
                datasetFill: false
            });
        }])
    var controllers = angular.module('chartLine', [])
        .controller("DashboardLineCtrl", function ($scope) {

            $scope.series = ['Experience', 'Engagement', "Focus", "Sentiment"];

            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };
        }).controller("LineCtrl", function ($scope) {

            $scope.labels = ["Approved", "In Market", "Live", "Completed"];
            $scope.series = ['Experience', 'Engagement', "Focus", "Sentiment"];


            $scope.data = [
                [65, 59, 80, 81],
                [28, 48, 40, 19],
                [40, 30, 12, 8],
                [90, 30, 65, 70]
            ];
            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };
        }).controller("LineCtrl2", function ($scope) {

            $scope.labels = ["Approved", "In Market", "Live", "Completed"];
            $scope.series = ['Experience', 'Engagement', "Focus", "Sentiment"];

            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };
        });


    var controllers = angular.module('chartDoughnut', [])
        .controller("DoughnutCtrl", function ($scope) {
            $scope.labels = ["Leveraging Security Intelligence", "Service Provider Solutions", "User Group Sessions", "Building a Smarter Infastructure", "Optimizing IT & Service Management", "Manage and Securing the Mobile...", "Calculating Overhead", "Other"];
            $scope.data = [300, 500, 100, 400, 100, 200, 700, 50, 20, 300];
            $scope.colours = ["#3DBFF0)",
                "#BBD85F",
                "#E6E54A", "#F2C265", "#EDA26C", "#EF8788", "#E0ACE6", "#6CD1A9"
            ]
        });

})();
