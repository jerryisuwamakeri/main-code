const functions = require('firebase-functions');
const squareupcheckout = require('./checkout');

exports.link = functions.https.onRequest(squareupcheckout.render_checkout);
exports.addcard = functions.https.onRequest(squareupcheckout.add_card);
exports.process = functions.https.onRequest(squareupcheckout.process_checkout);