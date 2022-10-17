const mongoose = require('mongoose')
const Schema = mongoose.Schema

const category = function(){
	var categorySchema = new Schema({
		name: String,
        parent: String,
        path: String,
		bookCount: Number // unique books in category, NOT total books
	},
	{
    	versionKey: false
	})
	
	return mongoose.model('Category', categorySchema)
}

module.exports = category()