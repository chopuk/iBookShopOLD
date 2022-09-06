$('.btnChangeAddress').click(function(){
    $('#changeAddress').fadeIn(2000);
});

$('#lookup_field_change').setupPostcodeLookup({
    api_key: 'ak_ilu0kl20R8i0m1RL8Aq5Y13GB0mAq',
    output_fields: {
        line_1: '#line_1',
        line_2: '#line_2',
        line_3: '#line_3',
        address1: '#address1',
        post_town: '#posttown',
        postcode: '#postcode'
    },
    input: '#searchPostcode',
    button: '#btnAddress'
});