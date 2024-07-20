import {
  FETCH_SMTP,
  FETCH_SMTP_SUCCESS,
  FETCH_SMTP_FAILED
} from "../store/types";
import { firebase } from '../config/configureFirebase';
import { onValue } from "firebase/database";

export const fetchSMTP = () => (dispatch) => {

  const {
    smtpRef
  } = firebase;

  dispatch({
    type: FETCH_SMTP,
    payload: null,
  });
  onValue(smtpRef, (snapshot) => {
    if (snapshot.val()) {
      dispatch({
        type: FETCH_SMTP_SUCCESS,
        payload: snapshot.val(),
      });
    } else {
      dispatch({
        type: FETCH_SMTP_FAILED,
        payload: "Unable to fetch SMTP details.",
      });
    }
  });
};

export const checkSMTP = async(fromEmail, smtpDetails) => {
  const {
    config
  } = firebase;

  let url = `https://${config.projectId}.web.app/checksmtpdetails`;

  const body = { fromEmail: fromEmail, smtpDetails: smtpDetails };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  })

  return await response.json();
}