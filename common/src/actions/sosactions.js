
import { REQUEST_SOS, CANCEL_SOS, FETCH_SOS_LIST } from "../store/types";

export const requestSOS = (uid, sosData) => ({
  type: REQUEST_SOS,
  payload: { uid, sosData },
});

export const cancelSOS = (uid) => ({
  type: CANCEL_SOS,
  payload: { uid },
});

export const fetchSOSList = (sosList) => ({
  type: FETCH_SOS_LIST,
  payload: sosList,
});
