const User = require('../models/user')
const bcrypt = require('bcryptjs')

const db = {
    addUser: function(){
        
        const newUser = User({
            name: 'Beautiful Amit',
            username: 'amit',
            password: bcrypt.hashSync('qwerty', bcrypt.genSaltSync(8), null),
            email: 'amit@israel.com',
            gender: 'female',
            address: 'Tel Aviv',
            postcode: 'WV10 0BH',
            posttown: 'Wolverhampton',
            orderSeq: 0
        });

        newUser.save(function(err) {
        if (err) throw err;
            console.log('User created!');
        });
    }
}

module.exports = db;