const functions = require('firebase-functions');
const paymongocheckout = require('./checkout');

exports.link = functions.https.onRequest(paymongocheckout.render_checkout);
exports.process = functions.https.onRequest(paymongocheckout.process_checkout);