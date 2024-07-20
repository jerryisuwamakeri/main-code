
const admin = require('firebase-admin');
const addToWallet = require('../../common').addToWallet;
const UpdateBooking = require('../../common/sharedFunctions').UpdateBooking;
const fetch=require('node-fetch');
const request = require('request');

module.exports.render_checkout = async function (request, response) {
    const config = (await admin.database().ref('payment_settings/paystack').once('value')).val();
    const PAYSTACK_SECRET_KEY = config.PAYSTACK_SECRET_KEY;

    const allowed = ["GHS", "NGN", "ZAR", "KES"];

    const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const randomKey = [...Array(4)].map(_ => c[~~(Math.random()*c.length)]).join(''); 

    const refr = request.get('Referrer');
    const server_url = refr ? ((refr.includes('bookings') || refr.includes('addbookings') || refr.includes('userwallet'))? refr.substring(0, refr.length - refr.split("/")[refr.split("/").length - 1].length) : refr) : request.protocol + "://" + request.get('host') + "/";

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
        "amount": parseFloat(request.body.amount).toFixed(2) * 100,
        "email": request.body.email,
        "currency": allowed.includes(request.body.currency) ? request.body.currency : 'NGN',
        "reference": order_id,
        "callback_url": server_url + "paystack-process"  
    };

    fetch("https://api.paystack.co/transaction/initialize", {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + PAYSTACK_SECRET_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
        if (json.data && json.status && json.data.authorization_url) {
            response.redirect(json.data.authorization_url)
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
    const config = (await admin.database().ref('payment_settings/paystack').once('value')).val();
    const PAYSTACK_SECRET_KEY = config.PAYSTACK_SECRET_KEY;

    const options = {
        'method': 'GET',
        'url': `https://api.paystack.co/transaction/verify/${req.query.reference}`,
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + PAYSTACK_SECRET_KEY
        },
    };

    request(options, (error, response) => {
        if(error){
            res.redirect('/cancel');
        }
        if (response.body.length > 1) {
            const json = JSON.parse(response.body);
            if(json.status && json.data.status==='success'){
                let order_id = "";
                if(json.data.reference.startsWith("wallet")){
                    order_id = json.data.reference;
                } else {
                    const idParts = json.data.reference.split("-");
                    for(let i = 0; i<idParts.length - 1; i++){
                        order_id = order_id + idParts[i] + (i<(idParts.length-2)? "-":"");
                    }
                }
                const transaction_id = req.query.trxref;
                const amount = parseFloat(json.data.amount) / 100;
                admin.database().ref('bookings').child(order_id).once('value', snapshot => {
                  if(snapshot.val()){
                      const bookingData = snapshot.val();
                      UpdateBooking(bookingData,order_id,transaction_id,'paystack');
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