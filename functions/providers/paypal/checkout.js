const request = require('request')
const templateLib = require('./template');
const admin = require('firebase-admin');
const addToWallet = require('../../common').addToWallet;
const UpdateBooking = require('../../common/sharedFunctions').UpdateBooking;

module.exports.render_checkout = async function(request, response){
    const config = (await admin.database().ref('payment_settings/paypal').once('value')).val();
    const paypal_client_id = config.paypal_client_id;

    var order_id = request.body.order_id;
    var amount = request.body.amount;
    var currency = request.body.currency;
    const refr = request.get('Referrer');
    const server_url = refr ? ((refr.includes('bookings') || refr.includes('addbookings') || refr.includes('userwallet'))? refr.substring(0, refr.length - refr.split("/")[refr.split("/").length - 1].length) : refr) : request.protocol + "://" + request.get('host') + "/";
    response.send(templateLib.getTemplate(server_url,paypal_client_id,order_id,amount,currency));
};

module.exports.process_checkout = async function (req, res) {
    const config = (await admin.database().ref('payment_settings/paypal').once('value')).val();
    const paypal_client_id = config.paypal_client_id;
    const paypal_secret = config.paypal_secret;
    const paypal_endpoint = config.testing? 'https://api-m.sandbox.paypal.com': 'https://api-m.paypal.com';

    const options = {
        'method': 'GET',
        'url': paypal_endpoint + '/v2/checkout/orders/' + req.query.id,
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(paypal_client_id + ':' + paypal_secret).toString('base64')
        },
    };
    request(options, (error, response) => {
        if(error){
            res.redirect('/cancel');
        }
        if (response.body.length > 1) {
            const data = JSON.parse(response.body);
            if(data.status==='COMPLETED'){
                const order_id = req.query.order_id;
                const transaction_id = req.query.id;
                const amount = req.query.amount;
                admin.database().ref('bookings').child(order_id).once('value', snapshot => {
                  if(snapshot.val()){
                      const bookingData = snapshot.val();
                      UpdateBooking(bookingData,order_id,transaction_id,'paypal');
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
}
