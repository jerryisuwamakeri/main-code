const braintree = require("braintree");
const templateLib = require('./template');
const admin = require('firebase-admin');
const addToWallet = require('../../common').addToWallet;
const UpdateBooking = require('../../common/sharedFunctions').UpdateBooking;

module.exports.render_checkout = async function(request, response){
    const config = (await admin.database().ref('payment_settings/braintree').once('value')).val();
    const gateway = braintree.connect({
        environment: config.testing? braintree.Environment.Sandbox: braintree.Environment.Production, 
        merchantId: config.merchantId, 
        publicKey: config.publicKey,
        privateKey: config.privateKey
    });

    var order_id = request.body.order_id;
    var amount = request.body.amount;
    var currency = request.body.currency;

    gateway.clientToken.generate({
    }, (err, res) => {
        if (err) {
            response.send({ "error": err });
        } else if (res) {
            response.send(templateLib.getTemplate(res.clientToken,order_id,amount,currency));
        } else {
            response.send({ "error": "Some other error" });
        }
    });
};

module.exports.process_checkout = async function(request, response){
    const config = (await admin.database().ref('payment_settings/braintree').once('value')).val();
    const gateway = braintree.connect({
        environment: config.testing? braintree.Environment.Sandbox: braintree.Environment.Production, 
        merchantId: config.merchantId, 
        publicKey: config.publicKey,
        privateKey: config.privateKey
    });
    gateway.transaction.sale(
        {
            amount: request.query.amount,
            paymentMethodNonce: request.query.nonce,
            options: {
                submitForSettlement: true
            }
        },
        (err, res) => {
            if (err) {
                response.send({ error: err });
            } else {   
                if(res.success){
                    const order_id = request.query.order_id;
                    const transaction_id = res.transaction.id;
                    const amount = request.query.amount;
                    admin.database().ref('bookings').child(order_id).once('value', snapshot => {
                      if(snapshot.val()){
                          const bookingData = snapshot.val();
                          UpdateBooking(bookingData,order_id,transaction_id,'braintree');
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
                }  else{
                    response.redirect('/cancel');
                }  
            }
        }
    );
};