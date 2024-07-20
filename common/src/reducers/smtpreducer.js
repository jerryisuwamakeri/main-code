import {
  FETCH_SMTP,
  FETCH_SMTP_SUCCESS,
  FETCH_SMTP_FAILED
} from "../store/types";

const INITIAL_STATE = {
  smtpDetails: null,
  fromEmail: null,
  loading: false,
  error: {
    flag: false,
    msg: null
  }
}

export const smtpreducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_SMTP:
      return {
        ...state,
        loading:true
      };
    case FETCH_SMTP_SUCCESS:
      return {
        ...state,
        smtpDetails:action.payload.smtpDetails,
        fromEmail: action.payload.fromEmail,
        loading:false
      };
    case FETCH_SMTP_FAILED:
      return {
        ...state,
        smtpDetails:null,
        fromEmail: null,
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