const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const initPassport = require('./passport/init');
const express = require('express')
const expressSession = require('express-session')
const app = express()

const Session = require('./models/session')
const Cart = require('./models/cart')
const Book = require('./models/book')

const configDB = require('./config/database.js')
configDB.connect();
const MongoStore = require('connect-mongo')

//const test = require('./test/adduser')
//test.addUser()

const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');

// The following required for email templates in controller checkout.js
global.appRoot = path.resolve(__dirname);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'))
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'))
app.use('/bootstrap-social', express.static(__dirname + '/node_modules/bootstrap-social'))

app.locals.truncateText = function(text,length){
    var truncatedText = text.substring(0,length)
    return truncatedText
};

app.locals.displayPrice = function(price){
    var formattedPrice = price.toFixed(2)
    return "£" + formattedPrice
};

app.locals.moment = require('moment')

app.use(expressSession({
    secret: 'iamanamazingprogrammer', 
    resave: false, 
    saveUninitialized: false
    //store: new MongoStore({ mongoUrl: mongoose.connection,
    //                        ttl: 10 * 60 }) // 10 minutes session timeout
}));

// Configuring Passport
app.use(passport.initialize())
app.use(passport.session())
initPassport(passport)
        
app.use(function(req, res, next) {
    //res.locals.user = req.user
    res.locals.loggedIn = (req.user) ? true : false
    next()
    })

app.use('/', userRoutes(passport))
//app.use('/', bookRoutes(passport))
app.use('/', cartRoutes(passport))
app.use('/', checkoutRoutes(passport))


app.get('/', (req, res, err) => {
    res.send('This is my little Bookshop!!!')
})

app.get('/amit', (req, res, err) => {
    res.send('I love Amit - she the most beautiful girl in the world!!!!')
})

app.get('/megan', (req, res, err) => {
    res.send('My a little beauty!')
})

dotenv.config();
const port = process.env.PORT || 3000

app.listen(port)
console.log(`iBookShop listening on port ${port}`)
