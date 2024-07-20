const fetch=require('node-fetch');
const crypto = require('crypto');
const admin = require('firebase-admin');
const addToWallet = require('../../common').addToWallet;
const UpdateBooking = require('../../common/sharedFunctions').UpdateBooking;

module.exports.render_checkout = async function (request, response) {
    const config = (await admin.database().ref('payment_settings/wipay').once('value')).val();

    const API_URL = "https://jm.wipayfinancial.com/plugins/payments/request";
    const ACCOUNT_NO = config.ACCOUNT_NO;

    const order_id = request.body.order_id;
    const amount = parseFloat(request.body.amount).toFixed(2);
    const currency = request.body.currency;
    const refr = request.get('Referrer');
    const server_url = refr ? ((refr.includes('bookings') || refr.includes('addbookings') || refr.includes('userwallet'))? refr.substring(0, refr.length - refr.split("/")[refr.split("/").length - 1].length) : refr) : request.protocol + "://" + request.get('host') + "/";

    const data = {
        "account_number": ACCOUNT_NO,
        "avs": "0",
        "currency": currency,
        "country_code": "JM",
        "environment": config.testing? "sandbox": "live",
        "fee_structure": "customer_pay",
        "method": "credit_card",
        "order_id": (order_id.startsWith("wallet") ? "wlt-" : "bkg-") + Math.floor((Math.random() * 10000000000) + 1),
        "origin": "dashapp",
        "total": amount,
        "response_url": server_url + "wipay-process",
        "data": `{"order_id":"${order_id}","amount":"${amount}"}`
    }

    var formBody = [];
    for (var property in data) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: formBody
    })
        .then(res => res.json())
        .then(json => {
            if (json.url) {
                response.redirect(json.url)
            } else {
                response.redirect('/cancel');
            }
            return true;
        })
        .catch(error=>{
            console.log(error);
            response.redirect('/cancel');
        });
};

module.exports.process_checkout = async function (req, res) {
    const config = (await admin.database().ref('payment_settings/wipay').once('value')).val();
    const API_KEY = config.API_KEY;

    if (req.query.status && req.query.status === 'success') {
        const transaction_id = req.query.transaction_id;
        const hash = req.query.hash;
        const data = JSON.parse(JSON.parse(req.query.data));
        const order_id = data.order_id;
        const amount = data.amount;
        const calc_hash = crypto.createHash('md5').update(transaction_id + amount + API_KEY).digest('hex');
        if(hash === calc_hash){
            if (order_id.startsWith("wallet")) {
                addToWallet(order_id.substr(7,order_id.length - 12), amount, order_id, transaction_id);
                res.redirect(`/success?order_id=${order_id}&amount=${amount}&transaction_id=${transaction_id}`);
            } else {
                admin.database().ref('bookings').child(order_id).once('value', snapshot => {
                    if (snapshot.val()) {
                        const bookingData = snapshot.val();
                        UpdateBooking(bookingData, order_id, transaction_id, 'wipay');
                        res.redirect(`/success?order_id=${order_id}&amount=${amount}&transaction_id=${transaction_id}`);
                    } else {
                        res.redirect('/cancel');
                    }
                });
            }
        } else {
            res.redirect('/cancel');
        }
    } else {
        res.redirect('/cancel');
    }
};
