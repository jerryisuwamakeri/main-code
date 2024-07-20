import { 
    FETCH_SOS,
    FETCH_SOS_SUCCESS,
    FETCH_SOS_FAILED,
    EDIT_SOS
    } from "../store/types";
    
    export const INITIAL_STATE = {
      sos:null,
      loading: false,
      error:{
        flag:false,
        msg: null
      }
    }
    
    export const sosreducer = (state = INITIAL_STATE, action) => {
      switch (action.type) {
        case FETCH_SOS:
          return {
            ...state,
            loading:true
          };
        case FETCH_SOS_SUCCESS:
          return {
            ...state,
            sos:action.payload,
            loading:false
          };
        case FETCH_SOS_FAILED:
          return {
            ...state,
            sos:null,
            loading:false,
            error:{
              flag:true,
              msg:action.payload
            }
          };
        case EDIT_SOS:
          return state;
        default:
          return state;
      }
    };
