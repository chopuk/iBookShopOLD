const express = require('express')
const router = express.Router()

const Order = require('../models/order')

module.exports = function(){
    
    // Get all orders page
    router.get('/myorders', function(req, res) {
        
        if (!req.isAuthorized) {
            console.log("User not Authorized - redirecting to login page...")
            res.render('login')
        } else {
                    
            Order.find({ username: req.user.username},function(err,orders) {

                if(err){
                    console.log(err)
                }

                res.render('orders', {                    
                    user: req.user,
                    orders: orders,
                    itemsCount: req.session.itemsCount})
            })
        }
	})

	return router
}
