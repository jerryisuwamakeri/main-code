const fetch=require('node-fetch');
const admin = require('firebase-admin');
const addToWallet = require('../../common').addToWallet;
const UpdateBooking = require('../../common/sharedFunctions').UpdateBooking;
const request = require('request');

module.exports.render_checkout = async function (request, response) {
    const config = (await admin.database().ref('payment_settings/paymongo').once('value')).val();

    const API_URL = "https://api.paymongo.com/v1/checkout_sessions";
    const secret_key = config.secret_key;

    const allowed = ["PHP"];

    const refr = request.get('Referrer');
    const server_url = refr ? ((refr.includes('bookings') || refr.includes('addbookings') || refr.includes('userwallet'))? refr.substring(0, refr.length - refr.split("/")[refr.split("/").length - 1].length) : refr) : request.protocol + "://" + request.get('host') + "/";

    const order_id = request.body.order_id;
    
    const data = {
        "data": {
          "attributes": {
            "billing": {
                "name": request.body.first_name + " " + request.body.last_name,
                "email": request.body.email,
                "phone": request.body.mobile_no
            },
            "send_email_receipt": true,
            "show_description": false,
            "show_line_items": true,
            "reference_number": order_id,
            "line_items": [
              {
                "currency": allowed.includes(request.body.currency) ? request.body.currency : 'PHP',
                "amount": parseFloat(request.body.amount) * 100 ,
                "name": "Payment",
                "quantity": 1
              }
            ],
            "cancel_url": server_url + 'cancel',
            "payment_method_types": [
              "billease","card","dob","dob_ubp","gcash","grab_pay","paymaya"
            ],
            "success_url": server_url + 'paymongo-process?order_id=' + order_id,
          }
        }
    }

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization':  'Basic ' + Buffer.from(secret_key + ':').toString('base64'),
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(json => {
            if (json.data && json.data.attributes && json.data.attributes.checkout_url) {
                admin.database().ref('/paymongo/' + order_id).set(json.data.id)
                response.redirect(json.data.attributes.checkout_url);
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
    const config = (await admin.database().ref('payment_settings/paymongo').once('value')).val();
    const secret_key = config.secret_key;

    const order_id = req.query.order_id;
    if(order_id.length> 0){
        admin.database().ref('paymongo').child(order_id).once('value', paymongosnap => {
            const checkout_id = paymongosnap.val();
            const options = {
                'method': 'GET',
                'url': `https://api.paymongo.com/v1/checkout_sessions/${checkout_id}`,
                'headers': {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Basic ' + Buffer.from(secret_key + ':').toString('base64')
                },
            };
            request(options, (error, response) => {
                if(error){
                    res.redirect('/cancel');
                }
                if (response.body.length > 1) {
                    const json = JSON.parse(response.body);
                    if(json.data && json.data.attributes && json.data.attributes.payment_intent && json.data.attributes.payment_intent.attributes && json.data.attributes.payment_intent.attributes.status && json.data.attributes.payment_intent.attributes.status === 'succeeded'){
                        const transaction_id = json.data.attributes.payment_intent.id;
                        const amount = parseFloat(json.data.attributes.payment_intent.attributes.amount) / 100;
                        admin.database().ref('paymongo').child(order_id).remove();
                        admin.database().ref('bookings').child(order_id).once('value', snapshot => {
                            if(snapshot.val()){
                                const bookingData = snapshot.val();
                                UpdateBooking(bookingData,order_id,transaction_id,'paymongo');
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
        });
    } else{
        res.redirect('/cancel');
    }
};