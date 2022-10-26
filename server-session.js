// configure the express session 
const session = require('express-session')

module.exports = function(app){

    // this is in milliseconds, examples below
    // 24 * 60 * 60 * 1000 = 24 hours
    // 30 * 60 * 1000 = 30 minutes
    // 20 * 1000 = 20 seconds
    const timeout = 10 * 60 * 1000 // 10 minutes

    app.use(session({
        secret: "thisismysecretkey",
        cookie: { timeout: timeout },
        saveUninitialized: false,
        resave: false
    }))

}