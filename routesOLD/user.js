var express = require('express');
var router = express.Router();

var Book = require('../models/book');
var Category = require('../models/category');
var Order = require('../models/order');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
}

module.exports = function(){
    
   /* GET login page. */
	router.get('/login', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('userviews/login', { 
			message: req.flash('message'),
			categoryList : req.session.categoryList,
			itemsCount: req.session.itemsCount,
			filter: req.session.currentFilter 
		});
	});

	/* Handle Login POST */
	// router.post('/login', passport.authenticate('login', {
	// 	successRedirect: '/profile',
	// 	failureRedirect: '/login',
	// 	failureFlash : true  
	// }));

	/* GET Registration Page */
	router.get('/register', function(req, res){
		res.render('userviews/register',{
			message: req.flash('message'),
			categoryList : req.session.categoryList,
			itemsCount: req.session.itemsCount,
			filter: req.session.currentFilter
		});
	});

	/* Handle Registration POST */
	// router.post('/register', passport.authenticate('register', {
	// 	successRedirect: '/profile',
	// 	failureRedirect: '/register',
	// 	failureFlash : true  
	// }));

	/* GET Profile Page */
	router.get('/profile', isAuthenticated, function(req, res){
	  Order.find({username: req.user.username},function(err,orders){
		if(err){
			console.log(err);
		}
		if (orders.length !== 0) {
			var weHaveOrders = true;
		} else {
			var weHaveOrders = false;
		}
		res.render('userviews/profile', { 
			user: req.user,
			categoryList : req.session.categoryList,
			itemsCount: req.session.itemsCount,
			orders: orders,
			filter: req.session.currentFilter,
			weHaveOrders: weHaveOrders
		});
	  });
	});

	/* Handle Logout */
	router.get('/logout', function(req, res) {
		req.logout();
        res.locals.loggedIn = false; // so profile link doesn't show on navbar!
		res.render('userviews/logout', { 
			message: req.flash('logout successful'),
			categoryList : req.session.categoryList,
			itemsCount: req.session.itemsCount,
			filter: req.session.currentFilter 
		});
	});
	
	/* GET Profile Change Page */
	router.get('/profile/change', isAuthenticated, function(req, res){

	  res.render('userviews/profilechange', { 
		user: req.user,
		categoryList : req.session.categoryList,
		itemsCount: req.session.itemsCount,
		filter: req.session.currentFilter
	  });
	
	});
	
	/* Handle Profile Change POST */
	// router.post('/profile/change', passport.authenticate('userupdate', {
	// 	successRedirect: '/profile',
	// 	failureRedirect: '/profile/change',
	// 	failureFlash : true  
	// }));

	return router;
}
