var express = require('express');
var router = express.Router();

const stripe = require('stripe')('sk_test_YmYC2PdFW47Jn2IhaIbft7go00SjnzILE6');

var dataBike = [
    { name: "BIK045", url: "/images/bike-1.jpg", price: 679 },
    { name: "ZOOK07", url: "/images/bike-2.jpg", price: 999 },
    { name: "TITANS", url: "/images/bike-3.jpg", price: 799 },
    { name: "CEWO", url: "/images/bike-4.jpg", price: 1300 },
    { name: "AMIG039", url: "/images/bike-5.jpg", price: 479 },
    { name: "LIK099", url: "/images/bike-6.jpg", price: 869 },
]


/* GET home page. */
router.get('/', function(req, res, next) {

    if (req.session.dataCardBike == undefined) {
        req.session.dataCardBike = []
    }

    res.render('index', { dataBike: dataBike });
});

router.get('/shop', async function(req, res, next) {


    var alreadyExist = false;

    for (var i = 0; i < req.session.dataCardBike.length; i++) {
        if (req.session.dataCardBike[i].name == req.query.bikeNameFromFront) {
            req.session.dataCardBike[i].quantity = Number(req.session.dataCardBike[i].quantity) + 1;
            alreadyExist = true;
        }
    }

    if (alreadyExist == false) {
        req.session.dataCardBike.push({
            name: req.query.bikeNameFromFront,
            url: req.query.bikeImageFromFront,
            price: req.query.bikePriceFromFront,
            quantity: 1
        })
    }

    //PAYMENT

    stripeCard = [];

    for (var i = 0; i < req.session.dataCardBike.length; i++) {
        stripeCard.push({
            name: req.session.dataCardBike[i].name,
            amount: req.session.dataCardBike[i].price * 100,
            currency: 'eur',
            quantity: req.session.dataCardBike[i].quantity,
        })
    }
    console.log(stripeCard)
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: stripeCard,
        success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:3000/cancel',
    });

    sessionStripeID = session.id;

    //end PAYMENT


    res.render('shop', { dataCardBike: req.session.dataCardBike, sessionStripeID });
});

router.get('/delete-shop', function(req, res, next) {

    req.session.dataCardBike.splice(req.query.position, 1)

    res.render('shop', { dataCardBike: req.session.dataCardBike })
})

router.post('/update-shop', function(req, res, next) {

    var position = req.body.position;
    var newQuantity = req.body.quantity;

    req.session.dataCardBike[position].quantity = newQuantity;

    res.render('shop', { dataCardBike: req.session.dataCardBike })
})

module.exports = router;