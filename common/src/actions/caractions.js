import {
    FETCH_CARS,
    FETCH_CARS_SUCCESS,
    FETCH_CARS_FAILED,
    EDIT_CAR
  } from "../store/types";
  import store from '../store/store';
  import { firebase } from '../config/configureFirebase';
  import { onValue, update, set, child, remove, push } from "firebase/database";
  import { uploadBytesResumable, getDownloadURL } from "firebase/storage";
  
  export const fetchCars = () => (dispatch) => {
  
    const {
        carsRef
    } = firebase;
  
    dispatch({
      type: FETCH_CARS,
      payload: null
    });

    const userInfo = store.getState().auth.profile;

    onValue(carsRef(userInfo.uid, userInfo.usertype), snapshot => {
      if (snapshot.val()) {
        let data = snapshot.val();
        const arr = Object.keys(data).map(i => {
          data[i].id = i;
          return data[i]
        });
        dispatch({
          type: FETCH_CARS_SUCCESS,
          payload: arr
        });
      } else {
        dispatch({
          type: FETCH_CARS_FAILED,
          payload: store.getState().languagedata.defaultLanguage.no_cars
        });
      }
    });
  };
  
  export const editCar = (car, method) => async (dispatch) => {
    const {
      singleUserRef,
      carAddRef, 
      carEditRef,
      carImage
    } = firebase;
    dispatch({
      type: EDIT_CAR,
      payload: { method, car }
    });
    if (method === 'Add') {
        push(carAddRef, car);
    } else if (method === 'Delete') {
        remove(carEditRef(car.id));
    } else if (method === 'UpdateImage') {
      await uploadBytesResumable(carImage(car.id),car.car_image);
      let image = await getDownloadURL(carImage(car.id));
      let data = car;
      data.car_image = image;
      set(carEditRef(car.id), data);
      if(car.active && car.driver){
        update(singleUserRef(car.driver), {
          updateAt: new Date().getTime(),
          car_image: image
        });
      }   
    }
     else {
        set(carEditRef(car.id),car);
    }
  }

  export const updateUserCarWithImage = (newData, blob) => (dispatch) => {
    const {
      auth,
      carAddRef,
      singleUserRef,
      carImage
    } = firebase;

    var carId = push(carAddRef).key;

    uploadBytesResumable(carImage(carId),blob).then(() => {
      blob.close()
      return getDownloadURL(carImage(carId))
    }).then((url) => {
      newData.car_image = url;
      set(child(carAddRef, carId),newData )
      if(newData.active){
        let updateData = {
          carType: newData.carType,
          vehicleNumber: newData.vehicleNumber,
          vehicleMake: newData.vehicleMake,
          vehicleModel: newData.vehicleModel,
          other_info: newData.other_info,
          car_image:url,
          carApproved: newData.approved,
          updateAt: new Date().getTime()
        };
        update(singleUserRef(auth.currentUser.uid),updateData);
      }
    })
  };