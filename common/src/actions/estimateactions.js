import {
  FETCH_ESTIMATE,
  FETCH_ESTIMATE_SUCCESS,
  FETCH_ESTIMATE_FAILED,
  CLEAR_ESTIMATE
} from "../store/types";
import Polyline from '@mapbox/polyline';
import { firebase } from '../config/configureFirebase';
import { FareCalculator } from '../other/FareCalculator';
import { onValue } from "firebase/database";

export const getEstimate = (bookingData) => async (dispatch) => {
  const   {
      settingsRef
  } = firebase;

  dispatch({
    type: FETCH_ESTIMATE,
    payload: bookingData,
  });
          

  let res = bookingData.routeDetails;

  if(res){
    let points = Polyline.decode(res.polylinePoints);

    let waypoints = points.map((point) => {
        return {
            latitude: point[0],
            longitude: point[1]
        }
    });
    
    onValue(settingsRef, settingdata => {
      let settings = settingdata.val();
      let distance = settings.convert_to_mile? (res.distance_in_km / 1.609344) : res.distance_in_km;

     let {totalCost, grandTotal, convenience_fees} = FareCalculator(distance, res.time_in_secs, bookingData.carDetails, bookingData.instructionData, settings.decimal);
     
      dispatch({
        type: FETCH_ESTIMATE_SUCCESS,
        payload: {
          pickup:bookingData.pickup,
          drop:bookingData.drop,
          carDetails:bookingData.carDetails,
          instructionData: bookingData.instructionData,
          estimateDistance: parseFloat(distance).toFixed(settings.decimal),
          fareCost: totalCost ? parseFloat(totalCost).toFixed(settings.decimal) : 0,
          estimateFare: grandTotal ? parseFloat(grandTotal).toFixed(settings.decimal) : 0,
          estimateTime:res.time_in_secs,
          convenience_fees: convenience_fees ? parseFloat(convenience_fees).toFixed(settings.decimal) : 0,
          waypoints: waypoints
        },
      });
    }, {onlyOnce:true});
  }else{
    dispatch({
      type: FETCH_ESTIMATE_FAILED,
      payload: "No Route Found",
    });
  }

}

export const clearEstimate = () => (dispatch) => {
    dispatch({
        type: CLEAR_ESTIMATE,
        payload: null,
    });    
}
