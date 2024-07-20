import {
    FETCH_ADDRESSES,
    FETCH_ADDRESSES_SUCCESS,
    FETCH_ADDRESSES_FAILED,
    EDIT_ADDRESS
  } from "../store/types";
  import store from '../store/store';
  import { firebase } from '../config/configureFirebase';
  import { onValue, remove, push, off } from "firebase/database";
  
  export const fetchAddresses = () => (dispatch) => {
  
    const {
      addressEditRef
    } = firebase;
    dispatch({
      type: FETCH_ADDRESSES,
      payload: null
    });
    const userInfo = store.getState().auth.profile;
    off(addressEditRef(userInfo.uid));
    onValue(addressEditRef(userInfo.uid), snapshot => {
      if (snapshot.val()) {
        let data = snapshot.val();
        const arr = Object.keys(data).map(i => {
          data[i].id = i;
          return data[i]
        });
        dispatch({
          type: FETCH_ADDRESSES_SUCCESS,
          payload: arr
        });
      } else {
        dispatch({
          type: FETCH_ADDRESSES_FAILED,
          payload: store.getState().languagedata.defaultLanguage.no_address
        });
      }
    });
  };
  
  export const editAddress = (uid, address, method) => async (dispatch) => {
    const {
      addressRef, 
      addressEditRef,
    } = firebase;
    dispatch({
      type: EDIT_ADDRESS,
      payload: { method, address }
    });
    if (method === 'Add') {
      push(addressEditRef(uid), address);
    } else if (method === 'Delete') {
      remove(addressRef(uid, address.id));
    }
  }