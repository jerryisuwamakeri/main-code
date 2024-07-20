import {
    FETCH_SOS,
    FETCH_SOS_SUCCESS,
    FETCH_SOS_FAILED,
    EDIT_SOS
  } from "../store/types";
  import { firebase } from '../config/configureFirebase';
  import { onValue, push, set } from "firebase/database";

  export const fetchSos = () => (dispatch) => {
  
    const {
        sosRef
    } = firebase;
  
    dispatch({
      type: FETCH_SOS,
      payload: null
    });
   onValue(sosRef, snapshot => {
      if (snapshot.val()) {
        const data = snapshot.val();
        const arr = Object.keys(data).map(i => {
          data[i].id = i
          return data[i]
        });
        dispatch({
          type: FETCH_SOS_SUCCESS,
          payload: arr.reverse()
        });
      } else {
        dispatch({
          type: FETCH_SOS_FAILED,
          payload: "No SOS available."
        });
      }
    });
  };


  export const editSos = (reasons, method) => (dispatch) => {

    const {
        sosRef,
        editSosRef
    } = firebase;
  
    dispatch({
      type: EDIT_SOS,
      payload: {method, reasons}
    });
    
    if (method === 'Add') {
      push(sosRef, reasons);
    }
    else if(method === 'Update'){
      set(editSosRef(reasons.id),{ ...reasons, processed: true, processDate: new Date().getTime() });
    }
  }