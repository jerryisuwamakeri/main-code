import {FETCH_REFERRAL_ID,EDIT_REFERRAL_ID,FETCH_REFERRAL_ID_SUCCESS,FETCH_REFERRAL_ID_FAILED} from "../store/types"



export const INITIAL_STATE = {
    usedreferral:null,
    loading:false,
    error:{
        flag:false,
        msg:null
    }
}


export const usedreferralreducer = (state=INITIAL_STATE,action) =>{
    switch(action.type){
        case FETCH_REFERRAL_ID:
            return {
                ...state,
                loading:true
            };
            case FETCH_REFERRAL_ID_SUCCESS:
                return {
                    ...state,
                    usedreferral:action.payload,
                    loading:false
                };
            case FETCH_REFERRAL_ID_FAILED:
                return{
                    ...state,
                    usedreferral:null,
                    loading:false,
                    error:{
                        flag:true,
                        msg:action.payload
                    }
                }
            case EDIT_REFERRAL_ID:
                return state;
            default:
                return state;
    }
}