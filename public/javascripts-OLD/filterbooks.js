$( '#searchable-title' ).searchable({
    searchField: '#title-search',
    selector: '.book',
    childSelector: '.title',
    show: function( elem ) {
        elem.slideDown(100);
    },
    hide: function( elem ) {
        elem.slideUp( 100 );
    },
    clearOnLoad: true
})

$( '#searchable-category' ).searchable({
    searchField: '#category-search',
    selector: '.book',
    childSelector: '.categories',
    show: function( elem ) {
        elem.slideDown(100);
    },
    hide: function( elem ) {
        elem.slideUp( 100 );
    },
    clearOnLoad: true
})



