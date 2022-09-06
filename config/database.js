const mongoose = require('mongoose')
const db = {
    connect: function(){
            mongoose.connect('mongodb+srv://admin:admin@ibookshop.txby1.mongodb.net?retryWrites=true&w=majority', {dbName: 'heroku-bookshop'})
    }
}

module.exports = db;