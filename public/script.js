console.log('==== entering js file =====')

var stripe = Stripe('pk_test_zN39pmedukmCGItSySxRgJc600FmsWDDE8');

document.getElementById('checkout').addEventListener("click", function() {
    console.log('======= checkout clicked =======')
    stripe.redirectToCheckout({
        sessionId: sessionStripeID
    }).then(function(result) {

    });
})