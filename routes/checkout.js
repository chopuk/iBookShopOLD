const User = require('../models/user')
const Cart = require('../models/cart')
const Order = require('../models/order')
const EmailTemplates = require('swig-email-templates')
const nodemailer = require('nodemailer')
var path = require('path')

const dotenv = require('dotenv')
dotenv.config()

const stripe = require('stripe')(process.env.STRIPE_API_KEY)

module.exports = function(router){
    
    // invoke stripe session to handle payments
    router.post('/buynow', async function(req, res) {

        if (!req.isAuthorized) {
            console.log("User not Authorized - redirecting to login page...")
            res.render('login')
        } else {
            try {
              const session = await stripe.checkout.sessions.create({
                line_items: req.session.cart.items.map( item => {
                  return {
                    price_data: {
                      currency: 'gbp',
                      product_data: {
                        name: item.title,
                        images: [`${process.env.IMAGES_URL}/images/${item.cover}`]
                      },
                      unit_amount: parseInt(item.price*100)
                    },
                    quantity: item.quantity
                  }
                }),
                mode: 'payment',
                success_url: `${process.env.IBOOKSHOP_URL}/${process.env.STRIPE_SUCCESS_PAGE}`,
                cancel_url: `${process.env.IBOOKSHOP_URL}/${process.env.STRIPE_CANCEL_PAGE}`,
            })
            
            res.redirect(303, session.url);
          } catch (error) {
            console.log(error)
            res.sendStatus(500)
          }

        }
	})

    // display success page
    router.get('/success', async function(req, res) {

      if (!req.isAuthorized) {
        console.log("User not Authorized - redirecting to login page...")
        res.render('login')
      } else {

        // stripe transaction was successful create order data and delete cart
        try {

          // Get cart 
          const cart = await Cart.findOne({ username :  req.user.username })
          
          // update the user sequence field
          req.user.orderSeq = req.user.orderSeq + 1
          await User.updateOne({ username: req.user.username }, { $set:{orderSeq: req.user.orderSeq } })

          // add the new order
          const newOrder = new Order()
          newOrder.orderNo = req.user.username + req.user.orderSeq.toString()
          newOrder.orderDate = new Date()
          newOrder.username = req.user.username
          newOrder.total = cart.total
          newOrder.totalInteger = cart.totalInteger
          newOrder.status = 'In Progress'
          newOrder.items = cart.items

          await newOrder.save()
          req.session.cart = {}
          req.session.itemsCount = 0

          // remove cart
          await Cart.deleteOne({ username : req.user.username })

          // Send confirmation email
          const email = req.user.email
          const customerName = req.user.name
          // initialise smtp
          var smtpTransport = nodemailer.createTransport({
              host: "smtp.mailgun.org",
              auth: {
                  user: process.env.MAILGUN_USER,
                  pass: process.env.MAILGUN_PASSWORD
              }
          })

          for(var i = 0; i < cart.items.length; i++) {
              cart.items[i].displayPrice = cart.items[i].price.toFixed(2)
              cart.items[i].displayTotal = cart.items[i].total.toFixed(2)
          }

          const amount = parseFloat(cart.totalInteger/100).toFixed(2)

          var templates = new EmailTemplates({root: path.join(global.appRoot,'emailTemplates')})
          var context = {
                          amount: amount,
                          items: cart.items
          }

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
                      console.log(error)
                  }else{
                      console.log("Message sent: " + info.messageId);
                  }  
                  smtpTransport.close()
              })

          })

          res.render('checkout-success', {
            totalPrice: req.session.totalPrice
          })

          } catch (error) {
              console.log(error)
              res.sendStatus(500)
          }  
      }      

	})

	return router
}