Stripe.setPublishableKey('pk_test_maRtZ2uTPZf2XpvUfAMCDcDd');
  
var $form = $('#form');

$form.on('submit', function() {
    $('.messagetext').empty();
    $('.divmessage').hide();

    // First submit the card information to Stripe to get back a token
    Stripe.card.createToken($form, stripeResponseHandler);
    return false;
});

function stripeResponseHandler(status, response) {
    var $form = $('#form');
    console.log('form=' + $form);
    if (response.error) {
        // Show the errors on the form
        $('.messagetext').append(response.error.message);
        $form.find('button').prop('disabled', false);
        $('.divmessage').fadeIn(2000);
    } else {
        // response contains id and card, which contains additional card details
        var token = response.id;
        // Insert the token and amount into the form so it gets submitted to the server
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));
        $form.get(0).submit();
    }
}