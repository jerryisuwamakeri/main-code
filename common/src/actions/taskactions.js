import {
  FETCH_TASKS,
  FETCH_TASKS_SUCCESS,
  FETCH_TASKS_FAILED,
  ACCEPT_TASK,
  CANCEL_TASK,
} from "../store/types";
import store from "../store/store";
import { updateProfile } from "./authactions";
import { RequestPushMsg } from "../other/NotificationFunctions";
import { firebase } from '../config/configureFirebase';
import { onValue, runTransaction, get, off, push } from "firebase/database";
import {driverQueue} from '../other/sharedFunctions';

export const fetchTasks = () => (dispatch) => {
  const { auth, tasksRef } = firebase;

  const uid = auth.currentUser.uid;
  off(tasksRef());
  dispatch({
    type: FETCH_TASKS,
    payload: null,
  });
  onValue(tasksRef(), (snapshot) => {
    if (snapshot.val()) {
      let data = snapshot.val();
      const arr = Object.keys(data)
        .filter(
          (i) => data[i].requestedDrivers && data[i].requestedDrivers[uid]
        )
        .map((i) => {
          data[i].id = i;
          return data[i];
        });
      dispatch({
        type: FETCH_TASKS_SUCCESS,
        payload: arr,
      });
    } else {
      dispatch({
        type: FETCH_TASKS_FAILED,
        payload: store.getState().languagedata.defaultLanguage.no_tasks,
      });
    }
  });
};

export const acceptTask = (task) => (dispatch) => {
  const { auth, trackingRef, singleUserRef, singleBookingRef } = firebase;

  const uid = auth.currentUser.uid;

  onValue(singleUserRef(uid), (snapshot) => {
    let profile = snapshot.val();

    runTransaction(singleBookingRef(task.id),(booking) => {
      let fleetCommission_fee= profile?.fleetadmin ? ((parseFloat(booking?.estimate) - parseFloat(booking?.convenience_fees)) * parseFloat(booking?.fleet_admin_comission) / 100).toFixed(2):0;
      let driver_fee = parseFloat(parseFloat(booking?.estimate) - (parseFloat(booking?.convenience_fees) + parseFloat(fleetCommission_fee) )).toFixed(2);
        if (booking && booking.requestedDrivers) {
          booking.driver = uid;
          booking.driver_image = profile.profile_image ? profile.profile_image : "";
          booking.car_image =  profile.car_image ? profile.car_image : "";
          booking.driver_name = profile.firstName + " " + profile.lastName;
          booking.driver_contact = profile.mobile;
          booking.driver_token = profile.pushToken ? profile.pushToken : '';
          booking.vehicle_number = profile.vehicleNumber ? profile.vehicleNumber : "";
          booking.vehicleModel = profile.vehicleModel ? profile.vehicleModel : "";
          booking.vehicleMake = profile.vehicleMake ? profile.vehicleMake : "";
          booking.driverRating = profile.rating ? profile.rating : "0";
          booking.fleetCommission= fleetCommission_fee? fleetCommission_fee : "0"
          booking.fleetadmin = profile.fleetadmin ? profile.fleetadmin : "";
          booking.status = "ACCEPTED";
          booking.driver_share = driver_fee? driver_fee : "0";
          booking.driverDeviceId = task.driverDeviceId? task.driverDeviceId: null;
          booking.requestedDrivers = null;
          booking.driverEstimates = null;
          return booking;
        }
      })
      .then(() => {
        get(singleBookingRef(task.id))
          .then((snapshot) => {
            if (!snapshot.exists()) {
              return;
            } else {
              let requestedDrivers =
                snapshot.val() && snapshot.val().requestedDrivers;
              let driverId = snapshot.val() && snapshot.val().driver;

              if (requestedDrivers == undefined && driverId === uid) {
                updateProfile({ queue: driverQueue ? false : true })(dispatch);
                RequestPushMsg(task.customer_token, {
                  title:
                    store.getState().languagedata.defaultLanguage
                      .notification_title,
                  msg:
                   profile.firstName +
                    store.getState().languagedata.defaultLanguage
                      .accept_booking_request,
                  screen: "BookedCab",
                  params: { bookingId: task.id },
                });

                const driverLocation = store.getState().gpsdata.location;

                push(trackingRef(task.id), {
                  at: new Date().getTime(),
                  status: "ACCEPTED",
                  lat: driverLocation.lat,
                  lng: driverLocation.lng,
                });

                dispatch({
                  type: ACCEPT_TASK,
                  payload: { task: task },
                });
              }
            }
          })
          .catch((error) => {
            console.error(error);
          });
      });
  },{onlyOnce:true});
};

export const cancelTask = (bookingId) => (dispatch) => {
  const { auth, singleBookingRef } = firebase;

  const uid = auth.currentUser.uid;

  runTransaction(singleBookingRef(bookingId), (booking) => {
      if (booking && booking.requestedDrivers) {
        if (
          booking.requestedDrivers !== null &&
          Object.keys(booking.requestedDrivers).length === 1
        ) {
          booking.status = "NEW";
          booking.requestedDrivers = null;
          booking.driverEstimates = null;
          RequestPushMsg(booking.customer_token, {
            title:
              store.getState().languagedata.defaultLanguage.notification_title,
            msg:
              store.getState().languagedata.defaultLanguage.booking_cancelled +
              bookingId,
            screen: "BookedCab",
            params: { bookingId: bookingId },
          });
          dispatch({
            type: CANCEL_TASK,
            payload: { uid: uid, bookingId: bookingId },
          });
        }else{
          delete booking.requestedDrivers[uid];
        }
        if(booking.driverOffers && booking.driverOffers[uid]){
          delete booking.driverOffers[uid];
        }
        if(booking.selectedBid && booking.selectedBid.driver === uid){
          delete booking.selectedBid;
        }
        return booking;
      }
    });
};
