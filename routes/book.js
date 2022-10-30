const Book = require('../models/book')

module.exports = function(router){
    
    // Get all books page
    router.get('/booklist', async function(req, res) {
        
        // protect this route if the user hasn't logged in yet
        if (!req.isAuthorized) {
            console.log("User not Authorized - redirecting to login page...")
            res.render('login')
        } else {

            try {
                const books = await Book.find({}).sort([ [ 'title', 1 ] ]) // 1 for ascending, -1 for descending
                books.forEach(function(book){
                    book.truncateText = book.truncateText(16)
                })
                res.render('books', {
                    user: req.user,
                    books: books,
                    itemsCount: req.session.itemsCount 
                })
            } catch(error) {
                console.log(error)
                res.sendStatus(500)
            }

        }

	})

    // Get book details page
    router.get('/bookdetails/:id', async function(req, res) {

         // protect this route if the user hasn't logged in yet
         if (!req.isAuthorized) {
            console.log("User not Authorized - redirecting to login page...")
            res.render('login')
        } else {

            try {
                const book = await Book.findOne({_id: req.params.id})
                res.render('bookdetails', {
                    user: req.user,
                    book: book,
                    itemsCount: req.session.itemsCount
                })
            } catch (error) {
                console.log(error)
                res.sendStatus(500)
            }
        }
        
	})

	return router
}