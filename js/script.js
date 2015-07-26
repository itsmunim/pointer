angular.module('designly.directives',[]);
var app = angular.module('designly', ['designly.directives']);


app.controller('MainCtrl', function ($scope) {

    $scope.annotations = [];

    $scope.getAnnotation = function (text, createdBy) {
        return {
            text: text,
            createdBy: createdBy,
            replyList: []
        };
    }

    $scope.createAnnotation = function (text, createdBy) {
        $scope.annotations.add($scope.getAnnotation(text, createdBy));
    }
});