// Define all the separate routing files
const bookRoutes     = require('./book')
const userRoutes     = require('./user')
const orderRoutes    = require('./order')
const cartRoutes     = require('./cart')
const checkoutRoutes = require('./checkout')

module.exports = function(app,router){
    
    app.use('/user',     userRoutes(router))
    app.use('/book',     bookRoutes(router))
    app.use('/cart',     cartRoutes(router))
    app.use('/order',    orderRoutes(router))
    app.use('/checkout', checkoutRoutes(router))   

    // initial route is the login page
    app.get('/', function(req, res) {
        res.redirect('/user/login')
    })

    // default route
    app.get('*', function(req, res) {
        res.send('....oops - that page does not exist. Please try again x')
    })

}