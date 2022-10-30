// configure the express session 
const session = require('express-session')

module.exports = function(app){

    // this is in milliseconds, examples below ( 1000ms = 1sec )
    // 1000 * 60 * 60 * 24 = 24 hours
    // 1000 * 60 * 30 = 30 minutes
    // 1000 * 20 = 20 seconds

    const timeout = 1000 * 60 * 10 // 10 minutes

    app.use(session({
        secret: "thisismysecretkey",
        cookie: { timeout: timeout },
        saveUninitialized: false,
        resave: false
    }))

}