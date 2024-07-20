const fetch=require('node-fetch');
const admin = require('firebase-admin');
const addToWallet = require('../../common').addToWallet;
const UpdateBooking = require('../../common/sharedFunctions').UpdateBooking;
const request = require('request');

module.exports.render_checkout = async function (request, response) {
    const config = (await admin.database().ref('payment_settings/razorpay').once('value')).val();

    const API_URL = "https://api.razorpay.com/v1/payment_links/";
    const KEY_ID = config.KEY_ID;
    const KEY_SECRET = config.KEY_SECRET;

    var amount = parseFloat(request.body.amount).toFixed(2);
    var email = request.body.email;
    var mobile_no = request.body.mobile_no;
    var first_name = request.body.first_name;
    var last_name = request.body.last_name;

    const refr = request.get('Referrer');
    const server_url = refr ? ((refr.includes('bookings') || refr.includes('addbookings') || refr.includes('userwallet'))? refr.substring(0, refr.length - refr.split("/")[refr.split("/").length - 1].length) : refr) : request.protocol + "://" + request.get('host') + "/";

    const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const randomKey = [...Array(4)].map(_ => c[~~(Math.random()*c.length)]).join(''); 

    let order_id = "";
    if(request.body.order_id.startsWith("wallet")){
        const idParts = request.body.order_id.split("-");
        for(let i = 0; i<idParts.length - 1; i++){
            order_id = order_id + idParts[i] + "-";
        }
        order_id = order_id + randomKey;
    }else{
        order_id = request.body.order_id + "-" + randomKey;
    }

    const data = {
        "amount": amount * 100,
        "currency": "INR",
        "reference_id": order_id,
        "description": order_id,
        "customer": {
            "name": first_name +  " " + last_name,
            "contact": mobile_no,
            "email": email
        },
        "callback_url": server_url + "razorpay-process",
        "callback_method": "get"
      };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(KEY_ID + ':' + KEY_SECRET).toString('base64'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(json => {
            if (json.short_url) {
                response.redirect(json.short_url)
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
    const config = (await admin.database().ref('payment_settings/razorpay').once('value')).val();

    const KEY_ID = config.KEY_ID;
    const KEY_SECRET = config.KEY_SECRET;

    const options = {
        'method': 'GET',
        'url': `https://api.razorpay.com/v1/payment_links/${req.query.razorpay_payment_link_id}/`,
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(KEY_ID + ':' + KEY_SECRET).toString('base64')
        },
    };

    request(options, (error, response) => {
        if(error){
            res.redirect('/cancel');
        }
        if (response.body.length > 1) {
            const data = JSON.parse(response.body);
            if(data.status==='paid'){
                let order_id = "";
                if(data.reference_id.startsWith("wallet")){
                    order_id = data.reference_id;
                } else {
                    const idParts = data.reference_id.split("-");
                    for(let i = 0; i<idParts.length - 1; i++){
                        order_id = order_id + idParts[i] + (i<(idParts.length-2)? "-":"");
                    }
                }
                const transaction_id = req.query.razorpay_payment_id;
                const amount = parseFloat(data.amount) / 100;
                admin.database().ref('bookings').child(order_id).once('value', snapshot => {
                  if(snapshot.val()){
                      const bookingData = snapshot.val();
                      UpdateBooking(bookingData,order_id,transaction_id,'razorpay');
                      res.redirect(`/success?order_id=${order_id}&amount=${amount}&transaction_id=${transaction_id}`);
                  }else{
                    if(order_id.startsWith("wallet")){
                    addToWallet(order_id.substr(7,order_id.length - 12), amount, order_id, transaction_id);
                    res.redirect(`/success?order_id=${order_id}&amount=${amount}&transaction_id=${transaction_id}`);
                    }else{
                    res.redirect('/cancel');
                    }
                  }
                });
            }else{
                res.redirect('/cancel');
            }
        } else {
            res.redirect('/cancel');
        }
    });
};