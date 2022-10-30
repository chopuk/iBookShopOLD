const express = require('express')

// define directory shortcuts for layout.ejs

module.exports = function(app){
    
    app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'))
    app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'))
    app.use('/bootstrap-social', express.static(__dirname + '/node_modules/bootstrap-social'))
    app.use('/bootstrap-icons', express.static(__dirname + '/node_modules/bootstrap-icons'))
    app.use('/isotope', express.static(__dirname + '/node_modules/isotope-layout/dist/'))
    app.use('/stripe', express.static(__dirname + '/node_modules/stripe/lib/'))

}