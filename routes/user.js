const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Cart = require('../models/cart')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')

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
		async function(req, res) {
			// check if errors found
			const errors = validationResult(req)
			if(!errors.isEmpty()) {
				const alert = errors.array()
				console.log(JSON.stringify(alert))
				res.render('login', {
					alert
				})
			} else {

				try {
					// check in mongo if a user with username exists or not
					const user = await User.findOne({ 'username' :  req.body.username })
					
					if (!user) {
						// Username does not exist, log the error and redirect back
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
						// send the JWT to the browser
						res.cookie( 'token', token , {
							httpOnly: true
						})

						// check if a cart exists for this user
						const cart = await Cart.findOne({ 'username' :  req.body.username })
						if (cart) {
							console.log('Found cart for user.. setting itemsCount to: ' + cart.itemsCount)
							req.session.itemsCount = cart.itemsCount
							//show existing cart
							res.redirect('/cart/list')
						} else {
							req.session.itemsCount = 0
							//show books list
							res.redirect('/book/booklist')
						} 
					}	
				} catch (error) {
					console.log(error)
					res.sendStatus(500)
				}		
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
		async function(req, res) {
			// check if errors found
			const errors = validationResult(req)
			if(!errors.isEmpty()) {
				const alert = errors.array()
				console.log(JSON.stringify(alert))
				res.render('login', {
					alert
				})
			} else {

				try {
					// check in mongo if a user with username exists or not
					const user = await User.findOne({ 'username' :  req.body.username })
					if (user) {
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
						await newUser.save()
						res.render('login', {message : 'Registration Successful'})

					}	
				} catch (error) {
					console.log(error)
					res.sendStatus(500)
				}
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
		async function(req, res) {
			// check if errors found
			const errors = validationResult(req)
			if(!errors.isEmpty()) {
				const alert = errors.array()
				console.log(JSON.stringify(alert))
				res.render('profile', {
					alert
				})
			} else {
				try {
					// check in mongo if a user with username exists or not
					const user = await User.findOne({ 'username' :  req.body.username })
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
						await user.save()
						res.render('profile', {user: user, message : 'Profile Updated Sucessfully'})

					}	
				} catch (error) {
					console.log(error)
					res.sendStatus(500)
				}
			}
		})

		return router
}
