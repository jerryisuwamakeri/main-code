import React, { useState, useEffect, } from "react";
import { Typography, Button, Grid, Card, Avatar, } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { useTranslation } from "react-i18next";
import { MAIN_COLOR, SECONDORY_COLOR, FONT_FAMILY } from "../common/sharedFunctions";
import { api } from "common";
import Userinfo from "../components/Userinfo";
import { colors } from "components/Theme/WebTheme";

function UserInfoDetails(props) {
    const {data} = props;
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir();
    const navigate = useNavigate();
    const { fetchUsersOnce, } = api;
    const dispatch = useDispatch();
    const settings = useSelector((state) => state.settingsdata.settings);
    const staticusers = useSelector((state) => state.usersdata.staticusers);
    const [loading, setLoading] = useState(true);
    const [fleetAdminsObj, setFleetAdminsObj] = useState();
    const [role, setRole] = useState(null);
    const auth = useSelector(state => state.auth);

    const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

    useEffect(() => {
        if (auth.profile && auth.profile.usertype) {
          setRole(auth.profile.usertype);
        }
      }, [auth.profile]);

    useEffect(() => {
        if (staticusers) {
          if (role === 'admin' || role === 'fleetadmin') {
            let arr = staticusers.filter(user => user.usertype === 'fleetadmin');
            let obj = {};
    
            for (let i = 0; i < arr.length; i++) {
              let user = arr[i];
    
              obj[user.id] = user.firstName + ' ' + user.lastName;
            }
    
    
            if (!isEqual(obj, fleetAdminsObj)) {
              setFleetAdminsObj(obj);
            }
          }
        }
      }, [staticusers, role, fleetAdminsObj]);

    useEffect(()=>{
        if(data){
            setLoading(false)
        }
    },[data])
   

    useEffect(() => {
        dispatch(fetchUsersOnce());
    }, [dispatch, fetchUsersOnce]);


    return loading ? (
        <CircularLoading />
    ) : (
        <Card
            style={{
                borderRadius: "19px",
                backgroundColor: colors.WHITE,
                minHeight: 100,
                marginBottom: 20,
                padding: 20,
                boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
            }}
        >
            <div
                dir={isRTL === "rtl" ? "rtl" : "ltr"}
            >
                <Button
                    variant="text"
                    onClick={() => {
                        data?.usertype ==="customer" ? 
                         navigate("/users/0")
                        :navigate("/users/1")
                    }}
                >
                    <Typography
                        style={{
                            textAlign: isRTL === "rtl" ? "right" : "left",
                            fontWeight: "bold",
                            color: MAIN_COLOR,
                            fontFamily:FONT_FAMILY
                        }}
                    >
                        {`<<- ${t("go_back")}`}
                    </Typography>
                </Button>
            </div>
            <Grid container spacing={1} sx={{ direction: isRTL === "rtl" ? "rtl" : "ltr", }}>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={4}
                    xl={4}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 5,
                    }}
                >
                    {data.profile_image ? (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <img
                                src={data.profile_image}
                                alt="Profile"
                                style={{
                                    width: 200,
                                    height: 250,
                                    borderRadius: "19px",
                                }}
                            />
                        </div>
                    ) : (
                        <Avatar sx={{ width: 200, height: 300, fontFamily:FONT_FAMILY }} variant="square">
                            {data?.firstName?.slice(0, 1) + " " + data?.lastName?.slice(0, 1)}
                        </Avatar>
                    )}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={8} xl={8} gap={2}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 5,
                    }}
                >
                    <Grid container spacing={2} sx={{ direction: isRTL === "rtl" ? "rtl" : "ltr", }}>
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Userinfo title={"first_name"} value={data?.firstName} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Userinfo title={"last_name"} value={data?.lastName} />
                        </Grid>
                    </Grid>
                    <Userinfo title={"mobile"} value={settings.AllowCriticalEditsAdmin ? data?.mobile : t("hidden_demo")} />
                    <Userinfo title={"email"} value={settings.AllowCriticalEditsAdmin ? data?.email : t("hidden_demo")} />
                    <Grid container spacing={2} direction="row" justifyContent={"center"}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Userinfo title={"verify_id"} value={data?.verifyId ?
                                settings.AllowCriticalEditsAdmin ? data.verifyId : t("hidden_demo")
                                : t('no_data_available')
                            } />
                        </Grid>
                    </Grid>
                    {
                        (data?.usertype === "driver" || data?.usertype === "customer") && data?.fleetadmin ?  <Userinfo title={"fleetadmins"} value={(fleetAdminsObj && fleetAdminsObj[data?.fleetadmin] ? fleetAdminsObj[data?.fleetadmin] : "" )+ (data?.fleetadmin
                                ? settings.AllowCriticalEditsAdmin
                                  ? " ( " + data.fleetadmin + " ) "
                                  : " ( " + t("hidden_demo") + " ) "
                                : t('no_data_available'))
                            } />
                        :null
                    }
                </Grid>
            </Grid>
        </Card>
    );
}

export default UserInfoDetails;


