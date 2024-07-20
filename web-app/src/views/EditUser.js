import React, { useState, useRef, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Typography, TextField, Button, Grid, Card, Avatar, FormControl, useMediaQuery } from "@mui/material";
import { api } from "common";
import { useTranslation } from "react-i18next";
import CircularLoading from "components/CircularLoading";
import { makeStyles } from "@mui/styles";
import { MAIN_COLOR, SECONDORY_COLOR, FONT_FAMILY } from "../common/sharedFunctions";
import { useParams } from "react-router-dom";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AlertDialog from "../components/AlertDialog";
import { colors } from "components/Theme/WebTheme";

const useStyles = makeStyles((theme) => ({
    typography: {
        fontFamily: FONT_FAMILY,
      },
    textField: {
        "& label.Mui-focused": {
            color: MAIN_COLOR,
        },
        "& .MuiInput-underline:after": {
            borderBottomColor: MAIN_COLOR,
        },
        "& .MuiFilledInput-underline:after": {
            borderBottomColor: MAIN_COLOR,
        },
        "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
                borderColor: MAIN_COLOR,
            },
        },
        "& input": {
            fontFamily: FONT_FAMILY,
          },
    },
    rootRtl: {
        "& label": {
            right: 10,
            left: "auto",
            paddingRight: 20,
            fontFamily: FONT_FAMILY,
        },
        "& legend": {
            textAlign: "right",
            marginRight: 20,
            fontFamily: FONT_FAMILY,
        },
        "& label.Mui-focused": {
            color: MAIN_COLOR,
        },
        "& .MuiInput-underline:after": {
            borderBottomColor: MAIN_COLOR,
        },
        "& .MuiFilledInput-underline:after": {
            borderBottomColor: MAIN_COLOR,
        },
        "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
                borderColor: MAIN_COLOR,
            },
        },
        "& input": {
            fontFamily: FONT_FAMILY,
          },
    },
    rootRtl_3: {
        "& label": {
            right: 0,
            left: "auto",
            paddingRight: 20,
            fontFamily: FONT_FAMILY,
        },
        "& legend": {
            textAlign: "right",
            marginRight: 20,
            fontFamily: FONT_FAMILY,
        },
        "& label.Mui-focused": {
            color: MAIN_COLOR,
        },
        "& .MuiInput-underline:after": {
            borderBottomColor: MAIN_COLOR,
        },
        "& .MuiFilledInput-underline:after": {
            borderBottomColor: MAIN_COLOR,
        },
        "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
                borderColor: MAIN_COLOR,
            },
        },
        "& input": {
            fontFamily: FONT_FAMILY,
          },
    },
    rootRtl_2: {
        "& label": {
            right: 5,
            left: "auto",
            paddingRight: 20,
            fontFamily: FONT_FAMILY,
        },
        "& legend": {
            textAlign: "right",
            marginRight: 20,
            fontFamily: FONT_FAMILY,
        },
        "& label.Mui-focused": {
            color: MAIN_COLOR,
        },
        "& .MuiInput-underline:after": {
            borderBottomColor: MAIN_COLOR,
        },
        "& .MuiFilledInput-underline:after": {
            borderBottomColor: MAIN_COLOR,
        },
        "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
                borderColor: MAIN_COLOR,
            },
        },
        "& input": {
            fontFamily: FONT_FAMILY,
          },
    },
    rootRtl_1: {
        "& label": {
            right: 10,
            left: "auto",
            paddingRight: 20,
            fontFamily: FONT_FAMILY,
        },
        "& legend": {
            textAlign: "right",
            marginRight: 15,
            fontFamily: FONT_FAMILY,
        },
        "& label.Mui-focused": {
            color: MAIN_COLOR,
        },
        "& .MuiInput-underline:after": {
            borderBottomColor: MAIN_COLOR,
        },
        "& .MuiFilledInput-underline:after": {
            borderBottomColor: MAIN_COLOR,
        },
        "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
                borderColor: MAIN_COLOR,
            },
        },
        "& input": {
            fontFamily: FONT_FAMILY,
          },
    },

    selectField_rtl: {
        color: "black",
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: MAIN_COLOR,
        },
        "& label": {
            right: 0,
            left: "auto",
            fontFamily: FONT_FAMILY,

        },
        "& legend": {
            textAlign: "right",
            marginRight: 35,
            fontFamily: FONT_FAMILY,
        },
    },

    right: {
        textAlign: "right", right: 0, left: "auto", paddingRight: 40, fontFamily: FONT_FAMILY,
    },
    right_1: {
        textAlign: "right", right: 0, left: "auto", paddingRight: 45, fontFamily: FONT_FAMILY,
    },


    selectField: {
        color: "black",
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: MAIN_COLOR,
        },
    },
}));

function EditUser() {
    const { id, usertype } = useParams();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir();
    const staticusers = useSelector((state) => state.usersdata.staticusers);
    const settings = useSelector((state) => state.settingsdata.settings);
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loaded = useRef(false);
    const fileInputRef = useRef();
    const { editUser, fetchUsersOnce, updateCustomerProfileImage, checkUserExists, addUser } = api;
    const [commonAlert, setCommonAlert] = useState({ open: false, msg: "" });
    const [data, setData] = useState(null);
    const [oldData, setOldData] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();
    const [fleetAdmins, setFleetAdmins] = useState([]);
    const [fleetAdminsObj, setFleetAdminsObj] = useState("");
    const [approved, setApproved] = useState(false);
    const isMidScreen = useMediaQuery('(max-width:1199px)');
    const [signUpReferraldata,setsignupReferralData]= useState("")

    useEffect(() => {
        dispatch(fetchUsersOnce());
    }, [dispatch, fetchUsersOnce]);

    useEffect(() => {
        if (id && usertype) {
            if (staticusers) {
                const user = staticusers.filter(
                    (user) => user.id === id.toString() && user.usertype === usertype.toString()
                )[0];
                const refferedUser = staticusers.filter(
                    (value) =>value.id === user?.signupViaReferral
                )
                if(refferedUser.length>0){
                    const refferedData= `${refferedUser[0].firstName} ${refferedUser[0].lastName} (${refferedUser[0].mobile} ) ${refferedUser[0].email}` 
                    setsignupReferralData(refferedData)
                }
                if (!user) {
                    navigate("/404");
                }
                setData(user);
                setOldData(user);
            }
        } else {
            setData([]);
        }
        loaded.current = true;
    }, [staticusers, id, navigate, usertype]);

    useEffect(() => {
        if (staticusers) {
            if (auth && auth.profile && auth.profile.usertype === "admin") {
                let arr = staticusers.filter((user) => user.usertype === "fleetadmin");
                let obj = {};
                let arr2 = [];
                for (let i = 0; i < arr.length; i++) {
                    let user = arr[i];
                    arr2.push({
                        id: user.id,
                        desc:
                            user.firstName +
                            " " +
                            user.lastName +
                            " (" +
                            (settings.AllowCriticalEditsAdmin
                                ? user.mobile
                                : t("hidden_demo")) +
                            ") " +
                            (settings.AllowCriticalEditsAdmin
                                ? user.email
                                : t("hidden_demo")),
                    });
                    obj[user.id] =
                        user.firstName +
                        " " +
                        user.lastName +
                        " (" +
                        (settings.AllowCriticalEditsAdmin
                            ? user.mobile
                            : t("hidden_demo")) +
                        ") " +
                        (settings.AllowCriticalEditsAdmin ? user.email : t("hidden_demo"));
                }
                setFleetAdmins(arr2);
                setFleetAdminsObj(obj);
            }
        }
    }, [
        staticusers,
        auth.profile.usertype,
        auth.profile.uid,
        settings.AllowCriticalEditsAdmin,
        auth,
        t
    ]);

    const profileImageChange = async (e) => {
        setProfileImage(e.target.files[0]);
    };

    const handleCommonAlertClose = (e) => {
        e.preventDefault();
        setCommonAlert({ open: false, msg: "" });
    };

    const handleInputChange = (e) => {
        setData({ ...data, [e.target.id]: e.target.value });
    };

    const handleChangeApproved = (event) => {
        setApproved(event.target.value);
        setData({ ...data, approved: event.target.value });
    };

    const getKeyByValue = (object, value) => {
        return Object.keys(object).find((key) => object[key] === value);
    };

    const handleChangeFleetAdmin = (event) => {
        setData({
            ...data,
            fleetadmin: getKeyByValue(fleetAdminsObj, event.target.value),
        });
    };
    const navigateToInfo = () => {
        setTimeout(() => {
            setProfileImage(null);
            if (usertype === "customer") {
                navigate(`/users/customerdetails/${data.id}`);
            } else if (usertype === "driver") {
                navigate(`/users/driverdetails/${data.id}`);
            } else if (usertype === "fleetadmin") {
                navigate("/users/2");
            } else if (usertype === "admin") {
                navigate("/users/3");
            }
            setLoading(false);
        }, 1000);
    }
    const handleUpdate = () => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!(data.lastName && data.firstName)) {
            setCommonAlert({ open: true, msg: t("proper_input_name") });
        } else if (!re.test(data.email)) {
            setCommonAlert({ open: true, msg: t("proper_email") });
        } else if (!data.mobile) {
            setCommonAlert({ open: true, msg: t("proper_mobile") });
        } else {
            if (settings.AllowCriticalEditsAdmin) {
                setLoading(true);

                if (profileImage) {
                    updateCustomerProfileImage(profileImage, data.id).then(() => {
                        dispatch(fetchUsersOnce());
                        navigateToInfo()
                    });
                }
                if (
                    JSON.stringify(oldData) !== JSON.stringify(data) &&
                    Object.keys(data).length !== 0
                ) {
                    dispatch(editUser(data.id, { ...data }));
                    dispatch(fetchUsersOnce());
                    navigateToInfo()
                }
                if (
                    JSON.stringify(oldData) === JSON.stringify(data) &&
                    (!profileImage && Object.keys(data).length === 0)
                ) {
                    setCommonAlert({ open: true, msg: t("make_changes_to_update") });
                    setLoading(false);
                }

            }else {
                setCommonAlert({ open: true, msg: t('demo_mode') });
            }
            loaded.current = true;
        }
    };


    const handleAdd = () => {
        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!(data.lastName && data.firstName)) {
            setCommonAlert({ open: true, msg: t("proper_input_name") });
        } else if (!re.test(data.email)) {
            setCommonAlert({ open: true, msg: t("proper_email") });
        } else if (!data.mobile) {
            setCommonAlert({ open: true, msg: t("proper_mobile") });
        } else {
            new Promise((resolve, reject) => {
                setLoading(true);
                setTimeout(() => {
                    checkUserExists(data).then((res) => {
                        if (res.users && res.users.length > 0) {
                            setCommonAlert({ open: true, msg: t("user_exists") });
                            reject(new Error("User already exists"));
                        } else if (res.error) {
                            setCommonAlert({ open: true, msg: t("email_or_mobile_issue") });
                            reject(new Error("Email or Mobile issue"));
                        } else {
                            const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                            const reference = [...Array(5)]
                                .map((_) => c[~~(Math.random() * c.length)])
                                .join("");
                            data["createdAt"] = new Date().getTime();
                            let role = auth.profile.usertype;
                            data['approved'] = approved;
                            data['walletBalance'] = 0;
                            if(usertype === "customer"){
                                data["usertype"] = "customer";
                                data["referralId"] = reference;
                                if (role === "fleetadmin") {
                                    data["fleetadmin"] = auth.profile.uid;
                                }
                                resolve();
                            }else if(usertype === "driver"){
                                data["driverActiveStatus"] = false;
                                data["usertype"] = "driver";
                                data["referralId"] = reference;
                                data["queue"] = false;
                                if (role === "fleetadmin") {
                                    data["fleetadmin"] = auth.profile.uid;
                                }
                                if(approved === true){
                                    data['adminApprovedTrue'] = true;
                                }else{
                                    data['adminApprovedTrue'] = false;
                                }
                                resolve();
                            }else if(usertype === "fleetadmin") {
                                data["usertype"] = "fleetadmin";
                                data["createdAt"] = new Date().getTime();
                                resolve();
                            }else if(usertype === "admin"){
                                data["usertype"] = usertype.toString();
                                data["createdAt"] = new Date().getTime();
                                data["approved"] = true;
                                resolve();
                            }else{
                                reject(new Error("Invalid usertype Add"));
                                setCommonAlert({ open: true, msg: t("invalid_userType_add") });
                            }
                            dispatch(addUser(data));
                            dispatch(fetchUsersOnce());
                            handleBackNavigation()

                        }
                    }, 600);
                });
            }).catch((e) => {
                console.error("caught an error:",e)
            }).finally(() => {
                setLoading(false);
            });
        }
    };

    const handleBackNavigation = ()=>{
        if(usertype === "customer"){
            navigate("/users/0");
        }else if(usertype === "driver"){
            navigate("/users/1");
        }else if (usertype === "fleetadmin"){
            navigate("/users/2");
        }else if(usertype === "admin"){
            navigate("/users/3");
        }
    }

    const isDriverOrFleetAdmin = usertype === "driver" || usertype === "fleetadmin";
    const isNotAdmin = auth.profile.usertype === 'fleetadmin' || auth.profile.usertype === 'driver';

    return loading ? (
        <CircularLoading />
    ) : (
        <div>
            <Card
                style={{
                    borderRadius: "19px",
                    backgroundColor: colors.WHITE,
                    minHeight: 100,
                    maxWidth: "75vw",
                    marginTop: 20,
                    marginBottom: 20,
                    padding: 20,
                    boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                }}
            >
                <Typography
                    variant="h5"
                    style={{
                        margin: "10px 10px 0 5px",
                        textAlign: isRTL === "rtl" ? "right" : "left",
                        fontFamily: FONT_FAMILY,
                    }}
                >
                    {id ?
                        (
                            (usertype === "customer" && t("update_customer_title")) || (usertype === "driver" && t("update_driver_title")) || (usertype === "fleetadmin" && t("update_fleetAdmin_title")) || (usertype === "admin" && t("update_admin_title"))
                        )
                        :
                        (
                            (usertype === "customer" && t("add_customer_title")) || (usertype === "driver" && t("add_driver_title")) || (usertype === "fleetadmin" && t("add_fleetadmin_title")) || (usertype === "admin" && t("add_admin_title"))
                        )
                    }
                </Typography>
                <div
                    dir={isRTL === "rtl" ? "rtl" : "ltr"}
                >
                    <Button
                        variant="text"
                        onClick={handleBackNavigation}
                    >
                        <Typography
                            style={{
                                margin: "10px 10px 0 5px",
                                textAlign: isRTL === "rtl" ? "right" : "left",
                                fontWeight: "bold",
                                color: MAIN_COLOR,
                                fontFamily: FONT_FAMILY,
                            }}
                        >
                            {`<<- ${t("go_back")}`}
                        </Typography>
                    </Button>
                </div>
                <Grid
                    container
                    sx={{ direction: isRTL === "rtl" ? "rtl" : "ltr", }}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    {id ?
                        <Grid item xs={12} sm={12} md={12} lg={3} xl={3} display={"flex"} justifyContent={"center"} >
                            <div style={{ width: 200, height: 250,  marginBottom: ((usertype==='customer'||usertype==='driver')?70:0)  }}>
                                {profileImage ? (
                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <img
                                            src={URL.createObjectURL(profileImage)}
                                            alt="Profile"
                                            style={{
                                                width: 200,
                                                height: 250,
                                                borderRadius: "19px",
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 200,
                                                height: 250,
                                                display: "flex",
                                                flexDirection: "column",
                                                boxShadow: 3,
                                                border: `2px dashed ${colors.WALLET_CARD_SHADOW}`,
                                                fontSize: 16,
                                                background: "none",
                                                color: "inherit",
                                                fontWeight: "bold",
                                                textAlign:'center'
                                            }}
                                            variant="square"
                                        >
                                            <FileUploadIcon
                                                sx={{
                                                    fontSize: 100,
                                                    marginBottom: 3,
                                                    color: "grey",
                                                }}
                                            />
                                            {<Typography className={classes.typography}>{t("upload_profile_image")}</Typography>}
                                        </Avatar>
                                    </div>
                                )}
                                <input
                                    onChange={(event) => profileImageChange(event)}
                                    multiple={false}
                                    ref={fileInputRef}
                                    type="file"
                                    hidden
                                />
                            </div>
                        </Grid>
                        : null}
                    <Grid item xs={12} sm={12} md={12} lg={9} xl={9}>
                        <Grid
                            container
                            spacing={2}
                            sx={{
                                display: "flex",
                                gridTemplateColumns: "50%",
                                rowGap: "20px",
                                marginY: 1,
                                direction: isRTL === "rtl" ? "rtl" : "ltr",
                            }}
                        >
                            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                <TextField
                                     InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                                    label={t("firstname")}
                                    id="firstName"
                                    value={data?.firstName || ""}
                                    fullWidth
                                    onChange={handleInputChange}
                                    className={isRTL === "rtl" ? classes.rootRtl_1 : classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                <TextField
                                     InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                                    label={t("last_name")}
                                    id="lastName"
                                    value={data?.lastName || ""}
                                    fullWidth
                                    onChange={handleInputChange}
                                    className={isRTL === "rtl" ? classes.rootRtl_1 : classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                <TextField
                                     InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                                    label={t("mobile")}
                                    id="mobile"
                                    value={id ? settings.AllowCriticalEditsAdmin ? data?.mobile || "" : t("hidden_demo") : data?.mobile || ""}
                                    fullWidth
                                    disabled={id ? true : false}
                                    onChange={handleInputChange}
                                    className={isRTL === "rtl" ? classes.rootRtl_2 : classes.textField}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                lg={6}
                                xl={6}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <TextField
                                     InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                                    label={t("email")}
                                    id="email"
                                    value={id ? settings.AllowCriticalEditsAdmin ? data?.email || "" : t("hidden_demo") : data?.email || ""}
                                    fullWidth
                                    disabled={id ? true : false}
                                    onChange={handleInputChange}
                                    className={isRTL === "rtl" ? classes.rootRtl : classes.textField}
                                />
                            </Grid>
                            {usertype !== "admin" ?

                                <>

                                    {usertype !== "fleetadmin" ?
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={6}
                                            xl={6}
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <TextField
                                                 InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                                                label={t("verify_id")}
                                                id="verifyId"
                                                value={data?.verifyId || ""}
                                                fullWidth
                                                onChange={handleInputChange}
                                                className={isRTL === "rtl" ? classes.rootRtl_3 : classes.textField}
                                            />
                                        </Grid>
                                        : null}
                                        {id? 
                                        <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={6}
                                        xl={6}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                        >
                                        <TextField
                                            label={t("referralId")}
                                            id="referralId"
                                            value={data?.referralId ? data?.referralId : t('no_data_available')}
                                            fullWidth
                                            disabled={id ? true : false}
                                            className={isRTL === "rtl" ? classes.rootRtl_1 : classes.textField}
                                        />
                                        </Grid>
                                        :null}
                                           {id ?
                                           <Grid
                                           item
                                           xs={12}
                                           sm={12}
                                           md={12}
                                           lg={6}
                                           xl={6}
                                           style={{
                                               display: "flex",
                                               justifyContent: "center",
                                               alignItems: "center",
                                           }}
                                           >
                                           <TextField
                                               label={t("signup_via_referral")}
                                               id="signup_via_referral"
                                               value={ settings.AllowCriticalEditsAdmin? signUpReferraldata?signUpReferraldata: t('no_data_available') : t("hidden_demo")}
                                               fullWidth
                                               disabled={id ? true : false}
                                               className={isRTL === "rtl" ? classes.rootRtl_1 : classes.textField}
                                           />
                                           </Grid>
                                           : null} 
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={6}
                                        xl={6}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <FormControl fullWidth style={{ direction: isRTL === "rtl" ? "rtl" : 'ltr' }}>
                                            <InputLabel id="demo-simple-select-label" className={isRTL === "rtl" ? classes.right : ""} sx={{ "&.Mui-focused": { color: MAIN_COLOR } }}>
                                                {<Typography className={classes.typography}>{t("approve_status")}</Typography>}
                                            </InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data?.approved ? data.approved : approved}
                                                label={t("approve_status")}
                                                onChange={handleChangeApproved}
                                                className={isRTL === "rtl" ? classes.selectField_rtl : classes.selectField}
                                            >
                                                <MenuItem style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }} value={true}>
                                                {<Typography className={classes.typography}>{t("approved")}</Typography>}
                                                </MenuItem>
                                                <MenuItem style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }} value={false}>
                                                {<Typography className={classes.typography}>{t("not_approved")}</Typography>}
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    {auth?.profile?.usertype !== "fleetadmin" && usertype === "driver" ? (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={6}
                                            xl={6}
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <FormControl fullWidth style={{ direction: isRTL === "rtl" ? "rtl" : 'ltr' }}>
                                                <InputLabel id="fleetadmins" className={isRTL === "rtl" ? classes.right_1 : ""} sx={{ "&.Mui-focused": { color: MAIN_COLOR } }}>
                                                {<Typography className={classes.typography}>{t("fleetadmins")}</Typography>}
                                                    </InputLabel>
                                                <Select
                                                    labelId="fleetadmins"
                                                    id="select"
                                                    value={fleetAdminsObj[data?.fleetadmin] || ""}
                                                    label={t("fleetadmins")}
                                                    onChange={handleChangeFleetAdmin}
                                                    className={isRTL === "rtl" ? classes.selectField_rtl : classes.selectField}
                                                >
                                                    {fleetAdmins
                                                        ? fleetAdmins.map((e) => (
                                                            <MenuItem style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }} key={e.id} value={fleetAdminsObj[e.id]}>
                                                                {<Typography className={classes.typography}>{e.desc}</Typography>}
                                                            </MenuItem>
                                                        ))
                                                        : null}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    ) : null}
                                </>

                                : null}

                            <Grid item xs={12} sm={12} md={12} lg={(isDriverOrFleetAdmin && !isNotAdmin) ? 6 : 12} xl={(isDriverOrFleetAdmin && !isNotAdmin) ? 6 : 12}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Button
                                    style={{
                                        borderRadius: "19px",
                                        backgroundColor: MAIN_COLOR,
                                        minHeight: 50,
                                        textAlign: "center",
                                        width: (((isDriverOrFleetAdmin && !isNotAdmin) || isMidScreen) ? "100%" : "50%")
                                    }}
                                    onClick={id ? handleUpdate : handleAdd}
                                    variant="contained"
                                >
                                    <Typography
                                        style={{
                                            color: "white",
                                            textAlign: "center",
                                            fontSize: 16,
                                            fontFamily: FONT_FAMILY,
                                        }}
                                    >
                                        { id ? t("update") : t("add")}
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
            <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>
                {commonAlert.msg}
            </AlertDialog>
        </div>
    );
}

export default EditUser