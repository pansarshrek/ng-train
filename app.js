var express = require('express'),
	http = require('http'),
	path = require('path'),
	mongoose = require('mongoose');
	
var mongoModels = require('./models')(mongoose);

var User = mongoModels.User;
var Exercise = mongoModels.Exercise;
var Workout = mongoModels.Workout;
var ExerciseEntry = mongoModels.ExerciseEntry;

mongoose.connect('mongodb://localhost/ng-train');

function checkAuth(req, res, next) {
	if (!req.session.user_id) {
		res.redirect(401, '/login.html');
	} else {
		next();
	}
}


var app = express();

app.configure(function() {
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	app.use(express.session({secret: "adsrjkter935_2)#F!"}));
	app.use(app.router);
});

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

app.get('/api/workouts', checkAuth, function(req, res) {
	Workout.find(function(err, workouts) {
		res.send(workouts);
	});
});

app.post('/api/workouts', checkAuth, function(req, res) {
	var workout = new Workout(req.body);
	console.log(req.body);
	workout.save(function(err, workout) {
		if (!err) {
			res.send(workout);
		} else {
			res.send(err);
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

http.createServer(app).listen(8000, function() {
	console.log("Webserver started on port 8000!");
});