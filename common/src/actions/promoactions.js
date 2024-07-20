import {
  FETCH_PROMOS,
  FETCH_PROMOS_SUCCESS,
  FETCH_PROMOS_FAILED,
  EDIT_PROMOS
} from "../store/types";
import { firebase } from '../config/configureFirebase';
import { onValue, push, set, remove } from "firebase/database";

export const fetchPromos = () => (dispatch) => {

  const {
    promoRef
  } = firebase;

  dispatch({
    type: FETCH_PROMOS,
    payload: null
  });
  onValue(promoRef, snapshot => {
    if (snapshot.val()) {
      const data = snapshot.val();
      const arr = Object.keys(data).map(i => {
        data[i].id = i;
        return data[i]
      });
      dispatch({
        type: FETCH_PROMOS_SUCCESS,
        payload: arr
      });
    } else {
      dispatch({
        type: FETCH_PROMOS_FAILED,
        payload: "No promos available."
      });
    }
  });
};

export const editPromo = (promo, method) => (dispatch) => {
  const {
    promoRef, 
    promoEditRef
  } = firebase;
  dispatch({
    type: EDIT_PROMOS,
    payload: { method, promo }
  });
  if (method === 'Add') {
    push(promoRef, promo);
  } else if (method === 'Delete') {
    remove(promoEditRef(promo.id));
  } else {
    set(promoEditRef(promo.id),promo);
  }
}