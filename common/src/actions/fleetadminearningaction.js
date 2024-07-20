import {
  FETCH_FLEETADMIN_EARNING,
  FETCH_FLEETADMIN_EARNING_SUCCESS,
  FETCH_FLEETADMIN_EARNING_FAILED,
} from "../store/types";
import store from '../store/store';
import { firebase } from '../config/configureFirebase';
import { get, onValue } from "firebase/database";

export const fetchFleetAdminEarnings = () => async (dispatch) => {

  const {
    bookingListRef,
    settingsRef
  } = firebase;

  dispatch({
    type: FETCH_FLEETADMIN_EARNING,
    payload: null
  });

  const userInfo = store.getState().auth.profile;
  const settingsdata = await get(settingsRef);
  const settings = settingsdata.val();

  onValue(bookingListRef(userInfo.uid, userInfo.usertype), snapshot => {
    if (snapshot.val()) {
      const { singleUserRef } = firebase;
      const mainArr = snapshot.val();
      var monthsName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      var renderobj = {};
      Object.keys(mainArr).map(j => {

        if ((mainArr[j].status === 'PAID' || mainArr[j].status === 'COMPLETE') && mainArr[j].fleetCommission !== undefined && mainArr[j].fleetCommission > 0) {
          let bdt = new Date(mainArr[j].tripdate);
          let uniqueKey = bdt.getFullYear() + '_' + bdt.getMonth() + '_' + mainArr[j].fleetadmin;
          if (renderobj[uniqueKey] && renderobj[uniqueKey].fleetCommission > 0) {
            renderobj[uniqueKey].fleetCommission = (parseFloat(renderobj[uniqueKey].fleetCommission) + parseFloat(mainArr[j].fleetCommission)).toFixed(settings.decimal);
            renderobj[uniqueKey]['total_rides'] = renderobj[uniqueKey]['total_rides'] + 1;
          } else {
            onValue(singleUserRef(mainArr[j].fleetadmin), async userdata => {
              if (userdata.val()) {
                let user = await userdata.val();
                if(user){
                  renderobj[uniqueKey]['fleetadminName'] = user.firstName + " " + user.lastName;
                }
              }
            });
            
            renderobj[uniqueKey] = {};
            renderobj[uniqueKey]['dated'] = mainArr[j].tripdate;
            renderobj[uniqueKey]['year'] = bdt.getFullYear();
            renderobj[uniqueKey]['month'] = bdt.getMonth();
            renderobj[uniqueKey]['monthsName'] = monthsName[bdt.getMonth()];
            renderobj[uniqueKey]['fleetCommission'] = parseFloat(mainArr[j].fleetCommission).toFixed(settings.decimal);
            renderobj[uniqueKey]['fleetUId'] = mainArr[j].fleetadmin;
            renderobj[uniqueKey]['uniqueKey'] = uniqueKey;
            renderobj[uniqueKey]['total_rides'] = 1;
          }
        }
        return null;
      });
      if (renderobj) {
        const arr = Object.keys(renderobj).map(i => {
          renderobj[i].fleetCommission = parseFloat(renderobj[i].fleetCommission).toFixed(settings.decimal)
          return renderobj[i]
        })
        dispatch({
          type: FETCH_FLEETADMIN_EARNING_SUCCESS,
          payload: arr
        });
      }

    } else {
      dispatch({
        type: FETCH_FLEETADMIN_EARNING_FAILED,
        payload: "No data available."
      });
    }
  });
};