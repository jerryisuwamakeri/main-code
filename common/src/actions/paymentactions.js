import {
    FETCH_PAYMENT_METHODS,
    FETCH_PAYMENT_METHODS_SUCCESS,
    FETCH_PAYMENT_METHODS_FAILED,
    UPDATE_WALLET_BALANCE,
    UPDATE_WALLET_BALANCE_SUCCESS,
    UPDATE_WALLET_BALANCE_FAILED,
    CLEAR_PAYMENT_MESSAGES,
    UPDATE_PAYMENT_METHOD
} from "../store/types";
import { RequestPushMsg } from '../other/NotificationFunctions';
import { firebase } from '../config/configureFirebase';
import store from '../store/store';
import { onValue, get, update, push } from "firebase/database";

export const fetchPaymentMethods = () => (dispatch) => {

    const {
      config,
      paymentSettingsRef
    } = firebase;
  
    dispatch({
      type: FETCH_PAYMENT_METHODS,
      payload: null
    });

    const usertype = store.getState().auth.profile.usertype;

    if(usertype == 'admin'){
        onValue(paymentSettingsRef, snapshot => {
            const data = snapshot.val(); 
            if(data){
              dispatch({
                type: FETCH_PAYMENT_METHODS_SUCCESS,
                payload: data
              });
            } else {
              dispatch({
                type: FETCH_PAYMENT_METHODS_FAILED,
                payload: store.getState().languagedata.defaultLanguage.no_provider_found,
              });
            }
          });
    } else { 
        const settings = store.getState().settingsdata.settings;
        let host = window && window.location && settings.CompanyWebsite === window.location.origin? window.location.origin : `https://${config.projectId}.web.app`
        let url = `${host}/get_providers`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.length > 0) {
                    dispatch({
                        type: FETCH_PAYMENT_METHODS_SUCCESS,
                        payload: responseJson,
                    });
                }else{
                    dispatch({
                        type: FETCH_PAYMENT_METHODS_FAILED,
                        payload: store.getState().languagedata.defaultLanguage.no_provider_found,
                    });
                }
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_PAYMENT_METHODS_FAILED,
                    payload: store.getState().languagedata.defaultLanguage.provider_fetch_error + ": " + error.toString(),
                });
            });
    }
  };

  export const editPaymentMethods = (data) => (dispatch) => {
    const {
        paymentSettingsRef
    } = firebase;
    dispatch({
      type: UPDATE_PAYMENT_METHOD,
      payload: data 
    });
    update(paymentSettingsRef, data);
  }
  


export const clearMessage = () => (dispatch) => {
    dispatch({
        type: CLEAR_PAYMENT_MESSAGES,
        payload: null,
    });    
};


export const addToWallet = (uid, amount) => async (dispatch) => {
    const {
        walletHistoryRef,
        singleUserRef,
        settingsRef
    } = firebase;

    dispatch({
        type: UPDATE_WALLET_BALANCE,
        payload: null
    });

    const settingsdata = await get(settingsRef);
    const settings = settingsdata.val();

    onValue(singleUserRef(uid), snapshot => {
        if (snapshot.val()) {
            let walletBalance = parseFloat(snapshot.val().walletBalance);
            const pushToken = snapshot.val().pushToken;
            walletBalance = parseFloat((parseFloat(walletBalance) + parseFloat(amount)).toFixed(settings.decimal));
            let details = {
                type: 'Credit',
                amount: parseFloat(amount),
                date: new Date().getTime(),
                txRef: 'AdminCredit'
            }
            update(singleUserRef(uid),{walletBalance: walletBalance}).then(() => {
                push(walletHistoryRef(uid), details).then(()=>{
                    dispatch({
                        type: UPDATE_WALLET_BALANCE_SUCCESS,
                        payload: null
                    });
                }).catch(error=>{
                    dispatch({
                        type: UPDATE_WALLET_BALANCE_FAILED,
                        payload: error.code + ": " + error.message,
                    });            
                })
                if(pushToken){
                    RequestPushMsg(
                        pushToken,
                        {
                            title: store.getState().languagedata.defaultLanguage.notification_title,
                            msg:  store.getState().languagedata.defaultLanguage.wallet_updated,
                            screen: 'Wallet'
                        }
                    );
                }
            }).catch(error=>{
                dispatch({
                    type: UPDATE_WALLET_BALANCE_FAILED,
                    payload: error.code + ": " + error.message,
                });
            });
            
        }
    }, {onlyOnce: true});
};


export const withdrawBalance = (profile, amount) => async (dispatch) => {

    const {
        withdrawRef,
    } = firebase;
    
    dispatch({
        type: UPDATE_WALLET_BALANCE,
        payload: null
    });

    push(withdrawRef, {
        uid : profile.uid,
        name : profile.firstName +  ' ' + profile.lastName,
        amount : parseFloat(amount),
        date : new Date().getTime(),
        bankName : profile.bankName? profile.bankName : '',
        bankCode : profile.bankCode? profile.bankCode : '',
        bankAccount : profile.bankAccount? profile.bankAccount : '',
        processed:false
    });
       
};
