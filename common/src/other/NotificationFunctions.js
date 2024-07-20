import { firebase } from '../config/configureFirebase';
import store from '../store/store';

export const RequestPushMsg = (token, data) => {
    const {
        config
    } = firebase;
    
    const settings = store.getState().settingsdata.settings;
    let host = window && window.location && settings.CompanyWebsite === window.location.origin? window.location.origin : `https://${config.projectId}.web.app`
    let url = `${host}/send_notification`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "token": token,
            ...data
        })
    })
    .then((response) => {

    })
    .catch((error) => {
        console.log(error)
    });
}