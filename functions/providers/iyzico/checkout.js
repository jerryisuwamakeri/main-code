const Iyzipay = require('iyzipay');
const admin = require('firebase-admin');
const addToWallet = require('../../common').addToWallet;
const UpdateBooking = require('../../common/sharedFunctions').UpdateBooking;
const fetch = require('node-fetch');

module.exports.render_checkout = async function (request, response) {
    const config = (await admin.database().ref('payment_settings/iyzico').once('value')).val();

    const API_URL = config.testing? "https://sandbox-api.iyzipay.com": "https://api.iyzipay.com";

    const allowed = ["TRY"];

    const refr = request.get('Referrer');
    const server_url = refr ? ((refr.includes('bookings') || refr.includes('addbookings') || refr.includes('userwallet'))? refr.substring(0, refr.length - refr.split("/")[refr.split("/").length - 1].length) : refr) : request.protocol + "://" + request.get('host') + "/";

    var iyzipay = new Iyzipay({
        apiKey: config.apiKey,
        secretKey: config.secretKey,
        uri: API_URL
    });

    var ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;

    if(ip.includes(",")){
        ip = ip.split(",")[0];
    }

    var address = "No Address";
    var city = "No City";
    var country = "No Country";

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
            city = json.city;
            country = json.country;
        } catch (error){
            console.log(error);
            response.redirect('/cancel');
        }
    }  

    var body = {
        "locale": "tr",
        "conversationId": request.body.order_id,
        "price": request.body.amount,
        "buyer": {
            "id": request.body.cust_id,
            "name": request.body.first_name,
            "surname": request.body.last_name,
            "identityNumber": request.body.cust_id,
            "email": request.body.email,
            "gsmNumber": request.body.mobile_no,
            "registrationAddress": address,
            "city": city,
            "country": country,
            "ip": ip
        },
        "billingAddress": {
            "address": address,
            "contactName": request.body.first_name + " " + request.body.last_name,
            "city": city,
            "country": country
        },
        "basketItems": [
            {
                "id": request.body.order_id,
                "price": request.body.amount,
                "name": "Cab Booking",
                "category1": "Taxi",
                "itemType": "VIRTUAL"
            }
        ],
        "callbackUrl": server_url + "iyzico-process?order_id=" + request.body.order_id,
        "currency": allowed.includes(request.body.currency) ? request.body.currency : 'TRY',
        "paidPrice": request.body.amount,
    };
    
    iyzipay.checkoutFormInitialize.create(body, (error, result) => {
        if(error){
            console.log(error);
            response.redirect('/cancel');
        }
        if(result && result.status && result.status === "success"){
            admin.database().ref('/iyzico/' +  request.body.order_id).set(result.token)
            response.redirect(result.paymentPageUrl);
        } else {
            response.redirect('/cancel');
        }
    });
};

module.exports.process_checkout = async function (request, response) {
    const config = (await admin.database().ref('payment_settings/iyzico').once('value')).val();

    const API_URL = config.testing? "https://sandbox-api.iyzipay.com": "https://api.iyzipay.com";

    var iyzipay = new Iyzipay({
        apiKey: config.apiKey,
        secretKey: config.secretKey,
        uri: API_URL
    });

    const order_id = request.query.order_id;

    if(order_id.length> 0){
        admin.database().ref('iyzico').child(order_id).once('value', iyzicosnap => {
            const token = iyzicosnap.val();
            if(token && token.length>10){
                iyzipay.checkoutForm.retrieve({token: token}, (error, result) => {
                    console.log(error, result);
                    if(error){
                        response.redirect('/cancel');
                    }
                    if (result && result.status && result.status==='success' && result.paymentStatus && result.paymentStatus === 'SUCCESS') {
                        const transaction_id = result.paymentId;
                        const amount = result.price;
                        admin.database().ref('iyzico').child(order_id).remove();
                        admin.database().ref('bookings').child(order_id).once('value', snapshot => {
                            if(snapshot.val()){
                                const bookingData = snapshot.val();
                                UpdateBooking(bookingData,order_id,transaction_id,'iyzico');
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
                });
            } else{
                response.redirect('/cancel');  
            }
        });
    } else{
        response.redirect('/cancel');
    }
};