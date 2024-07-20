import {
    FETCH_LANGUAGE,
    FETCH_LANGUAGE_SUCCESS,
    FETCH_LANGUAGE_FAILED,
    EDIT_LANGUAGE
} from "../store/types";
import { firebase } from '../config/configureFirebase';
import { onValue, set, push, remove } from "firebase/database";

export const fetchLanguages = () => (dispatch) => {

    const {
        languagesRef
    } = firebase;

    dispatch({
        type: FETCH_LANGUAGE,
        payload: null
    });
    onValue(languagesRef, snapshot => {
        if (snapshot.val()) {
            const data = snapshot.val();
            let defLang = null;
            const arr = Object.keys(data).map(i => {
                data[i].id = i;
                if(data[i].default){
                    defLang = data[i].keyValuePairs;
                }
                return data[i]
            });
            dispatch({
                type: FETCH_LANGUAGE_SUCCESS,
                payload: {
                    defaultLanguage: defLang,
                    langlist: arr
                }
            });
        } else {
            dispatch({
                type: FETCH_LANGUAGE_FAILED,
                payload: "No Languages available."
            });
        }
    });
};

export const editLanguage = (lang, method) => (dispatch) => {
    const {
        languagesRef,
        languagesEditRef
    } = firebase;
    dispatch({
        type: EDIT_LANGUAGE,
        payload: { lang, method }
    });
    if (method === 'Add') {
        push(languagesRef, lang);
    } else if (method === 'Delete') {
        remove(languagesEditRef(lang.id));
    } else {
        set(languagesEditRef(lang.id),lang);
    }
}