const express = require('express')
const expressSession = require('express-session')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')

const app = express()

app.get('/', (req, res, err) => {
    res.send('This is my little Bookshop!!!')
})

app.get('/amit', (req, res, err) => {
    res.send('I love Amit - the most beautiful girl in the world!!!!')
})

dotenv.config();
const port = process.env.PORT || 3000

app.listen(port)
console.log(`iBookShop listening on port ${port}`)
