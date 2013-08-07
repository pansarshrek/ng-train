var express = require('express');

exports.createApi = function(app, models) {

	var User = models.User;
	var Exercise = models.Exercise;
	var Workout = models.Workout;
	var ExerciseEntry = models.ExerciseEntry;

	function checkAuth(req, res, next) {
		if (!req.session.user_id) {
			res.redirect(401, '/login.html');
		} else {
			next();
		}
	}

	app.post('/login', function(req, res) {
		console.log("Handling login attempt");
		var post = req.body;
		User.findOne({username: post.username}, function(err, user) {
			if (!user) {
				res.redirect(401, '/login.html');
			} else if (user.validPassword(post.password)) {
				console.log("password correct");
				req.session.user_id = user._id;
				res.redirect('/');
			}
		})
	});

	app.post('/register', function(req, res) {
		console.log("Handling register");
		var post = req.body;
		if (post.password === post.repassword) {
			User.findOne({username: post.username}, function(err, user) {
				if (!user) {
					var user = new User({username: post.username, email: post.email});
					user.setPassword(post.password, function() {
						user.save(function(err) {
							console.log(post.username + " saved in db");
							res.redirect('/login.html');
						});
					});
				}
			});
		}
	});

	app.get('/api/exerciseentries', checkAuth, function(req, res) {
		ExerciseEntry.find(function(err, entries) {
			res.send(entries);
		});
	});

	app.get('/api/exerciseentries/:id', checkAuth, function(req, res) {
		ExerciseEntry.findById(req.params.id, function(err, entry) {
			res.send(entry);
		});
	});

	app.get('/api/workouts', checkAuth, function(req, res) {
		Workout.find()
		.populate('entries')
		.exec(function(err, workouts) {
			res.send(workouts);
		});
	});

	app.get('/api/workouts/:id', checkAuth, function(req, res) {
		Workout
		.findById(req.params.id)
		.populate('entries')
		.exec(function(err, workout) {
			if (err) 
				res.send(err);
			else
				res.send(workout);
		});
	});

	app.post('/api/workouts', checkAuth, function(req, res) {
		var data = req.body.data;
		var exerciseEntries = [];

		var workout = new Workout(req.body);

		data.forEach(function(el, i) {
			var entry = new ExerciseEntry(el);
			entry.workoutId = workout._id;
			entry.save(function(err, entry) {
				if (err) console.log(err);
			});
			exerciseEntries.push(entry._id);
		});

		workout.entries = exerciseEntries;

		workout.save(function(err, workout) {
			if (err) {
				res.send(err);
			} else {
				res.send(workout);
			}
		});
	});

	app.get('/api/exercises', checkAuth, function(req, res) {
		Exercise.find().sort('name').exec(function(err, exercises) {
			res.send(exercises);
		});
	});

	app.post('/api/exercises', checkAuth, function(req, res) {
		var exercise = new Exercise(req.body);
		console.log(req.body);
		exercise.save(function(err, exercise) {
			if (!err) {
				res.send(exercise);
			} else {
				res.send(err);
			}
		});
	});

	app.get('/api/exercises/:id', checkAuth, function(req, res) {
		var id = req.params.id;
		Exercise.findById(id, function(err, exercise) {
			if (err) {
				res.send(err);
			} else {
				res.send(exercise);
			}
		});
	});

	app.put('/api/exercises/:id', checkAuth, function(req, res) {
		var id = req.params.id;
		var post = req.body;
		Exercise.findById(id, function(err, exercise) {
			if (err) {
				res.send(err);
			} else if (post) {
				if (post.name)
					exercise.name = post.name;
				if (post.exercise)
					exercise.attributes = post.attributes;

				exercise.save(function(err, exercise) {
					if (err) {
						res.send(err);
					} else {
						res.send(exercise);
					}
				});
			}
		});
	});

	app.delete('/api/exercises/:id', checkAuth, function(req, res) {
		Exercise.findById(req.params.id, function(err, exercise) {
			if (err) {
				res.send(err);
			} else {
				exercise.remove(function(err) {
					if (err) { 
						res.send(err); 
					} else {
						res.send(true);
					}
				});
			}
		});

	});



	app.get('/api/users', checkAuth, function(req, res) {
		User.find().select('username').exec(function(err, users) {
			res.send(users);
		});
	});

	app.get('/api/authenticated', function(req, res) {
		if (req.session.user_id) {
			res.send({authenticated: true});
		} else {
			res.send({authenticated: false});
		}
	});
}