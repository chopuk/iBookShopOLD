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
        return qsRegex ? $(this).text().match( qsRegex ) : true;
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

// quick search regex
var qsRegex;

// use value of search field to filter
var $quicksearch = $('.quicksearch').keyup( debounce( function() {
  qsRegex = new RegExp( $quicksearch.val(), 'gi' );
  $books.isotope();
}, 200 ) );

// debounce so filtering doesn't happen every millisecond
function debounce( fn, threshold ) {
  var timeout;
  threshold = threshold || 100;
  return function debounced() {
    clearTimeout( timeout );
    var args = arguments;
    var _this = this;
    function delayed() {
      fn.apply( _this, args );
    }
    timeout = setTimeout( delayed, threshold );
  };
}