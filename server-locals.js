// define local functions used in templates

module.exports = function(app){

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

}