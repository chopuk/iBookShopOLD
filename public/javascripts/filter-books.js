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
    }      
})

// filter books on button click
$('.filter-button-group').on( 'click', 'button', function() {
    var filterValue = $(this).attr('data-filter')
    $books.isotope({ filter: filterValue })
})

// sort books on button click
$('.sort-by-button-group').on( 'click', 'button', function() {
    var sortValue = $(this).attr('data-sort-value')
    $books.isotope({ sortBy: sortValue })
})
