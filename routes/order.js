const express = require('express')
const router = express.Router()

const Order = require('../models/order')

module.exports = function(){
    
    // Get all orders page
    router.get('/myorders', async function(req, res) {
        
        if (!req.isAuthorized) {
            console.log("User not Authorized - redirecting to login page...")
            res.render('login')
        } else {
            try {
                const orders = await Order.find({ username: req.user.username})

                res.render('orders', {                    
                    user: req.user,
                    orders: orders,
                    itemsCount: req.session.itemsCount})

            } catch (error) {
                console.log(error)
                res.sendStatus(500)
            }  

        }
	})

	return router
}
