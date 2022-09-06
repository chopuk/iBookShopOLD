var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var session = function(){
	var sessionSchema = new Schema({
		_id: String,
		session: String,
		expires: Date,
	},
	{
    	versionKey: false
	});
	
	return mongoose.model('Session', sessionSchema);
};

module.exports = session();