var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport){

	passport.use('userupdate', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            
            updateUser = function(){
                // find a user in Mongo with provided username
                User.findOne({ username :  username }, function(err, user) {

                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in getting user: '+err);
                        return done(err);
                    } 
                    // update user
                    if (user) {
                        user.email = req.body.email;
                        user.name = req.body.name;
                        user.gender = req.body.gender;
                        user.address = req.body.address;
                        user.posttown = req.body.posttown;
                        user.postcode = req.body.postcode;                 
                        // save the user
                        user.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);  
                                throw err;  
                            }  
                            return done(null, user);
                        });
                    } else {                  
                        console.log('Error in getting user: '+err);
                        return done(err);
                    }
                });
            };
            process.nextTick(updateUser);
        })
    );

}