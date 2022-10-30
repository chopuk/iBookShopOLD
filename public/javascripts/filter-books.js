// The books list page can be:
// 1. filtered by Genre ( Computer, Television etc)
// 2. sorted by Price ( ascending and descending )
// 3. sorted by Title ( ascending )
// 4. filtered by a Search field which searches the Title field

// All this is accomplished by the isotope.js plugin.
// The code below is taken from their documentation
// and modified to meet the needs of the site.
// There is a nice animation as the books are filtered!

// quick search regex
var qsRegex
var filterValue

// initialise Isotope plugin
var $books = $('#books-list').isotope({
    itemSelector: '.book-item',
    sortAscending: {
        title: true,
        justprice: true,
        justpricedesc: false
    },
    getSortData: {
        title: '.title',
        justprice: '.justprice parseFloat',
        justpricedesc: '.justpricedesc parseFloat'
    },
    filter: function() {
        var searchResult = qsRegex ? $(this).text().match( qsRegex ) : true
        var filterResult = filterValue ? $(this).is(filterValue) : true
        return searchResult && filterResult
    }      
})

// filter books from dropdown
$('#selectFilter').on('change',function(){
  filterValue = $(this).val()
  $books.isotope()
})

// filter books from dropdown
$('#selectSort').on('change', function(){
  const sortValue = $(this).val()
  $books.isotope({ sortBy: sortValue})
})

// use value of search field to filter
$('.quicksearch').on('keyup', function() {
  qsRegex = new RegExp( $(this).val(), 'gi' )
  $books.isotope()
})