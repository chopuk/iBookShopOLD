var express = require('express');
var router = express.Router();

var Book = require('../models/book');
var Category = require('../models/category');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
}

module.exports = function(){

	/* GET index page. */
	router.get('/', function(req, res) {       

        req.session.itemsCount = req.session.itemsCount || 0;
        req.session.categoryList = req.session.categoryList || [];
        req.session.mainCategories = req.session.mainCategories || []; // NEEDED FOR OPENSHIFT ****
        
        req.session.currentFilter = 'None';
        
        Category.find({parent: 'none'},function(err,categories){
			if(err){
				console.log(err);
			}
            
            for (i = 0; i < categories.length; i++) { 
                req.session.categoryList[i] = {category:"", totalBooks:0, subcategory:[]};
                req.session.categoryList[i].category = categories[i].name;
                req.session.mainCategories.push(categories[i].name); // NEEDED FOR OPENSHIFT ****
                Category.find({parent: categories[i].name},function(err,subcategories){    
                    if(err){
				        console.log(err);
			        } 
                    var totalCount =0;      
                    //var index = req.session.categoryList.findIndex(x => x.category==subcategories[0].parent); // THIS DOESNT WORK ON OPENSHIFT!!!
                    var index = req.session.mainCategories.indexOf(subcategories[0].parent); // NEEDED FOR OPENSHIFT ****
                    for (j = 0; j < subcategories.length; j++) {                   
                        req.session.categoryList[index].subcategory.push({name:subcategories[j].name,bookCount:subcategories[j].bookCount});
                        totalCount = totalCount + subcategories[j].bookCount;
                    }
                    req.session.categoryList[index].totalBooks = totalCount;
                });
            }

            Book.find({featured:true},function(err,books){
                if(err){
                    console.log(err);
                }
                books.forEach(function(book){
                    book.truncateText = book.truncateText(16); 
                });
                var model = {
                    user: req.user,
                    categoryList : req.session.categoryList,
                    books: books,
                    itemsCount: req.session.itemsCount,
                    message: req.flash('message'),
                    filter: req.session.currentFilter				 
                }
                res.render('bookviews/index', model);
            });     
		});

	});
    
    // Get all books page
    router.get('/books', function(req, res) {
        
        req.session.itemsCount = req.session.itemsCount || 0;
        req.session.currentFilter = 'None';
                
        Book.find({},function(err,books){
            if(err){
                console.log(err);
            }
            books.forEach(function(book){
                book.truncateText = book.truncateText(16); 
            });
            var model = {
                user: req.user,
                categoryList : req.session.categoryList,
                books: books,
                itemsCount: req.session.itemsCount,
                message: req.flash('message'),
                filter: req.session.currentFilter				 
            }
            res.render('bookviews/books', model);
        });     

	});
    
    // Get book details page
    router.get('/books/details/:id', function(req, res) {
        
        req.session.itemsCount = req.session.itemsCount || 0;
        
        Book.findOne({_id: req.params.id},function(err,book){
			if(err){
				console.log(err);
			}
			
			var model = {
                user: req.user,
                categoryList : req.session.categoryList,
				book: book,
                itemsCount: req.session.itemsCount,
                message: req.flash('message'),
                filter: req.session.currentFilter
			};
			res.render('bookviews/bookdetails',model);
		});     

	});
    
    // Get books by category/subcategory
    router.get('/search/:category/:subcategory?', function(req, res) {
        
        req.session.itemsCount = req.session.itemsCount || 0;
                    
        if (!req.params.subcategory) {
            var search = "\^" + req.params.category;
            req.session.currentFilter = req.params.category;
            req.session.currentFilterUrl = '/search/' + req.params.category;
        } else {
            var search = "\^" + req.params.category + "\/" + req.params.subcategory;
            req.session.currentFilter = req.params.category + '/' + req.params.subcategory;
            req.session.currentFilterUrl = '/search/' + req.params.category  + '/' + req.params.subcategory;
        }
        var pattern = new RegExp(search); 
        Book.find({categories: pattern},function(err,books){
            if(err){
                console.log(err);
            }
            books.forEach(function(book){
                book.truncateText = book.truncateText(16); 
            });
            var model = {
                user: req.user,
                categoryList : req.session.categoryList,
                books: books,
                itemsCount: req.session.itemsCount,
                message: req.flash('message'),
                filter: req.session.currentFilter				 
            }
            res.render('bookviews/books', model);
        });     

	});
    
    // Get books by price (lt)
    router.get('/search/price/lt/:price', function(req, res) {
        
        req.session.itemsCount = req.session.itemsCount || 0;
        req.session.currentFilter = 'Price up to £' + req.params.price + '.00';
        req.session.currentFilterUrl = '/search/price/lt/' + req.params.price ;
        
        var priceLimit = Number(req.params.price);
            
        Book.find({price: { $lte: priceLimit }},function(err,books){
            if(err){
                console.log(err);
            }
            books.forEach(function(book){
                book.truncateText = book.truncateText(16); 
            });
            var model = {
                user: req.user,
                categoryList : req.session.categoryList,
                books: books,
                itemsCount: req.session.itemsCount,
                message: req.flash('message'),
                filter: req.session.currentFilter			 
            }
            res.render('bookviews/books', model);
        });     

	});
    
    // Get books by price (gt)
    router.get('/search/price/gt/:price', function(req, res) {
        
        req.session.itemsCount = req.session.itemsCount || 0;
        req.session.currentFilter = 'Price over £' + req.params.price + '.00';
        req.session.currentFilterUrl = '/search/price/gt/' + req.params.price ;
        
        var priceLimit = Number(req.params.price);
            
        Book.find({price: { $gte: priceLimit }},function(err,books){
            if(err){
                console.log(err);
            }
            books.forEach(function(book){
                book.truncateText = book.truncateText(16); 
            });
            var model = {
                user: req.user,
                categoryList : req.session.categoryList,
                books: books,
                itemsCount: req.session.itemsCount,
                message: req.flash('message'),
                filter: req.session.currentFilter			 
            }
            res.render('bookviews/books', model);
        });     

	});
    
    // About Us
    router.get('/about', function(req, res) {
        
        req.session.itemsCount = req.session.itemsCount || 0;
        
        var model = {
            user: req.user,
            categoryList : req.session.categoryList,
            itemsCount: req.session.itemsCount,
            message: req.flash('message'),
            filter: req.session.currentFilter			 
        }
        res.render('about', model);
   });     

	return router;
}
