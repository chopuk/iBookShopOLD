var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemsSchema = new Schema({
	bookId: String, 
	title: String,
	price: Number, 
	quantity:Number, 
	total: Number,
},	{versionKey: false});

var order = function(){
    var orderSchema = new Schema({
		orderNo: String,
		orderDate: Date,		
		username: String,
        items: [itemsSchema],
		total: Number,
		totalInteger: Number,
		status: String
	},
	{
    	versionKey: false
	});
	
	return mongoose.model('Order', orderSchema);
};

module.exports = order();