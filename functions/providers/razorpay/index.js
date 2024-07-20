const functions = require('firebase-functions');
const razorpaycheckout = require('./checkout');

exports.link = functions.https.onRequest(razorpaycheckout.render_checkout);
exports.process = functions.https.onRequest(razorpaycheckout.process_checkout);