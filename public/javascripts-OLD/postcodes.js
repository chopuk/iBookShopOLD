$('#btnAddress').click(function(){
    $('#addressDiv').fadeIn(2000);
});
// ak_jc9apsxcDQmKM4bps5JG1ZaTz0g7I    hotmail
// ak_ilu0kl20R8i0m1RL8Aq5Y13GB0mAq    gmail
$('#lookup_field').setupPostcodeLookup({
    api_key: 'ak_jc9apsxcDQmKM4bps5JG1ZaTz0g7I',
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
