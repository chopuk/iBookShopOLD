var User = require('../models/user');

var db = {
    addUser: function(){
        
        var newUser = User({
            name: 'Chris Harris',
            username: 'bigchopper',
            password: 'qwerty',
            email: 'me@mine.com',
            gender: 'male',
            address: '320 Cannock Road'
        });

        newUser.save(function(err) {
        if (err) throw err;
            console.log('User created!');
        });
    }
}

module.exports = db;