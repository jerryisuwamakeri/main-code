import {
    FETCH_MESSAGES,
    FETCH_MESSAGES_SUCCESS,
    FETCH_MESSAGES_FAILED,
    SEND_MESSAGE,
    STOP_FETCH_MESSAGES
} from "../store/types";
import store from '../store/store';
import { firebase } from '../config/configureFirebase';
import { RequestPushMsg } from '../other/NotificationFunctions';
import { onValue, push, off, child } from "firebase/database";

export const fetchChatMessages = (bookingId) => (dispatch) => {

    const {
        chatRef
    } = firebase;
  
    dispatch({
        type: FETCH_MESSAGES,
        payload: bookingId,
    });
    onValue(chatRef(bookingId), snapshot => {
        if(snapshot.val()){
            let rootEntry = snapshot.val();
            let allMesseges = [];
            for (let key in rootEntry) {
                let entryKey = rootEntry[key]
                for (let msgKey in entryKey) {
                  entryKey[msgKey].smsId = msgKey
                  allMesseges.push(entryKey[msgKey])
                }
            }
            dispatch({
                type: FETCH_MESSAGES_SUCCESS,
                payload: allMesseges,
            });
        }else{
            dispatch({
                type: FETCH_MESSAGES_FAILED,
                payload: store.getState().languagedata.defaultLanguage.chat_not_found,
            });
        }
    })
};

export const sendMessage = (data) => (dispatch) => {

    const {
        chatRef
    } = firebase;

    const chatId = data.booking.customer + ','  + data.booking.driver
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    today = mm + ':' + dd + ':' + yyyy;
    
    const msg = {
        message:data.message,
        from: data.role == 'customer'? data.booking.customer : data.booking.driver,
        type:"msg",
        msgDate:today,
        msgTime:time,
        createdAt: new Date().toString(),
        source: data.role
    };

    push(child(chatRef(data.booking.id), chatId), msg);

    if(data.role == 'customer'){
        if(data.booking.driver_token){
            RequestPushMsg(
                data.booking.driver_token,
                {
                    title: store.getState().languagedata.defaultLanguage.notification_title  + store.getState().languagedata.defaultLanguage.chat_requested,
                    msg: data.message,
                    screen: 'onlineChat',
                    params: { bookingId: data.booking.id }
                });
        }
    }else{
        if(data.booking.customer_token){
            RequestPushMsg(
                data.booking.customer_token,
                {
                    title: store.getState().languagedata.defaultLanguage.notification_title  + store.getState().languagedata.defaultLanguage.chat_requested,
                    msg: data.message,
                    screen: 'onlineChat',
                    params: { bookingId: data.booking.id}
                });
        }
    }

    dispatch({
        type: SEND_MESSAGE,
        payload: msg,
    });
}

export const stopFetchMessages = (bookingId) => (dispatch) => {

    const {
        chatRef 
    } = firebase;

    dispatch({
        type: STOP_FETCH_MESSAGES,
        payload: bookingId,
    });
    off(chatRef(bookingId));
}