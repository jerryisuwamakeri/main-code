import {
    FETCH_SMSCONFIG,
    FETCH_SMSCONFIG_SUCCESS,
    FETCH_SMSCONFIG_FAILED,
    EDIT_SMSCONFIG
  } from "../store/types";

  const INITIAL_STATE = {
    smsDetails: null,
    loading: false,
    error: {
      flag: false,
      msg: null
    }
  }

  export const smsreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_SMSCONFIG:
        return {
          ...state,
          loading:true
        };
      case FETCH_SMSCONFIG_SUCCESS:
        return {
          ...state,
          smsDetails:action.payload,
          loading:false
        };
      case FETCH_SMSCONFIG_FAILED:
        return {
          ...state,
          smsDetails:null,
          loading:false,
          error:{
            flag:true,
            msg:action.payload
          }
        };
    case EDIT_SMSCONFIG:
        return state;
    default:
        return state;
    }
  };