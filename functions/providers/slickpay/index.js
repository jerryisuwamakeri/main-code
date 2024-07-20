const functions = require('firebase-functions');
const slickpaycheckout = require('./checkout');

exports.link = functions.https.onRequest(slickpaycheckout.render_checkout);
exports.process = functions.https.onRequest(slickpaycheckout.process_checkout);