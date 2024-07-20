import {
  FETCH_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILED,
  EDIT_NOTIFICATIONS,
  SEND_NOTIFICATION,
  SEND_NOTIFICATION_SUCCESS,
  SEND_NOTIFICATION_FAILED,
} from "../store/types";
import { RequestPushMsg } from '../other/NotificationFunctions';
import { firebase } from '../config/configureFirebase';
import { onValue, set, push, remove } from "firebase/database";
import store from '../store/store';

export const fetchUserNotifications = () => (dispatch) => {

  const {
    auth,
    userNotificationsRef
  } = firebase;

  dispatch({
    type: FETCH_NOTIFICATIONS,
    payload: null
  });

  const uid = auth.currentUser.uid;

  onValue(userNotificationsRef(uid), snapshot => {
    const data = snapshot.val(); 
    if(data){
      const arr = Object.keys(data).map(i => {
        data[i].id = i
        return data[i]
      });
      dispatch({
        type: FETCH_NOTIFICATIONS_SUCCESS,
        payload: arr.reverse()
      });
    } else {
      dispatch({
        type: FETCH_NOTIFICATIONS_FAILED,
        payload: "No data available."
      });
    }
  });
};

export const fetchNotifications = () => (dispatch) => {

  const {
    notifyRef
  } = firebase;

  dispatch({
    type: FETCH_NOTIFICATIONS,
    payload: null
  });
  onValue(notifyRef, snapshot => {
    if (snapshot.val()) {
      const data = snapshot.val();

      const arr = Object.keys(data).map(i => {
        data[i].id = i
        return data[i]
      });

      dispatch({
        type: FETCH_NOTIFICATIONS_SUCCESS,
        payload: arr
      });
    } else {
      dispatch({
        type: FETCH_NOTIFICATIONS_FAILED,
        payload: "No data available."
      });
    }
  });
};

export const editNotifications = (notification, method) => (dispatch) => {
  const {
    notifyRef,
    notifyEditRef
  } = firebase;
  dispatch({
    type: EDIT_NOTIFICATIONS,
    payload: { method, notification }
  });
  if (method === 'Add') {
    push(notifyRef, notification);
  } else if (method === 'Delete') {
    remove(notifyEditRef(notification.id));
  } else {
    set(notifyEditRef(notification.id), notification);
  }
}

export const sendNotification = (notification) => async (dispatch) => {

  dispatch({
    type: SEND_NOTIFICATION,
    payload: notification
  });

  const users = store.getState().usersdata.users;
  if (users) {
    let arr = [];
    for (let i = 0; i < users.length; i++) {
      const usr = users[i];
      if(!(usr.pushToken === 'web' || usr.pushToken === 'token_error' || usr.pushToken === null || usr.pushToken === undefined)){
        if (notification.usertype === 'All' && notification.devicetype === 'All') {
          if (usr.pushToken) {
            arr.push(usr.pushToken);
          }
        } else if (notification.usertype === 'All' && notification.devicetype !== 'All') {
          if (usr.pushToken && usr.userPlatform === notification.devicetype) {
            arr.push(usr.pushToken);
          }
        } else if (notification.usertype !== 'All' && notification.devicetype === 'All') {
          if (usr.pushToken && usr.usertype === notification.usertype) {
            arr.push(usr.pushToken);
          }
        } else {
          if (usr.pushToken && usr.usertype === notification.usertype && usr.userPlatform === notification.devicetype) {
            arr.push(usr.pushToken);
          }
        }
      }
    }

    if (arr.length > 0) {
      const chunkSize = 100;
      for (let i = 0; i < arr.length; i += chunkSize) {
          const chunk = arr.slice(i, i + chunkSize);
          RequestPushMsg(chunk, {
            title: notification.title, msg: notification.body, screen: "Notifications"
          });
      }

      dispatch({
        type: SEND_NOTIFICATION_SUCCESS,
        payload: arr
      });
    } else {
      dispatch({
        type: SEND_NOTIFICATION_FAILED,
        payload: store.getState().languagedata.defaultLanguage.no_user_match,
      });
    }
  } else {
    dispatch({
      type: SEND_NOTIFICATION_FAILED,
      payload: store.getState().languagedata.defaultLanguage.no_user_match,
    });
  }
}
