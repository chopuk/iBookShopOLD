var express = require('express');
var router = express.Router();

var stripe = require('stripe')('sk_test_6dpBj6fOUrsT1BXwkoA5d25W');
var EmailTemplates = require('swig-email-templates');
var nodemailer = require('nodemailer');

var path = require('path');

var Book = require('../models/book');
var Cart = require('../models/cart');
var Order = require('../models/order');
var User = require('../models/user');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
}

module.exports = function(passport){
    
	/* GET checkout page. */
    router.get('/checkout', function (req, res) {  
       
       Cart.findOne({ sessionID :  req.sessionID }, function(err, cart) {
            if (err){
                console.log('Error in getting cart: '+err);
            } 
            res.render('checkoutviews/checkout',{
                cart: cart,
                itemsCount: req.session.itemsCount,
                categoryList : req.session.categoryList,
                user: req.user,
                filter: req.session.currentFilter
            }); 
        });   
                                    
    });
    
    /* GET success page. */
    router.get('/checkout/success', function(req, res, next) {
        var email = req.session.email;
        var customerName = req.session.customerName;
        var amount = req.session.amount;
        console.log("EMAIL=" + req.session.email);
        console.log("CUSTOMERNAME=" + req.session.customerName);
        console.log("AMOUNT=" + req.session.amount);
        var Iamount = parseFloat(amount/100).toFixed(2);
        // Get cart 
        Cart.findOne({ sessionID :  req.sessionID }, function(err, cart) {
           
            if (err){
                console.log('Error in getting cart: '+err);
            } 
            // initialise smtp
            var smtpTransport = nodemailer.createTransport({
                host: "smtp.mailgun.org",
                auth: {
                    user: "postmaster@sandbox0a3403db16cb4e5eb827a4b224038209.mailgun.org",
                    pass: "031277a26a348e4c166c7351d14f562f"
                }
            });

            //console.log('waiting 3 seconds...');
            //wait(3000);
            //console.log('...done!');

            for(var i = 0; i < cart.items.length; i++) {
                cart.items[i].displayPrice = cart.items[i].price.toFixed(2);
                cart.items[i].displayTotal = cart.items[i].total.toFixed(2);
            }

            var templates = new EmailTemplates({root: path.join(global.appRoot,'emailTemplates')});
            var context = {
                            amount: Iamount,
                            items: cart.items
            };

            templates.render('emailConfirmation.html', context, function(err, html, text) {
            
                // setup email data
                var mailOptions = {
                    from: "The iBookz Company <admin@ibookz.com", 
                    to: customerName + " " + "<" + email + ">", 
                    subject: "Order Confirmation", 
                    html: html
                }

                // send email
                smtpTransport.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }else{
                        console.log("Message sent: " + info.messageId);
                    }   
                    smtpTransport.close();
                });

            });
                     
            var newOrder = new Order();

            req.user.orderSeq = req.user.orderSeq + 1;
            User.update({ username: req.user.username }, { $set:{orderSeq: req.user.orderSeq } }, function(err, numAffected) {
                if (err){
                    console.log('Error in updating user: '+err);
                } else {
                    console.log('Modifed orderSeq ID for User');
                }                           
            });
            newOrder.orderNo = req.user.username + req.user.orderSeq.toString();
            newOrder.orderDate = new Date();
            newOrder.username = req.user.username;
            newOrder.total = cart.total;
            newOrder.totalInteger = cart.totalInteger;
            newOrder.status = 'In Progress';
            newOrder.items = cart.items;
            
            // save the order
            newOrder.save(function(err) {
                if (err){
                    console.log('Error in Saving order: '+err);  
                    throw err;  
                }    
                req.session.cart = {};
                req.session.itemsCount = 0;
                
                Cart.remove({ sessionID :  req.sessionID }, function(err) {
                    if (!err) {
                            console.log('Cart removed by user request!');;
                    }
                    console.log("AMOUNT=" + Iamount);
                    res.render('checkoutviews/checkoutSuccess',{
                        user: req.user, 
                        amount: Iamount,
                        itemsCount: req.session.itemsCount,
                        categoryList : req.session.categoryList,
                        filter: req.session.currentFilter
                    });
                });   
            });                         
        });     
        
    });

    /* GET failed page. */
    router.get('/checkout/failed', function(req, res, next) {
        var amount = req.session.amount;
        var Iamount = parseFloat(amount/100).toFixed(2);
        res.render('checkoutviews/checkoutFailed', {user: req.user, amount: Iamount,itemsCount: req.session.itemsCount,categoryList : req.session.categoryList});
    });

    /* POST to checkout page */
    router.post('/checkout', function(req, res) {
        var stripeToken = req.body.stripeToken;
        var amount = req.body.amount;
        req.session.amount  = amount;
        var customerName = req.body.name;
        req.session.customerName  = customerName;
        var email = req.body.email;
        req.session.email  = email;
        
        stripe.charges.create({
            card: stripeToken,
            currency: 'gbp',
            amount: amount
        },
        function(err, charge) {
            if (err) {
                console.table(err);
                res.location('/checkout/failed');
                res.redirect('/checkout/failed');
            } else {
                res.location('/checkout/success');
                res.redirect('/checkout/success')
            }
        });
    });

	return router;
}

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }
