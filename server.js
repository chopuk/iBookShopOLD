const dotenv = require('dotenv')
const path = require('path')

// the following required for email templates in controller checkout.js
global.appRoot = path.resolve(__dirname)

// define the express app
const express = require('express')
const app = express()

// include cross origin resource sharing middleware
const cors = require('cors')
app.use(cors())

//define shortcuts for required directories (used in templates, defined in layout.ejs)
require('./server-directories')(app)

// define local functions used in ejs templates
require('./server-locals')(app)

// view engine setup
const expressLayouts = require('express-ejs-layouts')
app.set('view engine', 'ejs')
app.use(expressLayouts)

// configure the express session 
require('./server-session')(app)

// define the session middleware
require('./server-middleware')(app)

// define all the routes
require('./routes/allRoutes')(app)

// connect to MongoDB
const configDB = require('./config/database.js')
configDB.connect()

dotenv.config();
const port = process.env.PORT || 3000

// start the server on selected port
app.listen(port, (err) => {
    if (err) console.log(err)
    console.log("iBookShop listening on port", port)
})