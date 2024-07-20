const templateLib = require("./template");
const admin = require("firebase-admin");
const addToWallet = require("../../common").addToWallet;
const UpdateBooking = require("../../common").UpdateBooking;
const { v4: uuidv4 } = require("uuid");
const { Client, Environment } = require('square');

module.exports.render_checkout = async function (request, response) {
  const config = (await admin.database().ref('payment_settings/squareup').once('value')).val();
  const APPLICATION_ID = config.APPLICATION_ID;
  const LOCATION_ID = config.LOCATION_ID;

  const order_id = request.body.order_id;
  const amount = request.body.amount;
  const currency = request.body.currency;
  const refr = request.get('Referrer');
  const server_url = refr ? ((refr.includes('bookings') || refr.includes('addbookings') || refr.includes('userwallet'))? refr.substring(0, refr.length - refr.split("/")[refr.split("/").length - 1].length) : refr) : request.protocol + "://" + request.get('host') + "/";

  response.send(
    templateLib.getTemplate(APPLICATION_ID, LOCATION_ID, order_id, amount, currency, server_url, config.testing )
  );
};

module.exports.add_card = async (req, res) => {
  const config = (await admin.database().ref('payment_settings/squareup').once('value')).val();
  const LOCATION_ID = config.LOCATION_ID;
  const ACCESS_TOKEN = config.ACCESS_TOKEN;

  const idempotency_key = uuidv4();

  const client = new Client({
    environment: config.testing? Environment.Sandbox : Environment.Production,
    accessToken: ACCESS_TOKEN,
  })

  const paymentsApi = client.paymentsApi;

  const data = {
    idempotencyKey: idempotency_key,
    amountMoney: {
      amount: parseFloat(req.body.amount),
      currency: "AUD",
    },
    sourceId: req.body.sourceId,
    autocomplete: true,
    locationId: LOCATION_ID,
    referenceId: req.body.order_id
  };


  try {
    const result = await paymentsApi.createPayment(data);
    if(result.statusCode === 200){
      if(result.body){
        const data = JSON.parse(result.body);
        if(data.payment){
          res.send(data.payment);
        }else{
          res.send({error:true});
        }
      }else{
        res.send({error:true});
      }
    }
  } catch(error) {
    res.send({error:true});
  }

};

module.exports.process_checkout = async function(req, res){
  const order_id = req.query.order_id;
  const transaction_id = req.query.transaction_id;
  const amount = req.query.amount;
  admin.database().ref('bookings').child(order_id).once('value', snapshot => {
      if(snapshot.val()){
          const bookingData = snapshot.val();
          UpdateBooking(bookingData,order_id,transaction_id,'squareup');
          res.redirect(`/success?order_id=${order_id}&amount=${amount}&transaction_id=${transaction_id}`);
      }else{
          if(order_id.startsWith("wallet")){
              addToWallet(order_id.substr(7,order_id.length - 12), amount, order_id, transaction_id);
              res.redirect(`/success?order_id=${order_id}&amount=${amount}&transaction_id=${transaction_id}`);
          }
          else{
              res.redirect('/cancel');
          }
      }
  });
};