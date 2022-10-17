const express = require('express')
const router = express.Router()

const Book = require('../models/book')
const Cart = require('../models/cart')

module.exports = function(){
    
    // Show the users cart
    router.get('/list', function(req, res) {
        
        if (!req.isAuthorized) {
            console.log("User not Authorized - redirecting to login page...")
            res.render('login')
        } else {
                    
            Cart.findOne({ username :  req.user.username }, function(err, cart) {

                if (err){
                    console.log('Error in getting cart: '+err)
                } 

                if (!cart){
                    req.session.itemsCount = 0
                    const cart = {}
                } else {
                    req.session.itemsCount = cart.itemsCount
                }
                
                res.render('cart',{
                    user: req.user,
                    cart: cart,
                    itemsCount: req.session.itemsCount
                })  
            })
        }
	})

    // Add Item to cart
	router.post('/additem/:id', function(req,res){
        
        Book.findOne({_id: req.params.id},function(err,book){

			if(err){
				console.log(err);
			}

            // Get cart from database if it exists
            if (req.session.itemsCount > 0){
                Cart.findOne({ username :  req.user.username }, function(err, cart) {

                    if (err){
                        console.log('Error in getting cart: '+err)
                    } 

                    req.session.itemsCount = req.session.itemsCount + 1

                    // check if this item is already in the cart
                    const searchItem = req.params.id
                    var index = -1
                    for(var i = 0, len = cart.items.length; i < len; i++) {
                        if (cart.items[i].bookId === searchItem) {
                            index = i
                            break
                        }
                    }

                    if ( index == -1) {                      
                        // item not found - add new item to array
                        cart.items.push({
                            bookId: book._id, 
                            title: book.title,
                            price: book.price, 
                            quantity:1, 
                            total: book.price 
                        });
                        cart.total = roundToTwo(cart.total + book.price)                        
                    } else {
                        // item found - update existing entry
                        cart.items[index].quantity = cart.items[index].quantity + 1
                        cart.items[index].total = roundToTwo(cart.items[index].price * cart.items[index].quantity) 
                        cart.total = roundToTwo(cart.total + cart.items[index].price)
                    }
                    cart.itemsCount = cart.itemsCount + 1
                    cart.totalInteger = parseInt(cart.total*100)
                    // save the cart
                    cart.save(function(err) {
                        if (err){
                            console.log('Error in Saving cart: '+err);  
                        }

                        // decrement the book quantity
                        book.quantity = book.quantity - 1;
                        var cindex = -1;
                        for(var i = 0, len = book.inCart.length; i < len; i++) {
                            if (book.inCart[i].username === req.user.username) {
                                cindex = i
                                break;
                            }
                        }
                        
                        if (cindex == -1){
                            book.inCart.push({username: req.user.username, quantity: 1})
                        } else {
                            book.inCart[cindex].quantity = book.inCart[cindex].quantity + 1
                        }
                        
                        book.save(function(err) {
                            if (err){
                                console.log('Error in Saving book: '+err) 
                            }    
                            res.redirect('/cart/list')
                        });   
                    });
                });               
            } else {
                
                req.session.itemsCount = req.session.itemsCount + 1
    
                const newCart = new Cart({
                    username: req.user.username,
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
                    })
                newCart.total = roundToTwo(book.price);
                newCart.totalInteger = parseInt(newCart.total*100)

                console.log('newcart:' +newCart)

                newCart.save(function(err) {
                    if (err){
                        console.log('Error in Saving cart: '+err) 
                    }
                    book.quantity = book.quantity - 1
                    var cindex = -1;
                    for(var i = 0, len = book.inCart.length; i < len; i++) {
                        if (book.inCart[i].username === req.user.username) {
                            cindex = i
                            break
                        }
                    }
                    
                    if (cindex == -1){
                        book.inCart.push({username: req.user.username, quantity: 1})
                    } else {
                        book.inCart[cindex].quantity = book.inCart[cindex].quantity + 1
                    }
                    
                    book.save(function(err) {
                        if (err){
                            console.log('Error in Saving book: '+err)  
                        }   
                        res.redirect('/cart/list')
                    })   
                })
            }			
		})        
    })

    // remove single item from cart
	router.post('/removeitem/:id', function (req, res) {    
        
        req.session.itemsCount = req.session.itemsCount - 1     

        Cart.findOne({ username :  req.user.username }, function(err, cart) {
            if (err){
                console.log('Error in getting cart: '+err)
            }
            var searchItem = req.params.id
            var index = -1
            for(var i = 0, len = cart.items.length; i < len; i++) {
                if (cart.items[i].bookId === searchItem) {
                    index = i
                    break
                }
            }
            if (cart.items[index].quantity > 1) {
                cart.items[index].quantity = cart.items[index].quantity - 1
                cart.items[index].total = roundToTwo(cart.items[index].quantity * cart.items[index].price)    
                cart.total = roundToTwo(cart.total - cart.items[index].price)                          
            } else {
                cart.total = roundToTwo(cart.total - cart.items[index].price) 
                cart.items.splice(index,1)
            }            
            cart.itemsCount = cart.itemsCount - 1
            cart.totalInteger = parseInt(cart.total*100)
            // save the cart
            cart.save(function(err) {
                if (err){
                    console.log('Error in Saving cart: '+err) 
                } 
                Book.findOne({_id: req.params.id},function(err,book){
                    if(err){
                        console.log(err);
                    }
                    book.quantity = book.quantity + 1
                    var cindex = -1;
                    for(var i = 0, len = book.inCart.length; i < len; i++) {
                        if (book.inCart[i].username === req.user.username) {
                            cindex = i
                            break
                        }
                    }
                    if (cindex == -1){
                       // shouldn't go in here
                    } else {
                        book.inCart[cindex].quantity = book.inCart[cindex].quantity - 1
                    }
                    if (book.inCart[cindex].quantity == 0){
                        book.inCart.splice(cindex,1)
                    }
                    book.save(function(err) {
                        if (err){
                            console.log('Error in Saving cart: '+err)  
                        }
                        if (req.session.itemsCount == 0 ) {                                  
                            // Remove the cart from the database
                            Cart.remove({ username :  req.user.username }, function(err) {
                                if (!err) {
                                        console.log('cart removed by user request!')
                                }
                                else {
                                        console.log('Error in Removing cart: '+err) 
                                }
                                var cart = {}
                                res.redirect('/book/booklist')
                            });   
                        } else {
                            res.redirect('/cart/list') 
                        }                        
                    })
                })                   
            })                               
        })          
    })

    // remove the whole cart
	router.post('/emptycart', function (req, res) {     
                
        Cart.findOne({ username :  req.user.username }, function(err, cart) {
            if (err){
                console.log('Error in getting cart: '+err)
            }
            // return item quantities to their respective books
            var booksToUpdate = []
            for(var i = 0, len = cart.items.length; i < len; i++) {
                    booksToUpdate.push(cart.items[i].bookId)
            }

            // Remove the cart from the database
            Cart.remove({ usernname :  req.user.username }, function(err) {
                if (!err) {
                        console.log('Cart removed by user request!')
                }
                else {
                        console.log('Error in Removing cart: '+err) 
                }
                for(var i = 0, len = booksToUpdate.length; i < len; i++) {

                    Book.findOne({_id: booksToUpdate[i]},function(err,book){
                        if(err){
                            console.log(err)
                        }
                        var cindex = -1
                        for(var j = 0, len = book.inCart.length; j < len; j++) {
                            if (book.inCart[j].username === req.user.username) {
                                cindex = j
                                break
                            }
                        }
                    
                        if (cindex == -1){
                            // Shouldn't go here
                        } else {
                            book.quantity = book.quantity + book.inCart[cindex].quantity
                            book.inCart.splice(cindex,1)
                        }
                        
                        book.save(function(err) {
                            if (err){
                                console.log('Error in Saving book: '+err)
                            }                       
                        })
                    })
                }                    
                req.session.itemsCount = 0;
                res.redirect('/book/booklist')
            })
        })       
         
    })

	return router
}

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}
