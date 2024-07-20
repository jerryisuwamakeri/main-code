import store from './store/store';
import {
    FirebaseContext,
    FirebaseProvider
} from './config/configureFirebase';
import * as authactions from './actions/authactions';
import * as bookingactions from './actions/bookingactions';
import * as bookinglistactions from './actions/bookinglistactions';
import * as cancelreasonactions from './actions/cancelreasonactions';
import * as cartypeactions from './actions/cartypeactions';
import * as estimateactions from './actions/estimateactions';
import * as driverearningaction from './actions/driverearningaction';
import * as earningreportsaction from './actions/earningreportsaction';
import * as notificationactions from './actions/notificationactions';
import * as promoactions from './actions/promoactions';
import * as usersactions from './actions/usersactions';
import * as settingsactions from './actions/settingsactions';
import * as paymentactions from './actions/paymentactions';
import * as tripactions from './actions/tripactions';
import * as taskactions from './actions/taskactions';
import * as locationactions from './actions/locationactions';
import * as chatactions from './actions/chatactions';
import * as withdrawactions from './actions/withdrawactions';
import * as DateFunctions from './other/DateFunctions';
import * as GoogleAPIFunctions from './other/GoogleAPIFunctions';
import * as GeoFunctions from './other/GeoFunctions';
import * as languageactions from './actions/languageactions';
import * as addressactions from './actions/addressactions';
import * as NotificationFunctions from './other/NotificationFunctions';
import * as caractions from './actions/caractions';
import * as smtpactions from './actions/smtpactions';
import * as smsactions from './actions/smsactions';
import countries from './other/GetCountries';
import * as sosctions from './actions/sosaction';
import * as complainactions from './actions/complainactions';
import * as usedreferralaction from "./actions/usedreferralaction";
import * as fetchFleetAdminEarnings from "./actions/fleetadminearningaction";

const api =  {
    ...authactions,
    ...bookingactions,
    ...bookinglistactions,
    ...cancelreasonactions,
    ...cartypeactions,
    ...estimateactions,
    ...driverearningaction,
    ...earningreportsaction,
    ...notificationactions,
    ...promoactions,
    ...usersactions,
    ...settingsactions,
    ...paymentactions,
    ...tripactions,
    ...taskactions,
    ...locationactions,
    ...addressactions,
    ...chatactions,
    ...withdrawactions,
    ...DateFunctions,
    ...GoogleAPIFunctions,
    ...GeoFunctions,
    ...languageactions,
    ...NotificationFunctions,
    ...caractions,
    ...complainactions,
    ...smtpactions,
    ...smsactions,
    ...sosctions,
    ...usedreferralaction,
    ...fetchFleetAdminEarnings,
    countries: countries   
};

export {
    FirebaseContext,
    FirebaseProvider,
    store,
    api
}