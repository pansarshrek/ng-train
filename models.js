module.exports = function(mongoose) {
	var crypto = require('crypto');
	var Schema = mongoose.Schema;

	var exports = {};

	exports.UserSchema = new Schema({
		username: String,
		password: String,
		salt: String,
		email: String
	});

	exports.UserSchema.methods.validPassword = function(password) {
		var sha256hash = crypto.createHash('sha256').update(this.salt + password).digest('hex');
		if (sha256hash === this.password) return true;
		else return false;
	};

	exports.UserSchema.methods.setPassword = function(password, done) {
		var self = this;
		console.log("Setting password!");
		crypto.randomBytes(48, function(ex, buf) { 
			self.salt = buf.toString('hex');
			self.password = crypto.createHash('sha256').update(self.salt + password).digest('hex');
			done();
		});
	};

	exports.AttributeSchema = new Schema({
		name: String,
		type: {
			type: String,
			enum: ['bool', 'text', 'int', 'double']
		}
	});

	exports.ExerciseSchema = new Schema({
		name: String,
		attributes: [exports.AttributeSchema]
	});

	exports.ExerciseEntrySchema = new Schema({
		name: String,
		exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise' },
		workoutId: { type: Schema.Types.ObjectId, ref: 'Workout' },
		attributes: [exports.AttributeSchema],
		data: [Schema.Types.Mixed]
	});

	exports.WorkoutSchema = new Schema({
		date: Date,
		timeElapsed: Number,
		data: [{type: Schema.Types.ObjectId, ref: 'ExerciseEntry'}]
	});

	exports.User = mongoose.model('User', exports.UserSchema);
	exports.Exercise = mongoose.model('Exercise', exports.ExerciseSchema);
	exports.ExerciseEntry = mongoose.model('ExerciseEntry', exports.ExerciseEntrySchema);
	exports.Workout = mongoose.model('Workout', exports.WorkoutSchema);

	return exports;

};