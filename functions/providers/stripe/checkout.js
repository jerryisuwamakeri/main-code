const admin = require('firebase-admin');
const templateLib = require('./template');
const addToWallet = require('../../common').addToWallet;
const UpdateBooking = require('../../common/sharedFunctions').UpdateBooking;

const appName = require('../../config.json').app_name;

module.exports.render_checkout = async function(request, response){

    const config = (await admin.database().ref('payment_settings/stripe').once('value')).val();
    const stripe = require('stripe')(config.stripe_private_key);
    const stripe_public_key = config.stripe_public_key;

    const refr = request.get('Referrer');
    const server_url = refr ? ((refr.includes('bookings') || refr.includes('addbookings') || refr.includes('userwallet'))? refr.substring(0, refr.length - refr.split("/")[refr.split("/").length - 1].length) : refr) : request.protocol + "://" + request.get('host') + "/";

    var order_id = request.body.order_id;
    var amount = request.body.amount;
    var currency = request.body.currency;
    var quantity = request.body.quantity?request.body.quantity:1;

    let session_data = {
        success_url: server_url + 'stripe-process?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: server_url + 'cancel',
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
              currency: currency,
              product_data: {
                name: appName,
              },
              unit_amount: amount * ((currency === 'XOF' || currency === 'KRA') ? 1 : 100),
            },
            quantity: quantity,
        }],
        mode:'payment',
        metadata:{
            order_id: order_id
        }
    }

    stripe.checkout.sessions.create(
        session_data,
        (err, session) => {
            if (err) {
                response.send({ "error": err });
            } else if (session) {    
                response.send(
                    templateLib.getTemplate(stripe_public_key, session.id)
                );               
            } else {
                response.send({ "error": "Some other problem" })
            }
        }
    );
};

module.exports.process_checkout = async function(request, response){
    const config = (await admin.database().ref('payment_settings/stripe').once('value')).val();
    const stripe = require('stripe')(config.stripe_private_key);
    
    var session_id = request.query.session_id;
    stripe.checkout.sessions.retrieve(
        session_id,
        (err, session) => {
            if (err) {
                response.redirect('/cancel');
            } else if (session) {
                const order_id = session.metadata.order_id;
                const transaction_id = session.payment_intent;
                const amount = parseFloat((session.currency === 'XOF' || session.currency === 'KRA') ? session.amount_total: session.amount_total/100);
                admin.database().ref('bookings').child(order_id).once('value', snapshot => {
                  if(snapshot.val()){
                      const bookingData = snapshot.val();
                      UpdateBooking(bookingData,order_id,transaction_id,'stripe');
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
        }
    );
};