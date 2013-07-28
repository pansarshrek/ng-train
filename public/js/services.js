(function() {
	var module = angular.module('exercisesService', ['ngResource']);

	module.factory('Exercises', function($resource) {
		return $resource('/api/exercises/:id', {
			id: '@_id.$oid'
		});
	});

	module.service('REST', function($http, $resource) {
		
		this.base = function(url) {
			var Res = $resource(url, {
				id: '@_id.$oid'
			});

			return {
				get: function(id) {
					return $http.get(url);
				}
			}
		}

		this.doStuff = function() {
			$http.get('/api/exercises').success(function(exercises) {
				console.dir(exercises);
			});
		}
	});

})();