import {
    FETCH_CARS,
    FETCH_CARS_SUCCESS,
    FETCH_CARS_FAILED,
    EDIT_CAR
  } from "../store/types";
  
  const INITIAL_STATE = {
    cars: null,
    loading: false,
    error: {
      flag: false,
      msg: null
    }
  }
  
  export const carlistreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_CARS:
        return {
          ...state,
          loading: true
        };
      case FETCH_CARS_SUCCESS:
        return {
          ...state,
          cars: action.payload,
          loading: false
        };
      case FETCH_CARS_FAILED:
        return {
          ...state,
          cars: null,
          loading: false,
          error: {
            flag: true,
            msg: action.payload
          }
        };
      case EDIT_CAR:
        return state;
      default:
        return state;
    }
  };