const admin = require('firebase-admin');
const addToWallet = require('../../common').addToWallet;
const UpdateBooking = require('../../common/sharedFunctions').UpdateBooking;
const fetch = require('node-fetch');

module.exports.render_checkout = async function (request, response) {
    const config = (await admin.database().ref('payment_settings/slickpay').once('value')).val();
    const API_URL = config.testing? "https://devapi.slick-pay.com/api/v2/users/invoices": "https://prodapi.slick-pay.com/api/v2/users/invoices";
    const refr = request.get('Referrer');
    const server_url = refr ? ((refr.includes('bookings') || refr.includes('addbookings') || refr.includes('userwallet'))? refr.substring(0, refr.length - refr.split("/")[refr.split("/").length - 1].length) : refr) : request.protocol + "://" + request.get('host') + "/";

    var ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;

    if(ip.includes(",")){
        ip = ip.split(",")[0];
    }

    var address = "No Address";

    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {  
        try {
            const res = await fetch("http://ip-api.com/json/" + ip, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const json = await res.json();
            address = json.city + ", "  + json.regionName  +  ", "  + json.country;
        } catch (error){
            console.log(error);
            response.redirect('/cancel');
        }
    }  

    let body = {
        "amount": request.body.amount,
        "firstname": request.body.first_name,
        "lastname": request.body.last_name,
        "email": request.body.email,
        "phone": request.body.mobile_no,
        "address": address,
        "url": server_url + "slickpay-process?order_id=" + request.body.order_id,
        "items":[
              {
                  "name": "Cab Booking",
                  "price": request.body.amount,
                  "quantity": 1
              }
        ]
    }

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + config.publicKey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .then(json => {
            if (json.success && json.success === 1 && json.url && json.id) {
                admin.database().ref('/slickpay/' +  request.body.order_id).set(json.id);
                response.redirect(json.url);
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

module.exports.process_checkout = async function (request, response) {
    const order_id = request.query.order_id;
    if(order_id.length> 0){
        const config = (await admin.database().ref('payment_settings/slickpay').once('value')).val();
        admin.database().ref('slickpay').child(order_id).once('value', slicksnap => {
            const transaction_id = slicksnap.val();
            if(transaction_id && transaction_id > 0){
                const API_URL = config.testing? ("https://devapi.slick-pay.com/api/v2/users/invoices/" + transaction_id) : ("https://prodapi.slick-pay.com/api/v2/users/invoices/" + transaction_id);
                fetch(API_URL, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + config.publicKey,
                        'Accept': 'application/json',
                    }
                })
                    .then(res => res.json())
                    .then(json => {
                        if (json.success && json.success === 1 && json.completed && json.completed===1 && json.data && json.data.amount) {
                            const amount = json.data.amount;
                            admin.database().ref('slickpay').child(order_id).remove();
                            admin.database().ref('bookings').child(order_id).once('value', snapshot => {
                                if(snapshot.val()){
                                    const bookingData = snapshot.val();
                                    UpdateBooking(bookingData,order_id,transaction_id,'slickpay');
                                    response.redirect(`/success?order_id=${order_id}&amount=${amount}&transaction_id=${transaction_id}`);
                                }else{
                                    if(order_id.startsWith("wallet")){
                                        addToWallet(order_id.substr(7,order_id.length - 12), amount, order_id, transaction_id);
                                        response.redirect(`/success?order_id=${order_id}&amount=${amount}&transaction_id=${transaction_id}`);
                                    }else{
                                        response.redirect('/cancel');
                                    }
                                }
                            });
                        } else {
                            response.redirect('/cancel');
                        }
                        return true;
                    })
                    .catch(error=>{
                        console.log(error);
                        response.redirect('/cancel');
                    });
            } else{
                response.redirect('/cancel');  
            }
        });
    } else{
        response.redirect('/cancel');
    }
};