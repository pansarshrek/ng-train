(function() {
	var module = angular.module('exercisesService', ['ngResource']);

	module.factory('Exercises', function($resource) {
		return $resource('/api/exercises/:id', {
			id: '@_id.$oid'
		});
	});

	module.factory('Workouts', function($resource) {
		return $resource('/api/workouts/:id', {
			id: '@_id.$oid'
		});
	});

})();
