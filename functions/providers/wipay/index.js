const functions = require('firebase-functions');
const wipaycheckout = require('./checkout');

exports.link = functions.https.onRequest(wipaycheckout.render_checkout);
exports.process = functions.https.onRequest(wipaycheckout.process_checkout);