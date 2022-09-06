var express = require('express');
var router = express.Router();

var Book = require('../models/book');
var Cart = require('../models/cart');

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
    
	// Get cart
	router.get('/cart', function (req, res) {   
        // Get cart from database if it exists
        console.log("In CART...");
        console.log("Session=" + req.sessionID);
        Cart.findOne({ sessionID :  req.sessionID }, function(err, cart) {
            if (err){
                console.log('Error in getting cart: '+err);
            } 
            if (!cart && req.user){
                console.log("No cart so getting by username " + req.user.username);
                Cart.findOne({ username :  req.user.username }, function(err, cart) {
                    if (err){
                        console.log('Error in getting cart: '+err);
                    }
                    if (!cart) {
                        console.log("didnt find it");
                        var cart = {};
                    } else {
                        req.session.itemsCount = cart.itemsCount;
                        cart.sessionID = req.sessionID;
                        console.log("found it..");
                        Cart.update({ username: req.user.username }, { $set:{sessionID: req.sessionID } }, function(err, numAffected) {
                            if (err){
                                console.log('Error in updating cart: '+err);
                            } else {
                                console.log('Modifed Session ID for Cart');
                            }                           
                        });
                    } 
                    res.render('cartviews/cart',{
                        user: req.user,
                        cart: cart,
                        itemsCount: req.session.itemsCount,
                        categoryList : req.session.categoryList,
                        filter: req.session.currentFilter
                    });               
                });               
            } else {
                res.render('cartviews/cart',{
                    user: req.user,
                    cart: cart,
                    itemsCount: req.session.itemsCount,
                    categoryList : req.session.categoryList,
                    filter: req.session.currentFilter
                });  
            }
        });                                
    });	
    
    // Post cart
	router.post('/cart/:id', function(req,res){
        
        Book.findOne({_id: req.params.id},function(err,book){
			if(err){
				console.log(err);
			}
            // Get cart from database if it exists
            if (req.session.itemsCount >0){
                Cart.findOne({ sessionID :  req.sessionID }, function(err, cart) {
                    if (err){
                        console.log('Error in getting cart: '+err);
                    } 
                    req.session.itemsCount = req.session.itemsCount + 1;
                    var searchItem = req.params.id;
                    var index = -1;
                    for(var i = 0, len = cart.items.length; i < len; i++) {
                        if (cart.items[i].bookId === searchItem) {
                            index = i;
                            break;
                        }
                    }
                    if ( index == -1) {
                        cart.items.push({
                            bookId: book._id, 
                            title: book.title,
                            price: book.price, 
                            quantity:1, 
                            total: book.price 
                        });
                        cart.total = roundToTwo(cart.total + book.price);                        
                    } else {
                        cart.items[index].quantity = cart.items[index].quantity + 1;
                        cart.items[index].total = roundToTwo(cart.items[index].price * cart.items[index].quantity); 
                        cart.total = roundToTwo(cart.total + cart.items[index].price);
                    }
                    cart.itemsCount = cart.itemsCount + 1;
                    cart.sessionID = req.sessionID;
                    cart.totalInteger = parseInt(cart.total*100);
                    // save the cart
                    cart.save(function(err) {
                        if (err){
                            console.log('Error in Saving cart: '+err);  
                        }
                        book.quantity = book.quantity - 1;
                        var cindex = -1;
                        for(var i = 0, len = book.inCart.length; i < len; i++) {
                            if (book.inCart[i].sessionID === req.sessionID) {
                                cindex = i;
                                break;
                            }
                        }
                        
                        if (cindex == -1){
                            book.inCart.push({sessionID: req.sessionID, quantity: 1});
                        } else {
                            book.inCart[cindex].quantity = book.inCart[cindex].quantity + 1;
                        }
                        
                        book.save(function(err) {
                            if (err){
                                console.log('Error in Saving book: '+err);  
                            }    
                            res.redirect('/cart');  
                        });   
                    });
                });               
            } else {
                req.session.itemsCount = req.session.itemsCount + 1;
                if (!req.user) {
                    var username ="Not Logged In";
                } else {
                    var username = req.user.username;
                }
                
                var newCart = new Cart({
                    sessionID: req.sessionID,
                    username: username,
                    items: [],
                    total: 0,
                    itemsCount: 1
		        });
                newCart.items.push({
                        bookId: book._id, 
			            title: book.title,
			            price: book.price, 
			            quantity:1, 
			            total: book.price 
                    });
                newCart.total = roundToTwo(book.price);
                newCart.totalInteger = parseInt(newCart.total*100);
                newCart.save(function(err) {
                    if (err){
                        console.log('Error in Saving cart: '+err);  
                    }
                    book.quantity = book.quantity - 1;
                    var cindex = -1;
                    for(var i = 0, len = book.inCart.length; i < len; i++) {
                        if (book.inCart[i].sessionID === req.sessionID) {
                            cindex = i;
                            break;
                        }
                    }
                    
                    if (cindex == -1){
                        book.inCart.push({sessionID: req.sessionID, quantity: 1});
                    } else {
                        book.inCart[cindex].quantity = book.inCart[cindex].quantity + 1;
                    }
                    
                    book.save(function(err) {
                        if (err){
                            console.log('Error in Saving book: '+err);  
                        }   
                        res.redirect('/cart');  
                    });   
                });
            }			
		});        
    });
    
    //post remove single item from cart
	router.post('/cart/remove/:id', function (req, res) {    
        
        req.session.itemsCount = req.session.itemsCount - 1;      

        Cart.findOne({ sessionID :  req.sessionID }, function(err, cart) {
            if (err){
                console.log('Error in getting cart: '+err);
            }
            var searchItem = req.params.id;
            var index = -1;
            for(var i = 0, len = cart.items.length; i < len; i++) {
                if (cart.items[i].bookId === searchItem) {
                    index = i;
                    break;
                }
            }
            if (cart.items[index].quantity > 1) {
                cart.items[index].quantity = cart.items[index].quantity - 1;
                cart.items[index].total = roundToTwo(cart.items[index].quantity * cart.items[index].price);    
                cart.total = roundToTwo(cart.total - cart.items[index].price);                          
            } else {
                cart.total = roundToTwo(cart.total - cart.items[index].price); 
                cart.items.splice(index,1);
            }            
            cart.itemsCount = cart.itemsCount - 1;
            cart.sessionID = req.sessionID;
            cart.totalInteger = parseInt(cart.total*100);
            // save the cart
            cart.save(function(err) {
                if (err){
                    console.log('Error in Saving cart: '+err);  
                } 
                Book.findOne({_id: req.params.id},function(err,book){
                    if(err){
                        console.log(err);
                    }
                    book.quantity = book.quantity + 1;
                    var cindex = -1;
                    for(var i = 0, len = book.inCart.length; i < len; i++) {
                        if (book.inCart[i].sessionID === req.sessionID) {
                            cindex = i;
                            break;
                        }
                    }
                    if (cindex == -1){
                       // shouldn't go in here
                    } else {
                        book.inCart[cindex].quantity = book.inCart[cindex].quantity - 1;
                    }
                    if (book.inCart[cindex].quantity == 0){
                        book.inCart.splice(cindex,1);
                    }
                    book.save(function(err) {
                        if (err){
                            console.log('Error in Saving cart: '+err);  
                        }
                        if (req.session.itemsCount == 0 ) {                                  
                            // Remove the cart from the database
                            Cart.remove({ sessionID :  req.sessionID }, function(err) {
                                if (!err) {
                                        console.log('cart removed by user request!');;
                                }
                                else {
                                        console.log('Error in Removing cart: '+err); 
                                }
                                var cart = {};
                                res.render('cartviews/cart',{
                                    user: req.user,
                                    cart: cart,
                                    itemsCount: req.session.itemsCount,
                                    categoryList : req.session.categoryList
                                });
                            });   
                        } else {
                            res.render('cartviews/cart',{
                                user: req.user,
                                cart: cart,
                                itemsCount: req.session.itemsCount,
                                categoryList : req.session.categoryList,
                                filter: req.session.currentFilter
                            }); 
                        }                        
                    });
                });                   
            });                               
        });          
    });
    
    // post remove all from cart
	router.post('/emptycart', function (req, res) {     
                
        Cart.findOne({ sessionID :  req.sessionID }, function(err, cart) {
            if (err){
                console.log('Error in getting cart: '+err);
            }
            // return item quantities to their respective books
            var booksToUpdate = [];
            for(var i = 0, len = cart.items.length; i < len; i++) {
                    booksToUpdate.push(cart.items[i].bookId);
            }

            // Remove the cart from the database
            Cart.remove({ sessionID :  req.sessionID }, function(err) {
                if (!err) {
                        console.log('Cart removed by user request!');;
                }
                else {
                        console.log('Error in Removing cart: '+err); 
                }
                for(var i = 0, len = booksToUpdate.length; i < len; i++) {

                    Book.findOne({_id: booksToUpdate[i]},function(err,book){
                        if(err){
                            console.log(err);
                        }
                        var cindex = -1;
                        for(var j = 0, len = book.inCart.length; j < len; j++) {
                            if (book.inCart[j].sessionID === req.sessionID) {
                                cindex = j;
                                break;
                            }
                        }
                    
                        if (cindex == -1){
                            // Shouldn't go here
                        } else {
                            book.quantity = book.quantity + book.inCart[cindex].quantity;
                            book.inCart.splice(cindex,1);
                        }
                        
                        book.save(function(err) {
                            if (err){
                                console.log('Error in Saving book: '+err);  
                            }                       
                        });
                    }); 
                }                    
                req.session.itemsCount = 0;
                res.redirect('/cart'); 
            });
        });        
         
    });	
    
    router.get('/continue', function (req, res) { 
        if (req.session.currentFilter == 'None'){
            res.redirect('/books');
        } else {
            res.redirect(req.session.currentFilterUrl);
        }
    });
    

	return router;
}

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}
