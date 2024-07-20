const crypto  = require('crypto');
const templateLib = require('./template');
const admin = require('firebase-admin');
const addToWallet = require('../../common').addToWallet;
const UpdateBooking = require('../../common/sharedFunctions').UpdateBooking;

module.exports.render_checkout = async function (request, response) {

    const config = (await admin.database().ref('payment_settings/liqpay').once('value')).val();
    const public_key = config.public_key;
    const private_key = config.private_key;

    const refr = request.get('Referrer');
    const server_url = refr ? ((refr.includes('bookings') || refr.includes('addbookings') || refr.includes('userwallet'))? refr.substring(0, refr.length - refr.split("/")[refr.split("/").length - 1].length) : refr) : request.protocol + "://" + request.get('host') + "/";

    let json_string = {
        "public_key":public_key,
        "version":"3",
        "action":"pay",
        "amount":request.body.amount,
        "currency":request.body.currency,
        "description":"Payment Desription",
        "order_id": request.body.order_id,
        "server_url":server_url
    };
    
    let base64data =Buffer.from(JSON.stringify(json_string)).toString('base64');

    let sign_string =  private_key + base64data + private_key;
    
    let sha1 = crypto.createHash('sha1');
	sha1.update(sign_string);
    let signature =  sha1.digest('base64');	

    response.send(templateLib.getTemplate(base64data,signature));   
};

module.exports.process_checkout = async function (request, response) {
    const config = (await admin.database().ref('payment_settings/liqpay').once('value')).val();
    const public_key = config.public_key;
    const private_key = config.private_key;
    
    var LiqPay = require('liqpay');
    var liqpay = new LiqPay(public_key, private_key);
    liqpay.api("request", {
        "action"   : "status",
        "version"  : "3",
        "order_id" : request.query.order_id
    }).then((json)=>{
        if(json && json.status === 'success'){
            const order_id = request.query.order_id;
            const transaction_id = request.query.transaction_id;
            const amount = request.query.amount;
            admin.database().ref('bookings').child(order_id).once('value', snapshot => {
              if(snapshot.val()){
                  const bookingData = snapshot.val();  
                  UpdateBooking(bookingData,order_id,transaction_id,'liqpay');
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
        }else{
            response.redirect('/cancel');
        }
        return true;
    }).catch((error)=>{
        response.redirect('/cancel');
    });
};
