import {
  FETCH_ALL_USERS,
  FETCH_ALL_USERS_SUCCESS,
  FETCH_ALL_USERS_FAILED,
  EDIT_USER,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAILED,
  DELETE_USER,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILED,
  FETCH_ALL_USERS_STATIC,
  FETCH_ALL_USERS_STATIC_SUCCESS,
  FETCH_ALL_USERS_STATIC_FAILED,
  USER_DELETED,
  FETCH_ALL_DRIVERS,
  FETCH_ALL_DRIVERS_SUCCESS,
  FETCH_ALL_DRIVERS_FAILED
} from "../store/types";
import { firebase } from '../config/configureFirebase';
import { onValue, set, push, update, off, get, remove } from "firebase/database";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";

export const fetchUsers = () => (dispatch) => {

  const {
    usersRef,
    allLocationsRef
  } = firebase;

  dispatch({
    type: FETCH_ALL_DRIVERS,
    payload: null
  });
  onValue(usersRef, async snapshot => {
    if (snapshot.val()) {
      const locationdata = await get(allLocationsRef);
      const locations = locationdata.val();
      const data = snapshot.val();
      const arr = Object.keys(data)
      .filter(i => data[i].usertype!='admin')
      .map(i => {
        data[i].id = i;
        data[i].location = locations && locations[i] ? locations[i] : null;
        return data[i];
      });
      dispatch({
        type: FETCH_ALL_USERS_SUCCESS,
        payload: arr
      });
    } else {
      dispatch({
        type: FETCH_ALL_USERS_FAILED,
        payload: "No users available."
      });
    }
  });
};


export const fetchUsersOnce = () => (dispatch) => {

  const {
    usersRef,
    allLocationsRef
  } = firebase;

  dispatch({
    type: FETCH_ALL_USERS_STATIC,
    payload: null
  });
  onValue(usersRef, async snapshot => {
    if (snapshot.val()) {
      const locationdata = await get(allLocationsRef);
      const locations = locationdata.val();
      const data = snapshot.val();
      const arr = Object.keys(data)
      .map(i => {
        data[i].id = i;
        data[i].location = locations && locations[i] ? locations[i] : null;
        return data[i];
      });
      dispatch({
        type: FETCH_ALL_USERS_STATIC_SUCCESS,
        payload: arr
      })
    } else {
      dispatch({
        type: FETCH_ALL_USERS_STATIC_FAILED,
        payload: "No users available."
      });
    }
  },{onlyOnce: true});
  
};
export const clearFetchDrivers = () => (dispatch) => {
  const {
    driversRef,
    allLocationsRef,
  } = firebase;
  off(driversRef);
  off(allLocationsRef);
}

export const fetchDrivers = (appType) => async(dispatch) => {

  const {
    driversRef,
    allLocationsRef,
    settingsRef,
  } = firebase;

  const settingsdata = await get(settingsRef);
  const settings = settingsdata.val();

  dispatch({
    type: FETCH_ALL_USERS,
    payload: null
  });

  onValue(driversRef, snapshot => {
    if (snapshot.val()) {
      onValue(allLocationsRef, locres=>{
        const locations = locres.val();
          const data = snapshot.val();
          const arr = Object.keys(data)
          .filter(i => data && data[i].approved == true && data[i].driverActiveStatus == true && locations && locations[i] && ( (data[i].licenseImage && settings.license_image_required) || !settings.license_image_required)
                      && (((data[i].carApproved && settings.carType_required) || !settings.carType_required) || !settings.carType_required) && ((data[i].term && settings.term_required) || !settings.term_required) ) 
          .map(i => {
            return {
              id: i,
              location: locations && locations[i] ? locations[i]:null,
              carType: data[i].carType ? data[i].carType : null,
              vehicleNumber:  data[i].vehicleNumber ? data[i].vehicleNumber : null,
              fleetadmin:  data[i].fleetadmin ? data[i].fleetadmin : null,
              firstName: data[i].firstName,
              lastName: data[i].lastName,
              queue: data[i].queue
            };
          });
          dispatch({
            type: FETCH_ALL_DRIVERS_SUCCESS,
            payload: arr
          });
        }, appType === 'app' ? {onlyOnce: true} : settings && settings.realtime_drivers ? null : {onlyOnce: true})
    } else {
      dispatch({
        type: FETCH_ALL_DRIVERS_FAILED,
        payload: "No users available."
      });
    }
  },appType === 'app'? {onlyOnce: true}: settings && settings.realtime_drivers ? null : {onlyOnce: true});
};

export const addUser = (userdata) => (dispatch) => {
  const {
    usersRef
  } = firebase;

  dispatch({
    type: EDIT_USER,
    payload: userdata
  });

  delete userdata.tableData;

  push(usersRef, userdata).then(() => {
    dispatch({
      type: EDIT_USER_SUCCESS,
      payload: null
    });
  }).catch((error) => {
    dispatch({
      type: EDIT_USER_FAILED,
      payload: error
    });
  });
}

export const editUser = (id, user) => (dispatch) => {

  const {
    singleUserRef
  } = firebase;

  dispatch({
    type: EDIT_USER,
    payload: user
  });
  let editedUser = user;
  delete editedUser.id;
  delete editedUser.tableData;
  set(singleUserRef(id), editedUser);
}

export const updateUserCar = (id, data) => (dispatch) => {
  const {
    singleUserRef
  } = firebase;

  dispatch({
    type: EDIT_USER,
    payload: data  
  });
  update(singleUserRef(id),data);
}

export const updateLicenseImage = (uid, imageBlob, imageType) => async (dispatch) => {

  const {
    singleUserRef,
    driverDocsRef,
    driverDocsRefBack,
    verifyIdImageRef
  } = firebase;

  let profile = {};
  if(imageType === 'licenseImage'){
    await uploadBytesResumable(driverDocsRef(uid),imageBlob);
    let image = await getDownloadURL(driverDocsRef(uid));
    profile.licenseImage = image;
  }
  if(imageType === 'licenseImageBack'){
    await uploadBytesResumable(driverDocsRefBack(uid),imageBlob);
    let image1 = await getDownloadURL(driverDocsRefBack(uid));
    profile.licenseImageBack = image1;
  }
  if(imageType === 'verifyIdImage'){
    await uploadBytesResumable(verifyIdImageRef(uid),imageBlob);
    let image1 = await getDownloadURL(verifyIdImageRef(uid));
    profile.verifyIdImage = image1;
  }
  update(singleUserRef(uid),profile);
  dispatch({
    type: EDIT_USER,
    payload: uid
  });
};

export const deleteUser = (uid) => (dispatch) => {

  const {
    auth,
    walletHistoryRef,
    singleUserRef,
    userNotificationsRef,
    carsRef,
    carEditRef
  } = firebase;

  dispatch({
    type: DELETE_USER,
    payload: uid
  });

  if (auth.currentUser.uid === uid) {
    off(singleUserRef(uid));
    off(walletHistoryRef(uid));
    off(userNotificationsRef(uid));
  }

  onValue(singleUserRef(uid), userdata => {
    const profile = userdata.val();
    if(profile.usertype === 'driver'){
      onValue(carsRef(uid, profile.usertype), carssnapshot => {
        let cars = carssnapshot.val();
        if (cars) {
          const arr = Object.keys(cars);
          for(let i = 0; i < arr.length; i++){
            remove(carEditRef(arr[i]));
          }
        }
      });
    } 
    
    remove(singleUserRef(uid)).then(() => {
      if (auth.currentUser.uid === uid) {
        signOut(auth);
        dispatch({
          type: USER_DELETED,
          payload: null
        });
      } else {
        remove(singleUserRef(uid)).then(() => {
          dispatch({
            type: DELETE_USER_SUCCESS,
            payload: null
          });
        }).catch((error) => {
          dispatch({
            type: DELETE_USER_FAILED,
            payload: error
          });
        });
      }
    });
  },{onlyOnce:true});
}
