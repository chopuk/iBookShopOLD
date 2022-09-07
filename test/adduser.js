var User = require('../models/user');

var db = {
    addUser: function(){
        
        var newUser = User({
            name: 'Beautiful Amit',
            username: 'amit',
            password: 'qwerty',
            email: 'amit@israel.com',
            gender: 'female',
            address: 'Tel Aviv'
        });

        newUser.save(function(err) {
        if (err) throw err;
            console.log('User created!');
        });
    }
}

module.exports = db;