(function () {
    'use strict';

    var ScoreboardController = function ($scope, $http) {
		$http.get('https://goegefietst.gent/teams/').then(function (Data) {
			if(Data.status == 200)
				$scope.Scoreboard = Data.data;
        });
    }

    angular
     .module('GoeGefietstApp', [])
     .controller('ScoreboardController', ScoreboardController);
})();
