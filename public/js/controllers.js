function CreateExercise($scope, $routeParams, $http) {

	$scope.exercise = {
		name: '',
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
	function make2Digit(number) {
		if (number < 10 && number >= 0) {
			number = '0' + number;
		}
		return number;
	}

	function dateString(date) {
		var year = date.getFullYear();
		var month = make2Digit(date.getMonth() + 1);
		var date = make2Digit(date.getDate());
		return year + '-' + month + '-' + date;
	}

	$scope.exercises = Exercises.query();

	$scope.date = dateString(new Date());

	$scope.input = {
		name: '',
		sets: []
	};

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
		
	};

	$scope.addEntry = function() {
		if ($scope.exercise) {
			if (!$scope.exercise.exerciseEntries) {
				$scope.exercise.exerciseEntries = [];
			}
			var o = {};
			$scope.exercise.attributes.forEach(function(el) {
				if (el.type == 'bool')
					o[el.name] = false;
				else 
					o[el.name] = '';
			});
			$scope.exercise.exerciseEntries.push(o);
		}
	};

	$scope.saveExercise = function() {
		var ex = $scope.exercise;
		var obj = {
			name: ex.name,
			attributes: angular.copy(ex.attributes),
			exerciseEntries: angular.copy(ex.exerciseEntries)
		};

		$scope.workoutData.push(obj);
		console.dir($scope.workoutData);
	};

	$scope.setCurrentExercise = function(exercise) {
		$scope.exercise = exercise;
	};

	$scope.workoutData = [];

}