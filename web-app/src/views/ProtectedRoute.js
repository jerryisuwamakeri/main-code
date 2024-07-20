import React, { useEffect, useState } from 'react';
import {Navigate} from 'react-router-dom';
import { useSelector } from "react-redux";
import ResponsiveDrawer from '../components/ResponsiveDrawer';
import CircularLoading from "../components/CircularLoading";

function matchUser(permit, usertype){
    let permitions = permit? permit.split(',') : [];
    let permitted = false;
    for(let i=0;i<permitions.length;i++){
        permitted = usertype === permitions[i]?true:false
        if(permitted) break;
    }
    return permitted;
}

function ProtectedRoute({ permit,children }) {
    const auth = useSelector(state => state.auth);
    const [checkedAuth,setCheckedAuth] = useState(false);

    useEffect(()=>{
        if(auth.profile && auth.profile.uid){
            setCheckedAuth(true);
        }
        if(auth.error && auth.error.msg && !auth.profile){
            setCheckedAuth(true);
        }
    },[auth.profile,auth.error])

    return(
        checkedAuth?
            auth.profile && auth.profile.uid?
                matchUser(permit,auth.profile.usertype) ? <ResponsiveDrawer>{children}</ResponsiveDrawer>:<Navigate to="/login" />
            :<Navigate to="/login" /> 
        :<CircularLoading/>
    )
}

export default ProtectedRoute;