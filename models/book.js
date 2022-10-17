const mongoose = require('mongoose')
const Schema = mongoose.Schema

const inCartSchema = new Schema({
	username: String, 
	quantity: Number
},  {versionKey: false})

const book = function(){
    var bookSchema = new Schema({
		title: String,		
		description: String,
		author: String,
		publisher: String,
		price: Number,
		cover: String,
        featured: Boolean,
		quantity: Number,
        categories: [],
		inCart: [inCartSchema]
	},
	{
    	versionKey: false
	})

	// Shorten text
	bookSchema.methods.truncateText = function(length){
		return this.description.substring(0,length)
	}

	return mongoose.model('Book', bookSchema)
}

module.exports = book()