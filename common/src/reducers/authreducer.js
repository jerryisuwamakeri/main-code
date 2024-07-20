import {
    FETCH_USER,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILED,
    USER_SIGN_IN,
    USER_SIGN_IN_FAILED,
    USER_SIGN_OUT,
    CLEAR_LOGIN_ERROR,
    USER_DELETED,
    REQUEST_OTP,
    REQUEST_OTP_SUCCESS,
    REQUEST_OTP_FAILED,
    REQUEST_EMAIL_TOKEN,
    REQUEST_EMAIL_TOKEN_SUCCESS,
    REQUEST_EMAIL_TOKEN_FAILED,
    UPDATE_USER_WALLET_HISTORY,
    SEND_RESET_EMAIL,
    SEND_RESET_EMAIL_SUCCESS,
    SEND_RESET_EMAIL_FAILED
} from "../store/types";

const INITIAL_STATE = {
    profile: null,
    loading: false,
    walletHistory: null,
    error: {
        flag: false,
        msg: null
    },
    verificationId:null
}

export const authreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_USER:
            return {
                ...state,
                loading: true
            };
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                profile: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
                verificationId:null
            };
        case FETCH_USER_FAILED:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                },
                profile: null
            };
        case USER_SIGN_IN:
            return {
                ...state,
                loading: true
            };
        case USER_SIGN_IN_FAILED:
            return {
                ...state,
                profile: null,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case USER_SIGN_OUT:
            return INITIAL_STATE;
        case USER_DELETED:
            return INITIAL_STATE;
        case CLEAR_LOGIN_ERROR:
            return {
                ...state,
                verificationId:null,
                error: {
                    flag: false,
                    msg: null
                },
                loading:false
            };
        case REQUEST_OTP:
            return {
                ...state
            };
        case REQUEST_OTP_SUCCESS:
            return {
                ...state,
                loading: false,
                verificationId:action.payload
            };
        case REQUEST_OTP_FAILED:
            return {
                ...state,
                loading: false,
                verificationId:null,
                error: {
                    flag: true,
                    msg: action.payload
                },
            };
        case REQUEST_EMAIL_TOKEN:
            return {
                ...state
            };
        case REQUEST_EMAIL_TOKEN_SUCCESS:
            return {
                ...state,
                loading: false,
                emailToken:action.payload
            };
        case REQUEST_EMAIL_TOKEN_FAILED:
            return {
                ...state,
                loading: false,
                emailToken:null,
                error: {
                    flag: true,
                    msg: action.payload
                },
            };
        case UPDATE_USER_WALLET_HISTORY:
            return {
                ...state,
                loading: false,
                walletHistory:action.payload
            };
        case SEND_RESET_EMAIL:
            return {
                ...state,
                loading: false
            };
        case SEND_RESET_EMAIL_FAILED:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                },
            };
        default:
            return state;
    }
};