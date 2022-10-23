const express = require('express')
const router = express.Router()

const Book = require('../models/book')
const Cart = require('../models/cart')

module.exports = function(){
    
    // Show the users cart
    router.get('/list', async function(req, res) {
        
        if (!req.isAuthorized) {
            console.log("User not Authorized - redirecting to login page...")
            res.render('login')
        } else {
            try {
                const cart = await Cart.findOne({ username :  req.user.username })

                if (!cart){
                    req.session.itemsCount = 0
                    cart = {}
                } else {
                    req.session.itemsCount = cart.itemsCount
                    req.session.totalPrice = cart.total
                    req.session.cart = cart
                }
                
                res.render('cart',{
                    user: req.user,
                    cart: cart,
                    itemsCount: req.session.itemsCount
                })  
            } catch (error) {
                console.log(error)
                res.sendStatus(500)
            }       
        }   
	})

    // Add Item to cart
	router.post('/additem/:id', async function(req,res){
        
        try {
            
            const book = await Book.findOne({_id: req.params.id})

            // Get cart from database if it exists
            if (req.session.itemsCount > 0){
                const cart = await Cart.findOne({ username :  req.user.username })
    
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
                        cover: book.cover,
                        price: book.price, 
                        quantity:1, 
                        total: book.price,
                        totalInteger : parseInt(book.price*100)
                    })
                    cart.total = roundToTwo(cart.total + book.price)                        
                } else {
                    // item found - update existing entry
                    cart.items[index].quantity = cart.items[index].quantity + 1
                    cart.items[index].total = roundToTwo(cart.items[index].price * cart.items[index].quantity)
                    cart.items[index].totalInteger = parseInt(cart.items[index].total*100)
                    cart.total = roundToTwo(cart.total + cart.items[index].price)
                }
                cart.itemsCount = cart.itemsCount + 1
                cart.totalInteger = parseInt(cart.total*100)
                // save the cart
                await cart.save()
    
                // decrement the book quantity
                book.quantity = book.quantity - 1;

                await book.save()
    
                res.redirect('/cart/list')
    
                } else {
                    
                    req.session.itemsCount = req.session.itemsCount + 1
        
                    const newCart = new Cart({
                        username: req.user.username,
                        items: [],
                        total: 0,
                        itemsCount: 1
                    })
                    newCart.items.push({
                            bookId: book._id, 
                            title: book.title,
                            cover: book.cover,
                            price: book.price, 
                            quantity:1, 
                            total: book.price,
                            totalInteger : parseInt(book.price*100)
                    })
                    newCart.total = roundToTwo(book.price);
                    newCart.totalInteger = parseInt(newCart.total*100)
    
                    await newCart.save()
                    book.quantity = book.quantity - 1
                    await book.save()
     
                    res.redirect('/cart/list')
      
                }			

        } catch (error) {
            console.log(error)
            res.sendStatus(500)
        }     
        
	}) 

    // remove single item from cart
	router.post('/removeitem/:id', async function (req, res) {    
        
        req.session.itemsCount = req.session.itemsCount - 1
        
        try {
            
            const cart = await Cart.findOne({ username :  req.user.username })

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
            await cart.save()
            const book = await Book.findOne({_id: req.params.id})
            book.quantity = book.quantity + 1

            await book.save()
            if (req.session.itemsCount == 0 ) {                                  
                // Remove the cart from the database
                await Cart.deleteOne({ username :  req.user.username })
                res.redirect('/book/booklist') 
            } else {
                res.redirect('/cart/list') 
            }                   

        } catch (error) {
            console.log(error)
            res.sendStatus(500)           
        }     
                   
    })

    // remove the whole cart
	router.post('/emptycart', async function (req, res) {     

        try {
            
            const cart = await Cart.findOne({ username :  req.user.username })

            // return item quantities to their respective books
            var booksToUpdate = []
            for(var i = 0, len = cart.items.length; i < len; i++) {
                    booksToUpdate.push({ 
                        bookId: cart.items[i].bookId,
                        quantity: cart.items[i].quantity
                    })
            }
    
            // Remove the cart from the database
            await Cart.deleteOne({ usernname :  req.user.username })
    
            for(var i = 0, len = booksToUpdate.length; i < len; i++) {
    
                const book = await Book.findOne({_id: booksToUpdate[i].bookId})

                book.quantity = book.quantity + booksToUpdate[i].quantity
                
                await book.save()
            }                    
            req.session.itemsCount = 0
            req.session.cart = {}
            res.redirect('/book/booklist')  

        } catch (error) {
            console.log(error)
            res.sendStatus(500)     
        }       

    })

	return router
}

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}
