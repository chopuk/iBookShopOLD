const express = require('express')
const router = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const cart = require('../models/cart')

module.exports = function(){

    // get the login page
    router.get('/login', function(req, res) {
        res.render('login')
	})

	// post the login page
    router.post('/login', 
		[
			check('username', 'The username must me 3+ characters long')
				.isLength({ min: 3 }),
			check('password', 'Password must be at least 6 characters')
				.isLength({ min: 6 })
		], 
		function(req, res) {
			// check if errors found
			const errors = validationResult(req)
			if(!errors.isEmpty()) {
				const alert = errors.array()
				console.log(JSON.stringify(alert))
				res.render('login', {
					alert
				})
			} else {
				// check in mongo if a user with username exists or not
				User.findOne({ 'username' :  req.body.username }, 
					function(err, user) {
						// Username does not exist, log the error and redirect back
						if (!user) {
							console.log('User not found with username ' + req.body.username)
							res.render('login', {message : 'User not found'})               
						} else if (!user.ValidPassword(req.body.password)) {
							
							// User exists but wrong password, log the error 
							console.log('Invalid password' + req.body.password)
							res.render('login', {message : 'Invalid password'}) 
						} else {
							// All ok - create JWT
							const token = jwt.sign(user.toJSON(), 
								'mysimplekey', 
								{
									// this is in milliseconds, examples below
									// 24 * 60 * 60 * 1000 = 24 hours
									// 30 * 60 * 1000 = 30 minutes
									// 20 * 1000 = 20 seconds
									expiresIn: 10 * 60 * 1000 // 10 minutes
								}
							)
							res.cookie( 'token', token , {
								httpOnly: true
							})

							//show books list
							res.redirect('/book/booklist')
						}	
					}
				) 
			}
		})

		// handle logout
		router.get('/logout', function(req, res) {
			res.locals.loggedIn = false // so profile link doesn't show on navbar!
			res.clearCookie('token')
			req.session.destroy(()=>{
				res.render('login', {message: 'You have successfully logged out'})
			})
		})

		// get the register page
		 router.get('/register', function(req, res) {
			res.render('register')
		})

		// post the register page
		router.post('/register', 
		[
			check('username', 'The username must me 3+ characters long')
				.isLength({ min: 3 }),
			check('password', 'Password must be at least 6 characters')
				.isLength({ min: 6 })
		], 
		function(req, res) {
			// check if errors found
			const errors = validationResult(req)
			if(!errors.isEmpty()) {
				const alert = errors.array()
				console.log(JSON.stringify(alert))
				res.render('login', {
					alert
				})
			} else {
				// check in mongo if a user with username exists or not
				User.findOne({ 'username' :  req.body.username }, 
					function(err, user) {
						// Username already exists - inform the user
						if (user) {
							console.log('User already exists ' + req.body.username)
							res.render('register', {message : 'Username already exists'})              
						} else {
							// create the user
							const newUser = new User();

							// set the user's local credentials
							newUser.username = req.body.username
							newUser.password = req.body.password
							newUser.email = req.body.email
							newUser.name = req.body.name
							newUser.gender = req.body.gender
							newUser.addressline1 = req.body.addressline1
							newUser.addressline2 = req.body.addressline2
							newUser.addressline3 = req.body.addressline3
							newUser.postcode = req.body.postcode
							newUser.orderSeq = 0
							
							// save the user
							newUser.save(function(err) {
								if (err) {
									console.log('Error in Saving user: '+err)
									res.render('register', {message : 'Unspecified Error'})
								} else {
									console.log('User Registration successful') 
									res.render('login', {message : 'Registration Successful'})
								}
							})
						}	
					}
				) 
			}
		})

		// get the profile page
		router.get('/profile', function(req, res) {
			res.render('profile', {
				user: req.user,
				itemsCount: req.session.itemsCount})
		})

		// post the profile page
		router.post('/profile', 
		[
			check('username', 'The username must me 3+ characters long')
				.isLength({ min: 3 })
		], 
		function(req, res) {
			// check if errors found
			const errors = validationResult(req)
			if(!errors.isEmpty()) {
				const alert = errors.array()
				console.log(JSON.stringify(alert))
				res.render('profile', {
					alert
				})
			} else {
				// check in mongo if a user with username exists or not
				User.findOne({ 'username' :  req.body.username }, 
					function(err, user) {
						// Can't find user
						if (!user) {
							console.log('User does not exist: ' + req.body.username)
							res.render('profile', {message : 'Username does not exist'})              
						} else {
							// update the user
							if (req.body.password.length > 0) {
								user.password = req.body.password
							}
							user.username = req.body.username
							user.email = req.body.email
							user.name = req.body.name
							user.gender = req.body.gender
							user.addressline1 = req.body.addressline1
							user.addressline2 = req.body.addressline2
							user.addressline3 = req.body.addressline3
							user.postcode = req.body.postcode
							
							// save the user
							user.save(function(err) {
								if (err) {
									console.log('Error in Updating user: '+err); 
									res.render('profile', {message : 'Unspecified Error'})
								} else {
									console.log('User Profile updated')
									res.render('profile', {user: user, message : 'Profile Updated Sucessfully'})
								}
							})
						}	
					}
				) 
			}
		})

		return router
}
