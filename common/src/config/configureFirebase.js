
import React, { createContext } from 'react';
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase, ref, query, orderByChild,equalTo } from "firebase/database";
import { initializeAuth, getAuth, GoogleAuthProvider, OAuthProvider, signInWithPhoneNumber, PhoneAuthProvider, RecaptchaVerifier, unlink, updatePhoneNumber, linkWithPhoneNumber, browserLocalPersistence, browserPopupRedirectResolver } from "firebase/auth";
import { getStorage, ref as stRef } from "firebase/storage";
import { getReactNativePersistence } from './react-native-persistance';

const FirebaseContext = createContext(null);

let firebase = {
    app: null,
    database: null,
    auth: null,
    storage: null,
}   

const createFullStructure = (app, db, auth, storage, config) => {
    return {
        app: app,
        config: config,
        database: db,
        auth: auth,
        storage: storage,
        authRef:getAuth,
        googleProvider:new GoogleAuthProvider(),
        appleProvider:new OAuthProvider('apple.com'),
        phoneProvider:new PhoneAuthProvider(auth),          
        RecaptchaVerifier: RecaptchaVerifier,
        signInWithPhoneNumber: signInWithPhoneNumber,   
        updatePhoneNumber:updatePhoneNumber,
        unlink: unlink,
        googleCredential: (idToken, accessToken)=> GoogleAuthProvider.credential(idToken, accessToken),    
        linkWithPhoneNumber: linkWithPhoneNumber,
        mobileAuthCredential: (verificationId,code) => PhoneAuthProvider.credential(verificationId, code),           
        usersRef: ref(db, 'users'),
        bookingRef: ref(db, 'bookings'),
        cancelreasonRef: ref(db, 'cancel_reason'),
        settingsRef: ref(db, 'settings'),
        smtpRef: ref(db, "smtpdata"),
        smsRef: ref(db, "smsConfig"),
        carTypesRef: ref(db, 'cartypes'),
        carTypesEditRef:(id) => ref(db, "cartypes/"+ id),
        carDocImage:(id) =>  stRef(storage, `cartypes/${id}`),     
        promoRef: ref(db, 'promos'),
        promoEditRef:(id) => ref(db, "promos/"+ id),
        notifyRef: ref(db,"notifications/"),
        notifyEditRef:(id) => ref(db, "notifications/"+ id),
        addressRef: (uid,id) =>  ref(db, "savedAddresses/"+ uid + "/" + id),
        addressEditRef:(uid) => ref(db, "savedAddresses/"+ uid),
        singleUserRef:(uid) => ref(db, "users/" + uid),
        profileImageRef:(uid) => stRef(storage,`users/${uid}/profileImage`),
        verifyIdImageRef:(uid) => stRef(storage,`users/${uid}/verifyIdImage`),
        bookingImageRef:(bookingId,imageType) => stRef(storage,`bookings/${bookingId}/${imageType}`),
        driversRef: query(ref(db, "users"), orderByChild("usertype"), equalTo("driver")),
        driverDocsRef:(uid) => stRef(storage,`users/${uid}/license`),       
        driverDocsRefBack:(uid) => stRef(storage,`users/${uid}/licenseBack`),         
        singleBookingRef:(bookingKey) => ref(db, "bookings/" + bookingKey),
        requestedDriversRef:(bookingKey ) => ref(db, "bookings/" + bookingKey  + "/requestedDrivers"),
        referralIdRef:(referralId) => query(ref(db, "users"), orderByChild("referralId"), equalTo(referralId)),
        trackingRef: (bookingId) => ref(db, 'tracking/' + bookingId),
        tasksRef:() => query(ref(db, 'bookings'), orderByChild('status'), equalTo('NEW')),
        singleTaskRef:(uid,bookingId) => ref(db, "bookings/" + bookingId  + "/requestedDrivers/" + uid),
        bookingListRef:(uid,role) => 
            role == 'customer'? query(ref(db, 'bookings'), orderByChild('customer'), equalTo(uid)):
                (role == 'driver'? 
                    query(ref(db, 'bookings'), orderByChild('driver'), equalTo(uid))
                    :
                    (role == 'fleetadmin'? 
                        query(ref(db, 'bookings'), orderByChild('fleetadmin'), equalTo(uid))
                        : ref(db, 'bookings')
                    )
                ),
        chatRef:(bookingId) => ref(db, 'chats/' + bookingId + '/messages'),
        withdrawRef: ref(db, 'withdraws/'),
        languagesRef: ref(db, "languages"),
        languagesEditRef:(id) => ref(db, "languages/"+ id),
        walletHistoryRef:(uid) => ref(db, "walletHistory/" + uid),  
        userNotificationsRef:(uid) =>  ref(db, "userNotifications/"+ uid),
        userRatingsRef:(uid) =>  ref(db, "userRatings/"+ uid),
        carsRef:(uid,role) => role == 'driver'? 
            query(ref(db, 'cars'), orderByChild('driver'), equalTo(uid))
            :(role == 'fleetadmin'? 
                query(ref(db, 'cars'), orderByChild('fleetadmin'), equalTo(uid))
                : ref(db, 'cars')
            ),
        carAddRef: ref(db, "cars"),
        carEditRef:(id) => ref(db, "cars/"+ id),
        carImage:(id) => stRef(storage,`cars/${id}`),   
        allLocationsRef: ref(db, "locations"),
        userLocationRef:(uid) => ref(db, "locations/"+ uid),
        sosRef: ref(db, 'sos'),
        editSosRef:(id) => ref(db, "sos/" +id),
        complainRef: ref(db, 'complain'),
        editComplainRef:(id) => ref(db, "complain/" +id),
        paymentSettingsRef: ref(db, "payment_settings"),
        usedreferralRef:ref(db,'usedreferral'),
    }
}

const FirebaseProvider  = ({ config, children, AsyncStorage, token }) => {
    let app, auth, database, storage;

    if (!getApps().length) {
        try {
            app = initializeApp(config);

            if (typeof document !== 'undefined') {
                auth = initializeAuth(app, {
                    persistence: browserLocalPersistence,
                    popupRedirectResolver: browserPopupRedirectResolver,
                });
            }
            else{
                auth = initializeAuth(app, {
                    persistence: getReactNativePersistence(AsyncStorage),
                });
            }
            database = getDatabase(app);
            storage = getStorage(app);
        } catch (error) {
            console.log("Error initializing app: " + error);
        }
    } else {
        app = getApp();
        auth = getAuth(app);
        database = getDatabase(app);
        storage = getStorage(app);
    }

    firebase = createFullStructure(app, database, auth, storage, config);

    return (
        <FirebaseContext.Provider value={firebase}>
            {children}
        </FirebaseContext.Provider>
    )
}

export {
    firebase,
    FirebaseProvider,
    FirebaseContext
}