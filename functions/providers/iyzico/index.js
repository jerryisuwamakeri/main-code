const functions = require('firebase-functions');
const iyzicocheckout = require('./checkout');

exports.link = functions.https.onRequest(iyzicocheckout.render_checkout);
exports.process = functions.https.onRequest(iyzicocheckout.process_checkout);