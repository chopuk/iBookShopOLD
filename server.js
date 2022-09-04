const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const app = express()

app.get('/', (req, res, err) => {
    res.send('This is my little Bookshop!!!')
})

dotenv.config();
const port = process.env.PORT || 3000

app.listen(port)
console.log(`iBookShop listening on port ${port}`)
