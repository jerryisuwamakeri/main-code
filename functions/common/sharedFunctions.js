const admin = require('firebase-admin');

module.exports.UpdateBooking = (bookingData,order_id,transaction_id,gateway) => {
    admin.database().ref("settings").once("value", async settingsdata => {
        let settings = settingsdata.val();
        let curChanges = {
            status: bookingData.booking_from_web && !settings.prepaid? 'COMPLETE': settings.prepaid ? 'NEW' :'PAID',
            prepaid: settings.prepaid,
            transaction_id: transaction_id,
            gateway: gateway
        }
        Object.assign(curChanges, bookingData.paymentPacket);
        admin.database().ref('bookings').child(order_id).update(curChanges);
        admin.database().ref('users').child(bookingData.driver).update({queue:false});
    })
}

module.exports.addEstimate = (bookingId, driverId, distance) => {
    return true;
}