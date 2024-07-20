import {
    FETCH_ADDRESSES,
    FETCH_ADDRESSES_SUCCESS,
    FETCH_ADDRESSES_FAILED,
    EDIT_ADDRESS
  } from "../store/types";
  
  const INITIAL_STATE = {
    addresses: null,
    loading: false,
    error: {
      flag: false,
      msg: null
    }
  }
  
  export const addresslistreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_ADDRESSES:
        return {
          ...state,
          loading: true
        };
      case FETCH_ADDRESSES_SUCCESS:
        return {
          ...state,
          addresses: action.payload,
          loading: false
        };
      case FETCH_ADDRESSES_FAILED:
        return {
          ...state,
          addresses: null,
          loading: false,
          error: {
            flag: true,
            msg: action.payload
          }
        };
      case EDIT_ADDRESS:
        return state;
      default:
        return state;
    }
  };