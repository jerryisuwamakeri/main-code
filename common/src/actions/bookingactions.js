import {
    CONFIRM_BOOKING,
    CONFIRM_BOOKING_SUCCESS,
    CONFIRM_BOOKING_FAILED,
    CLEAR_BOOKING
} from "../store/types";
import { RequestPushMsg } from '../other/NotificationFunctions';
import store from '../store/store';
import { firebase } from '../config/configureFirebase';
import { formatBookingObject } from '../other/sharedFunctions';
import { get, onValue, push } from "firebase/database";

export const clearBooking = () => (dispatch) => {
    dispatch({
        type: CLEAR_BOOKING,
        payload: null,
    });
}

export const addBooking = (bookingData) => async (dispatch) => {

    const   {
        bookingRef,
        settingsRef,
        singleUserRef
    } = firebase;

    dispatch({
        type: CONFIRM_BOOKING,
        payload: bookingData,
    });

    const settingsdata = await get(settingsRef);
    const settings = settingsdata.val();

    let data = await formatBookingObject(bookingData, settings);

    if(bookingData.requestedDrivers){
        const drivers = bookingData.requestedDrivers;
        Object.keys(drivers).map((uid)=>{
            onValue(singleUserRef(uid),  snapshot => {
                if (snapshot.val()) {
                    const pushToken = snapshot.val().pushToken;
                    const ios = snapshot.val().userPlatform == "IOS"? true: false
                    if(pushToken){
                        RequestPushMsg(
                            pushToken,
                            {
                                title: store.getState().languagedata.defaultLanguage.notification_title,
                                msg: store.getState().languagedata.defaultLanguage.new_booking_notification,
                                screen: 'DriverTrips',
                                channelId: settings.CarHornRepeat? 'bookings-repeat': 'bookings',
                                ios: ios
                            });
                     }
                 }
            }, {onlyOnce: true});
            return drivers[uid];
        })
    }

    push(bookingRef, data).then((res) => {
        var bookingKey = res.key;
        dispatch({
            type: CONFIRM_BOOKING_SUCCESS,
            payload: {
                booking_id:bookingKey,
                mainData:{
                    ...data,
                    id:bookingKey
                }
            }    
        });
    }).catch(error => {
        dispatch({
            type: CONFIRM_BOOKING_FAILED,
            payload: error.code + ": " + error.message,
        });
    });
};

