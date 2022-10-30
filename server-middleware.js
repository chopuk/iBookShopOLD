const express = require('express')
const path = require('path')

// configure the express middleware
const logger = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const isAuthorized = require('./server-auth');

module.exports = function(app){

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