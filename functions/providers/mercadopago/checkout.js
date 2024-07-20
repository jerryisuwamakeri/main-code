var mercadopago = require('mercadopago');
var request = require('request');
const templateLib = require('./template');
const admin = require('firebase-admin');
const addToWallet = require('../../common').addToWallet;
const UpdateBooking = require('../../common/sharedFunctions').UpdateBooking;

module.exports.render_checkout = async function(request, response){
    const config = (await admin.database().ref('payment_settings/mercadopago').once('value')).val();
    const public_key = config.public_key;
    const access_token =  config.access_token;
    
    mercadopago.configure({
        access_token: access_token
    });

    const allowed = ["ARS", "BRL", "CLP", "COP", "MXN", "PEN", "UYU", "VEF"];

    const refr = request.get('Referrer');
    const server_url = refr ? ((refr.includes('bookings') || refr.includes('addbookings') || refr.includes('userwallet'))? refr.substring(0, refr.length - refr.split("/")[refr.split("/").length - 1].length) : refr) : request.protocol + "://" + request.get('host') + "/";

    const preference = {
        items: [
          {
            id: request.body.order_id,
            quantity: 1,
            currency_id:allowed.includes(request.body.currency) ? request.body.currency : 'BRL',
            unit_price: parseFloat(request.body.amount)
          }
        ],
        back_urls: {
            "success": server_url + 'mercadopago-process',
            "failure": server_url + 'cancel'
        },
        auto_return: "approved",
      };
      
    mercadopago.preferences.create(preference)
    .then((res)=>{
        response.send(templateLib.getTemplate(res.body.id, public_key));
        return true;
    }).catch((error)=>{
        response.redirect('/cancel');
    });

};

module.exports.process_checkout = async (req, res)  => {
    const config = (await admin.database().ref('payment_settings/mercadopago').once('value')).val();
    const access_token =  config.access_token;
    
    var options = {
      'method': 'GET',
      'url': `https://api.mercadopago.com/v1/payments/${req.query.payment_id}`,
      'headers': {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
  
    request(options, (error, response) => {
      if(error){
        res.redirect('/cancel');
      }else{
        const json = JSON.parse(response.body);
        if(json.status === 'approved'){
          const order_id = json.additional_info.items[0].id;
          const transaction_id =  json.id;
          const amount = json.transaction_amount;

          admin.database().ref('bookings').child(order_id).once('value', snapshot => {
            if(snapshot.val()){
                const bookingData = snapshot.val();
                UpdateBooking(bookingData,order_id,transaction_id,'mercadopago');
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
      }
    });
  
  };