angular.module('ng-train', ['exercisesService', 'directives']).
	directive('navMenu', function($location) {
		return function(scope, element, attrs) {
			var links = element.find('a'),
				urlMap = {},
				currentLink;

			for (var i = 0; i < links.length; i++) {
				link = angular.element(links[i]);
				urlMap[link.attr('href')] = link;
			}

			scope.$on('$routeChangeStart', function() {
				var pathLink = urlMap['#' + $location.path()];

				if (pathLink){
					if (currentLink) {
						currentLink.parent().removeClass('active');
					}
					currentLink = pathLink;
					currentLink.parent().addClass('active');
				}
			});
		}
	}).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/dashboard', {templateUrl: 'partials/dashboard.html', controller: Dashboard}).
			when('/create', {templateUrl: 'partials/create.html', controller: CreateExercise}).
			when('/exercises', {templateUrl: 'partials/exercises.html', controller: ExercisesController}).
			when('/newworkout', {templateUrl: 'partials/newworkout.html', controller: NewWorkout}).
			when('/workouts', {templateUrl: 'partials/workouts.html', controller: Workouts}).
			otherwise({redirectTo: '/dashboard'});
	}]);