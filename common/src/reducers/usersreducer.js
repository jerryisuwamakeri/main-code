import { 
    FETCH_ALL_USERS,
    FETCH_ALL_USERS_SUCCESS,
    FETCH_ALL_USERS_FAILED,
    FETCH_ALL_USERS_STATIC,
    FETCH_ALL_USERS_STATIC_SUCCESS,
    FETCH_ALL_USERS_STATIC_FAILED,
    EDIT_USER,
    FETCH_ALL_DRIVERS,
    FETCH_ALL_DRIVERS_SUCCESS,
    FETCH_ALL_DRIVERS_FAILED
  } from "../store/types";
  
  export const INITIAL_STATE = {
    users:null,
    staticusers:null,
    drivers: null,
    loading: false,
    error:{
      flag:false,
      msg: null
    }
  }
  
  export const usersreducer =  (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_ALL_USERS:
        return {
          ...state,
        };
      case FETCH_ALL_USERS_SUCCESS:
        return {
          ...state,
          users:action.payload,
        };
      case FETCH_ALL_USERS_FAILED:
        return {
          ...state,
          users:null,
          loading:false,
          error:{
            flag:true,
            msg:action.payload
          }
        };
      case FETCH_ALL_DRIVERS:
        return {
          ...state
        };
      case FETCH_ALL_DRIVERS_SUCCESS:
        return {
          ...state,
          drivers:action.payload
        };
      case FETCH_ALL_DRIVERS_FAILED:
        return {
          ...state,
          drivers:null,
          error:{
            flag:true,
            msg:action.payload
          }
        };  
      case FETCH_ALL_USERS_STATIC:
        return {
          ...state,
          loading:true
        };
      case FETCH_ALL_USERS_STATIC_SUCCESS:
        return {
          ...state,
          staticusers:action.payload,
          loading:false
        };
      case FETCH_ALL_USERS_STATIC_FAILED:
        return {
          ...state,
          staticusers:null,
          loading:false,
          error:{
            flag:true,
            msg:action.payload
          }
        };
      case EDIT_USER:
        return state;
      default:
        return state;
    }
  };