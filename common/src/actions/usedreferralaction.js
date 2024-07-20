import {FETCH_REFERRAL_ID,EDIT_REFERRAL_ID,FETCH_REFERRAL_ID_SUCCESS,FETCH_REFERRAL_ID_FAILED} from "../store/types"
import {firebase} from "../config/configureFirebase";
import { onValue,push,set } from "firebase/database";



export const fetchusedreferral = ()=>(dispatch)=>{
    const {
        usedreferralRef
    } = firebase;


    dispatch ({
        type:FETCH_REFERRAL_ID,
        payload:null
    })
    onValue (usedreferralRef,snapshot=>{
        if (snapshot.val()) {
            const data = snapshot.val();
            const arr = Object.keys(data).map(i => {
              data[i].id = i
              return data[i]
            });
            dispatch({
              type: FETCH_REFERRAL_ID_SUCCESS,
              payload: arr.reverse()
            });
          } else {
            dispatch({
              type: FETCH_REFERRAL_ID_FAILED,
              payload: "No SOS available."
            });
          }
        // if(snapshot.val()){
        //     const data = snapshot.val();
        //     const arr = Object.keys(data).map(i=>{
        //         data[i].id = i;
        //         return data[i]
        //     });
        //     dispatch({
        //         type:FETCH_REFERRAL_ID_SUCCESS,
        //         payload:arr.reverse()
        //     });
        // }
        // else {
        //     dispatch({
        //         type:FETCH_REFERRAL_ID_FAILED,
        //         payload:"No referral id used"
        //     })
        // }
    })



}

export const editreferral = (users,method)=>(dispatch)=>{
    const {
        usedreferralRef,
    } = firebase;

    dispatch({
        type:EDIT_REFERRAL_ID,
        payload:{method,users}
    });
    if(method ==='Add'){
        push(usedreferralRef,users)
        
    }
}