const dotenv = require('dotenv')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const isAuthorized = require('./middleware/auth');

const cors = require('cors')

// The following required for email templates in controller checkout.js
global.appRoot = path.resolve(__dirname);

const express = require('express')
const app = express()
app.use(cors())

//define shortcuts for required directories (used in templates, defined in layout.ejs)

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'))
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'))
app.use('/bootstrap-social', express.static(__dirname + '/node_modules/bootstrap-social'))
app.use('/bootstrap-icons', express.static(__dirname + '/node_modules/bootstrap-icons'))
app.use('/isotope', express.static(__dirname + '/node_modules/isotope-layout/dist/'))

// define local functions used in templates

app.locals.moment = require('moment')

app.locals.truncateText = function(text,length){
    var truncatedText = text.substring(0,length)
    return truncatedText
}

app.locals.displayPrice = function(price){
    var formattedPrice = price.toFixed(2)
    return "£" + formattedPrice
}

app.locals.buttonText = function(quantity){
    var bText
    if (quantity > 0) {
        bText = "Add To Basket"
    } else {
        bText = "Out Of Stock"
    }

    return bText
}

// define the session middleware
const session = require('express-session')

// this is in milliseconds, examples below
// 24 * 60 * 60 * 1000 = 24 hours
// 30 * 60 * 1000 = 30 minutes
// 20 * 1000 = 20 seconds
const timeout = 10 * 60 * 1000 // 10 minutes

app.use(session({
    secret: "thisismysecretkey",
    //cookie: { maxAge: 30000 },
    saveUninitialized: false,
    resave: false
}))

// other middleware
app.use(express.json())
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public'))) 
app.use(isAuthorized)

// set loggedIn and user data for navbar customization
app.use(function(req, res, next) {
    res.locals.loggedIn = (req.isAuthorized) ? true : false
    res.locals.user = req.user
    next()
})

// view engine setup
const expressLayouts = require('express-ejs-layouts')
app.set('view engine', 'ejs')
app.use(expressLayouts)

// define the routes
const userRoutes = require('./routes/user')
const bookRoutes = require('./routes/book')
const orderRoutes = require('./routes/order')
const cartRoutes = require('./routes/cart')
//const checkoutRoutes = require('./routes/checkout')

app.use('/user', userRoutes())
app.use('/book', bookRoutes())
app.use('/order', orderRoutes())
app.use('/cart', cartRoutes())
//app.use('/', checkoutRoutes())

// initial route is the login page
app.get('/', function(req, res) {
    res.redirect('/user/login')
})

// default route
app.get('*', function(req, res) {
    res.send('....oops - that page does not exist. Please try again x')
})

// connect to MongoDB
const configDB = require('./config/database.js')
configDB.connect()

// add user to test the database connection
// const test = require('./test/adduser')
// test.addUser()

dotenv.config();
const port = process.env.PORT || 3000

// start the server on selected port
app.listen(port, function(err){
    if (err) console.log(err)
    console.log("iBookShop listening on port", port)
})