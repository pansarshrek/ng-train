function CreateExercise($scope, $routeParams, $http) {

	$scope.exercise = {
		name: '',
		consistsOf: [],
		attributes: []
	};

	$scope.removeAttribute = function(i) {
		$scope.exercise.attributes.splice(i,1);
	}

	$scope.moveAttributeUp = function(i) {
		var arr = $scope.exercise.attributes;
		if (i > 0 && i < arr.length) {
			var temp = arr[i];
			arr[i] = arr[i-1];
			arr[i-1] = temp;
		}
	}

	$scope.addAttribute = function() {
		$scope.exercise.attributes.push({"name": "", "type": ""});
	}

	$scope.createExercise = function() {
		$http.post('/api/exercises', $scope.exercise).success(function(data) {
			console.dir(data);
			$scope.exercise = {
				name: '',
				consistsOf: [],
				attributes: []
			};
		});
	}

}

function Dashboard($scope, $routeParams) {
}

function ExercisesController($scope, $routeParams, $http, Exercises, REST) {

	// REST.doStuff();

	var exercises = REST.base('/api/exercises');
	exercises.get().success(function(exercises) {
		console.dir(exercises);
	})

	$scope.delete = function(exercise) {
		$scope.exercises.forEach(function(ex, index) {
			if (ex._id === exercise._id) {
				Exercises.remove({id: exercise._id}, function() { $scope.exercises.splice(index, 1); });
			}
		});
	}

	$scope.exercises = Exercises.query();

}

function Controller($scope, $http) {

	$http.get('/api/authenticated').success(function(data) {
		$scope.authenticated = data.authenticated;
	});
	

}

function NewWorkout($scope, Exercises) {
	function dateString(date) {
		var year = date.getFullYear();
		var month = (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
		var date = date.getDate();
		return year + '-' + month + '-' + date;
	}

	$scope.Exercises = Exercises;	

	$scope.date = dateString(new Date());

	$scope.input = {
		name: '',
		sets: []
	}

	$scope.add = function() {
		var data = $scope.input.sets;
		var sets = [];
		for (var i = 0; i < data.length; i++) {
			var repsWeight = data[i].split('x');
			sets.push({reps: repsWeight[0], weight: repsWeight[1]})
		}

		$scope.workoutData.push({name: $scope.input.name, sets: sets});
		$scope.input = {
			name: '',
			sets: []
		}
		
	}

	$scope.workoutData = [
		{
			name: 'Power Clean & Jerk',
			sets: [
				{reps: 2, weight: 70},
				{reps: 2, weight: 70},
				{reps: 2, weight: 80},
				{reps: 2, weight: 90},
				{reps: 2, weight: 95},
				{reps: 1, weight: 100},
				{reps: 1, weight: 100},
				{reps: 3, weight: 90},
				{reps: 3, weight: 90}
			]
		}
	];

}