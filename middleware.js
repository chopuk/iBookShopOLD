// configure the express middleware
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const isAuthorized = require('./middleware/auth');

module.exports = function(app, express){

    app.use(express.static(path.join(__dirname, 'public'))) 

    app.use(express.json())
    app.use(logger('dev'))
    app.use(cookieParser())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    
    // check if user has successfully logged in
    app.use(isAuthorized)
    
    // set loggedIn and user data for navbar customization
    app.use(function(req, res, next) {
        res.locals.loggedIn = (req.isAuthorized) ? true : false
        res.locals.user = req.user
        next()
    })
}