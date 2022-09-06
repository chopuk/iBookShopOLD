var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');

// define the schema for our user model
var userSchema = mongoose.Schema({

    name: String,
    username: String,     
    password: String,
    email: String,
    gender: String,
    address: String,
    posttown: String,
    postcode: String,
    orderSeq: Number

}, { versionKey: false} );

// on every save, hash the password
//userSchema.pre('save', function(next) {
  //this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null); 
 // next();
//});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);