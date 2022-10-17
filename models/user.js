const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

// define the schema for our user model
const userSchema = mongoose.Schema({

    name: String,
    username: String,     
    password: String,
    email: String,
    gender: String,
    addressline1: String,
    addressline2: String,
    addressline3: String,
    postcode: String,
    orderSeq: Number

}, { versionKey: false} )

// check for valid password
userSchema.methods.ValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

// generate password hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
} 

userSchema.pre('save', function(next) {

    const user = this

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next()

    // generate password hash
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null)
    next()
})

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema)