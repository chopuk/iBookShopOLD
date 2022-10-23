const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemsSchema = new Schema({
	bookId: String, 
	title: String,
	price: Number, 
	quantity:Number, 
	total: Number,
	totalInteger: Number,
},	{versionKey: false})

const order = function(){
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
	})
	
	return mongoose.model('Order', orderSchema)
}

module.exports = order()