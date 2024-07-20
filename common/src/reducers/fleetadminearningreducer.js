import { 
    FETCH_FLEETADMIN_EARNING,
    FETCH_FLEETADMIN_EARNING_SUCCESS,
    FETCH_FLEETADMIN_EARNING_FAILED,
  } from "../store/types";
  
  export const INITIAL_STATE = {
    fleetadminearning:null,
    loading: false,
    error:{
      flag:false,
      msg: null
    }
  }
  
  export const fleetadminearningreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_FLEETADMIN_EARNING:
        return {
          ...state,
          loading:true
        };
      case FETCH_FLEETADMIN_EARNING_SUCCESS:
        return {
          ...state,
          fleetadminearning:action.payload,
          loading:false
        };
      case FETCH_FLEETADMIN_EARNING_FAILED:
        return {
          ...state,
          fleetadminearning:null,
          loading:false,
          error:{
            flag:true,
            msg:action.payload
          }
        };
        default:
        return state;
    
    }
  };