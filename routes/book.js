const express = require('express')
const router = express.Router()

const Book = require('../models/book')
const Cart = require('../models/cart')

module.exports = function(){
    
    // Get all books page
    router.get('/booklist', function(req, res) {
        
        if (!req.isAuthorized) {
            console.log("User not Authorized - redirecting to login page...")
            res.render('login')
        } else {
                    
            Book.find({}).sort([ [ 'title', 1 ] ]) // 1 for ascending, -1 for descending
                .exec( function(err,books){
                    if(err){
                        console.log(err)
                    }
                    books.forEach(function(book){
                        book.truncateText = book.truncateText(16)
                        book.category = book.categories[0].split('/')[0]
                        console.log(book.category)
                    })
                    // check if a cart exists for this user
                    Cart.findOne({ 'username' :  req.user.username }, 
                        function(err, cart) {
                            if (cart) {
                                console.log('Found cart for user.. setting itemsCount to: ' + cart.itemsCount)
                                req.session.itemsCount = cart.itemsCount            
                            } else {
                                req.session.itemsCount = 0
                            } 
                            res.render('books', {
                                user: req.user,
                                books: books,
                                itemsCount: req.session.itemsCount 
                            })
                        }
                    ) 
            })
        }
	})

    // Get book details page
    router.get('/bookdetails/:id', function(req, res) {
        
        Book.findOne({_id: req.params.id},function(err,book){
			if(err){
				console.log(err)
			}
			
			var model = {
                user: req.user,
				book: book
			}
			res.render('bookdetails', {model: model} )
		});    

	})

	return router
}