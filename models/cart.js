var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemsSchema = new Schema({
	bookId: String, 
	title: String,
	price: Number, 
	quantity:Number, 
	total: Number,
},	{versionKey: false});

var cart = function(){
    var cartSchema = new Schema({
		sessionID: String,		
		username: String,
        items: [itemsSchema],
		total: Number,
		totalInteger: Number,
		itemsCount: Number
	},
	{
    	versionKey: false
	});
	
	return mongoose.model('Cart', cartSchema);
};

module.exports = cart();