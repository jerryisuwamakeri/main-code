import {
    FETCH_SMSCONFIG,
    FETCH_SMSCONFIG_SUCCESS,
    FETCH_SMSCONFIG_FAILED,
    EDIT_SMSCONFIG
  } from "../store/types";
  import { firebase } from '../config/configureFirebase';
  import { onValue, set } from "firebase/database";

  export const fetchSMSConfig = () => (dispatch) => {

    const {
      smsRef
    } = firebase;

    dispatch({
      type: FETCH_SMSCONFIG,
      payload: null,
    });
    onValue(smsRef, (snapshot) => {
      if (snapshot.val()) {
        dispatch({
          type: FETCH_SMSCONFIG_SUCCESS,
          payload: snapshot.val(),
        });
      } else {
        dispatch({
          type: FETCH_SMSCONFIG_FAILED,
          payload: "Unable to fetch SMS Config details.",
        });
      }
    });
  };

  export const editSmsConfig = (smsDetails) => (dispatch) => {
    const {
      smsRef
    } = firebase;   1
    dispatch({
      type: EDIT_SMSCONFIG,
      payload: null
    });
    set(smsRef, smsDetails);
  };