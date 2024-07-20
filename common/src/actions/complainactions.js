import {
    FETCH_COMPLAIN,
    FETCH_COMPLAIN_SUCCESS,
    FETCH_COMPLAIN_FAILED,
    EDIT_COMPLAIN
  } from "../store/types";
  import { firebase } from '../config/configureFirebase';
  import store from '../store/store';
  import { onValue, push, set } from "firebase/database";
  
  export const fetchComplain = () => (dispatch) => {
 
    const {
        complainRef
    } = firebase;
  
    dispatch({
      type: FETCH_COMPLAIN,
      payload: null,
    });
    onValue(complainRef, (snapshot) => {
      if (snapshot.val()) {
        let data = snapshot.val();
        
       
        const arr = Object.keys(data).map(i => {
          data[i].id = i;
          return data[i]
        });
        dispatch({
          type: FETCH_COMPLAIN_SUCCESS,
          payload: arr.reverse()
        });
      } else {
        dispatch({
          type: FETCH_COMPLAIN_FAILED,
          payload: store.getState().languagedata.defaultLanguage.no_complain,
        });
      }
    });
  };
  
  export const editComplain = (reasons, method) => (dispatch) => {

    const {
        complainRef,
        editComplainRef
    } = firebase;
  
    dispatch({
      type: EDIT_COMPLAIN,
      payload: {method, reasons}
    });
    
    if (method === 'Add') {
      push(complainRef, reasons);
    }
    else if(method === 'Update'){
      set(editComplainRef(reasons.id),{ ...reasons, processDate: new Date().getTime() });
    }
  }
  
  