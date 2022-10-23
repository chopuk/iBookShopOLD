const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemsSchema = new Schema({
	bookId: String, 
	title: String,
	cover: String,
	price: Number, 
	quantity:Number, 
	total: Number,
	totalInteger: Number,
},	{versionKey: false})

const cart = function(){
    var cartSchema = new Schema({
		username: String,
        items: [itemsSchema],
		total: Number,
		totalInteger: Number,
		itemsCount: Number
	},
	{
    	versionKey: false
	})
	
	return mongoose.model('Cart', cartSchema)
}

module.exports = cart()