const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const db = {
    connect: function(){
            mongoose.connect('mongodb+srv://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD + 
                '@ibookshop.txby1.mongodb.net?retryWrites=true&w=majority', {dbName: 'heroku-bookshop'})
    }
}

module.exports = db;