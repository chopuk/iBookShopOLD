const dotenv = require('dotenv')
dotenv.config()
// Connect to the mongoDB instance required by the site.
// Note: it is called 'heroku' because that is where the site used to be hosted.
// It is now hosted on render.com
const mongoose = require('mongoose')
const db = {
    connect: function(){
            mongoose.connect('mongodb+srv://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD + 
                '@ibookshop.txby1.mongodb.net?retryWrites=true&w=majority', {dbName: 'heroku-bookshop'})
    }
}

module.exports = db;