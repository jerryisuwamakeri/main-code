import {
    FETCH_BOOKING_LOCATION,
    FETCH_BOOKING_LOCATION_SUCCESS,
    FETCH_BOOKING_LOCATION_FAILED,
    STOP_LOCATION_FETCH,
    STORE_ADRESSES
} from "../store/types";
import store from '../store/store';
import { firebase } from '../config/configureFirebase';
import { query, onValue, set, off, push, limitToLast } from "firebase/database";

export const saveTracking = (bookingId, location) => {
    const {
        trackingRef
    } = firebase;
    push(trackingRef(bookingId), location);
}

export const fetchBookingLocations = (bookingId) => (dispatch) => {

    const {
        trackingRef
    } = firebase;

    dispatch({
        type: FETCH_BOOKING_LOCATION,
        payload: bookingId,
    });
    onValue(query(trackingRef(bookingId), limitToLast(1)),(snapshot) => {
        if (snapshot.val()) {
            let data = snapshot.val();
            const locations = Object.keys(data)
                .map((i) => {
                    return data[i]
                });
            if (locations.length == 1) {
                dispatch({
                    type: FETCH_BOOKING_LOCATION_SUCCESS,
                    payload: locations[0]
                });
            }
            else {
                dispatch({
                    type: FETCH_BOOKING_LOCATION_FAILED,
                    payload: store.getState().languagedata.defaultLanguage.location_fetch_error,
                });
            }
        } else {
            dispatch({
                type: FETCH_BOOKING_LOCATION_FAILED,
                payload: store.getState().languagedata.defaultLanguage.location_fetch_error,
            });
        }
    });
};

export const stopLocationFetch = (bookingId) => (dispatch) => {

    const {
        trackingRef
    } = firebase;

    dispatch({
        type: STOP_LOCATION_FETCH,
        payload: bookingId,
    });
    off(trackingRef(bookingId));
}

export const saveUserLocation = (location) => {
    const {
      auth,
      userLocationRef,
    } = firebase;
    const uid = auth.currentUser.uid;
    set(userLocationRef(uid),location);
}

export const storeAddresses = (data) => (dispatch) => {
    dispatch({
        type: STORE_ADRESSES,
        payload: data,
    });
}