const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
        genre: String
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