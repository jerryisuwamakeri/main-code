import {
    FETCH_COMPLAIN,
    FETCH_COMPLAIN_SUCCESS,
    FETCH_COMPLAIN_FAILED,
    EDIT_COMPLAIN
  } from "../store/types";

  const INITIAL_STATE = {
    list: null,
    loading: false,
    error: {
      flag: false,
      msg: null
    }
  }
  
  export const complainreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_COMPLAIN:
        return {
          ...state,
          loading: true
        };
      case FETCH_COMPLAIN_SUCCESS:
        return {
          ...state,
          list: action.payload,
          loading: false
        };
      case FETCH_COMPLAIN_FAILED:
        return {
          ...state,
          list: null,
          loading: false,
          error: {
            flag: true,
            msg: action.payload
          }
        };
      case EDIT_COMPLAIN:
        return state;
      default:
        return state;
    }
  };