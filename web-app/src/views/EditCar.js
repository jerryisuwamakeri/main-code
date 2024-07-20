import React, { useState, useEffect } from "react";
import AlertDialog from "../components/AlertDialog";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Typography, TextField, Button, Grid, Card, useMediaQuery } from "@mui/material";
import { api } from "common";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import CircularLoading from "components/CircularLoading";
import { colors } from "components/Theme/WebTheme";
import { MAIN_COLOR, SECONDORY_COLOR, FONT_FAMILY } from "../common/sharedFunctions";
import { makeStyles } from "@mui/styles";

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
  selectField: {
    color: "black",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: MAIN_COLOR,
    },
  },
  rootRtl: {
    "& label": {
      right: 0,
      left: "auto",
      paddingRight: 20,
      fontFamily: FONT_FAMILY,
    },
    "& legend": {
      textAlign: "right",
      marginRight: 37,
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
      right: 17,
      left: "auto",
      paddingRight: 12,
      fontFamily: FONT_FAMILY,
    },
    "& legend": {
      textAlign: "right",
      marginRight: 25,
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
  selectField_rtl_2: {
    color: "black",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: MAIN_COLOR,
    },
    "& label": {
      right: 50,
      left: "auto",
      paddingRight: 12,
      fontFamily: FONT_FAMILY,
    },
    "& legend": {
      textAlign: "right",
      marginRight: 20,
      fontFamily: FONT_FAMILY,
    },
  },
  selectField_rtl_1: {
    color: "black",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: MAIN_COLOR,
    },
    "& label": {
      right: 50,
      left: "auto",
      paddingRight: 12,
      fontFamily: FONT_FAMILY,
    },
    "& legend": {
      textAlign: "right",
      marginRight: 25,
      fontFamily: FONT_FAMILY,
    },
  },

  selectField_rtl: {
    color: "black",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: MAIN_COLOR,
    },
    "& label": {
      right: 50,
      left: "auto",
      paddingRight: 12,
      fontFamily: FONT_FAMILY,
    },
    "& legend": {
      textAlign: "right",
      marginRight: 15,
      fontFamily: FONT_FAMILY,
    },
  },

  right: {
    textAlign: "right",
    right: 0,
    left: "auto",
    paddingRight: 40,
    fontFamily: FONT_FAMILY,
  },
}));

const EditCar = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const settings = useSelector((state) => state.settingsdata.settings);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { editCar, updateUserCar } = api;
  const [commonAlert, setCommonAlert] = useState({ open: false, msg: "" });
  const [driversObj, setDriversObj] = useState("");
  const [fleetMapObj, setFleetMapObj] = useState([]);
  const [role, setRole] = useState(null);
  const userdata = useSelector((state) => state.usersdata);
  const [drivers, setDrivers] = useState([]);
  const cartypes = useSelector((state) => state.cartypes);
  const carlistdata = useSelector((state) => state.carlistdata);
  const [driverData, setDriverData] = useState(null);
  const [data, setData] = useState(null);
  const [oldData, setOldData] = useState(null);
  const [carTypeAvailable, setCarTypeAvailable] = useState(null);
  const [carData, setCardata] = useState();
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const isMidScreen = useMediaQuery('(max-width:1199px)');

  useEffect(() => {
    if (id) {
      if (carlistdata && carlistdata.cars) {
        const carData = carlistdata.cars.filter(
          (item) => item.id === id.toString()
        )[0];
        if (!carData) {
          navigate("/404");
        }
        setData(carData);
        setOldData(carData);
      }
    } else {
      setData({
        createdAt: new Date().getTime(),
        car_image:
          "https://cdn.pixabay.com/photo/2012/04/13/20/37/car-33556__480.png",
        vehicleNumber: "",
        vehicleMake: "",
        carType: "",
        driver: auth && auth.profile.usertype === "driver" ? auth.profile.uid : "",
        vehicleModel: "",
        other_info: "",
        active: false,
      });
    }
  }, [carlistdata,id, navigate, auth]);

  useEffect(() => {
    if (carlistdata.cars) {
      setCardata(carlistdata.cars);
    } else {
      setCardata([]);
    }
  }, [carlistdata.cars]);

  useEffect(() => {
    const checkCar = cartypes?.cars.filter(
      (item) => item.name === oldData?.carType
    )[0];
    if (checkCar) {
      setCarTypeAvailable(true);
    } else {
      setCarTypeAvailable(false);
    }
  }, [cartypes, oldData]);

  useEffect(() => {
    if (role !== "driver" && userdata.users) {
      let arr = userdata.users.filter(
        (user) =>
          user.usertype === "driver" &&
          ((role === "fleetadmin" &&
            user.fleetadmin &&
            user.fleetadmin === auth.profile.uid) ||
            role === "admin")
      );
      let obj = {};
      let obj2 = {};
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
            (settings.AllowCriticalEditsAdmin ? user.email : t("hidden_demo")),
        });
        obj[user.id] =
          user.firstName +
          " " +
          user.lastName +
          " (" +
          (settings.AllowCriticalEditsAdmin ? user.mobile : t("hidden_demo")) +
          ") " +
          (settings.AllowCriticalEditsAdmin ? user.email : t("hidden_demo"));
        obj2[user.id] = user.fleetadmin ? user.fleetadmin : null;
      }
      setDrivers(arr2);
      setDriversObj(obj);
      setFleetMapObj(obj2);
    }
  }, [
    userdata.users,
    settings.AllowCriticalEditsAdmin,
    role,
    auth.profile.uid,
    t,
  ]);

  useEffect(() => {
    setDriverData(
      auth.profile.firstName +
      " " +
      auth.profile.lastName +
      " (" +
      (settings.AllowCriticalEditsAdmin
        ? auth.profile.mobile
        : t("hidden_demo")) +
      ") " +
      (settings.AllowCriticalEditsAdmin
        ? auth.profile.email
        : t("hidden_demo"))
    );
  }, [
    auth.profile.lastName,
    auth.profile.mobile,
    auth.profile.email,
    settings.AllowCriticalEditsAdmin,
    auth.profile.firstName,
    t,
  ]);

  useEffect(() => {
    if (auth.profile && auth.profile.usertype) {
      setRole(auth.profile.usertype);
    }
  }, [auth.profile]);

  const getKeyByValue = (object, value) => {
    return Object.keys(object).find((key) => object[key] === value);
  };
  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: "" });
  };

  const handelChangeDriver = (event) => {
    setData({ ...data, driver: getKeyByValue(driversObj, event.target.value) });
  };
  const handelChangeCarType = (event) => {
    setData({ ...data, carType: event.target.value });
  };
  const handleInputChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const updateCar = () => {
    settings.AllowCriticalEditsAdmin
      ? new Promise((resolve) => {
        setLoading(true);
        setTimeout(() => {
          resolve();
          if (data !== oldData) {
            data['fleetadmin'] = data['driver'] ? (fleetMapObj[data['driver']] ? fleetMapObj[data['driver']] : null) : null;
            delete data.tableData;
            dispatch(editCar(data, "Update"));
            if (data.driver !== oldData.driver && oldData.driver && oldData.active) {
              dispatch(updateUserCar(oldData.driver,
                {
                  carType: null,
                  vehicleNumber: null,
                  vehicleMake: null,
                  vehicleModel: null,
                  other_info: null,
                  car_image: null,
                  updateAt: new Date().getTime(),
                })
              );
            }
            setLoading(false);
            navigate("/cars");
          } else {
            setLoading(false);
            setCommonAlert({ open: true, msg: t("make_changes_to_update") });
          }
        }, 600);
      })
      : new Promise((resolve) => {
        setTimeout(() => {
          resolve();
          setLoading(false);
          setCommonAlert({ open: true, msg: t("demo_mode") });
        }, 600);
      });
  };

  const addCar = () => {
    if (settings.AllowCriticalEditsAdmin) {
      if (!data.vehicleNumber) {
        setCommonAlert({ open: true, msg: t("car_no_not_found") });
      } else if (!data.vehicleMake) {
        setCommonAlert({ open: true, msg: t("vehicleMake_required") });
      } else if (!data.vehicleModel) {
        setCommonAlert({ open: true, msg: t("vehicleModel_required") });
      } else if (!data.driver) {
        setCommonAlert({ open: true, msg: t("driver_required") });
      } else if (!data.carType) {
        setCommonAlert({ open: true, msg: t("carType_required") });
      } else {
        setLoading(true);
        new Promise(resolve => {
          setTimeout(() => {
            let activeCar = null;
            let updateData = {
              carType: data.carType,
              vehicleNumber: data.vehicleNumber,
              vehicleMake: data.vehicleMake,
              vehicleModel: data.vehicleModel,
              other_info: data.other_info,
              car_image: data.car_image,
              updateAt: new Date().getTime()
            }
            for (let i = 0; i < carData.length; i++) {
              if (carData[i].driver === data.driver && carData[i].active) {
                activeCar = carData[i];
                break;
              }
            }
            if (activeCar && data.active) {
              activeCar.active = false;
              dispatch(editCar(activeCar, "Update"));
              dispatch(updateUserCar(data.driver, updateData));
            } else if (activeCar && !data.active) {
              data.active = false;
            } else {
              data.active = true;
              dispatch(updateUserCar(data.driver, updateData));
            }
            data['createdAt'] = new Date().getTime();
            data['fleetadmin'] = data['driver'] ? (fleetMapObj[data['driver']] ? fleetMapObj[data['driver']] : null) : null;
            if (!settings.carApproval) {
              data['approved'] = true;
              if (data.active) {
                dispatch(updateUserCar(data.driver, { carApproved: true }));
              }
            } else {
              data['approved'] = false;
            }
            dispatch(editCar(data, "Add"));
            navigate("/cars");
            setLoading(false);
            resolve();
          }, 600);
        })

      }
    }else{
      setCommonAlert({ open: true, msg: t('demo_mode') });
      setLoading(false);
    }
  };


  return loading ? (
    <CircularLoading />
  ) : (
    <>
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
            {id ? t("update_car_title") : t("add_car_title")}
          </Typography>
          <div
            dir={isRTL === "rtl" ? "rtl" : "ltr"}
          >
            <Button
              variant="text"
              onClick={() => {
                navigate("/cars");
              }}
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
            spacing={2}
            sx={{
              gridTemplateColumns: "50%",
              rowGap: "20px",
              marginY: 1,
              direction:isRTL === "rtl" ? "rtl" : "ltr",
            }}
          >
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
              <TextField
                 InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                label={t("vehicle_reg_no")}
                id={"vehicleNumber"}
                value={data?.vehicleNumber || ""}
                disabled={data?.active ? true : false}
                fullWidth
                onChange={handleInputChange}
                className={
                  isRTL === "rtl" ? classes.rootRtl_2 : classes.textField
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
              <TextField
                 InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                label={t("vehicle_model_name")}
                id={"vehicleMake"}
                value={data?.vehicleMake || ""}
                disabled={data?.active ? true : false}
                fullWidth
                onChange={handleInputChange}
                className={
                  isRTL === "rtl" ? classes.rootRtl : classes.textField
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
              <TextField
                 InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                label={t("vehicle_model_no")}
                id={"vehicleModel"}
                value={data?.vehicleModel || ""}
                disabled={data?.active ? true : false}
                fullWidth
                onChange={handleInputChange}
                className={
                  isRTL === "rtl" ? classes.rootRtl_2 : classes.textField
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
              <TextField
                 InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                label={t("other_info")}
                id={"other_info"}
                value={data?.other_info || ""}
                disabled={data?.active ? true : false}
                fullWidth
                onChange={handleInputChange}
                className={
                  isRTL === "rtl" ? classes.rootRtl : classes.textField
                }
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
              <FormControl
                fullWidth
                style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
              >
                <InputLabel
                  id="demo-simple-select-label"
                  className={isRTL === "rtl" ? classes.right : ""}
                  sx={{ "&.Mui-focused": { color: MAIN_COLOR } }}
                >
                  {<Typography className={classes.typography}>{t("driver")}</Typography>}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={
                    role === "fleetadmin"
                      ? driversObj[data?.driver] || ""
                      : role === "driver"
                        ? auth.profile.id
                        : role === "admin"
                          ? driversObj[data?.driver] || ""
                          : ""
                  }
                  disabled={role === "driver" ? true : false}
                  label={t("driver")}
                  onChange={handelChangeDriver}
                  className={
                    isRTL === "rtl"
                      ? classes.selectField_rtl
                      : classes.selectField
                  }
                >
                  {role === "admin" ? (
                    drivers ? (
                      drivers.map((e) => (
                        <MenuItem
                          key={e.id}
                          style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                          value={driversObj[e.id]}
                        >
                          {<Typography className={classes.typography}>{e.desc}</Typography>}
                        </MenuItem>
                      ))
                    ) : null
                  ) : role === "driver" ? (
                    <MenuItem
                      style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                      value={auth.profile.id}
                    >
                      {<Typography className={classes.typography}>{driverData}</Typography>}
                    </MenuItem>
                  ) : role === "fleetadmin" ? (
                    drivers ? (
                      drivers.map((e) => (
                        <MenuItem
                          key={e.id}
                          style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                          value={driversObj[e.id]}
                        >
                          {<Typography className={classes.typography}>{e.desc}</Typography>}
                        </MenuItem>
                      ))
                    ) : null
                  ) : null}
                </Select>
              </FormControl>
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
              <FormControl
                fullWidth
                style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
              >
                <InputLabel
                  id="demo-simple-select-label"
                  className={isRTL === "rtl" ? classes.right : ""}
                  sx={{ "&.Mui-focused": { color: MAIN_COLOR } }}
                >
                  {<Typography className={classes.typography}>{t("car_type")}</Typography>}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={data?.carType || ""}
                  label={t("car_type")}
                  onChange={handelChangeCarType}
                  disabled={data?.active ? true : false}
                  className={
                    isRTL === "rtl"
                      ? classes.selectField_rtl_1
                      : classes.selectField
                  }
                >
                  {!carTypeAvailable ? (
                    <MenuItem
                      value={oldData?.carType}
                      style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                    >
                      {<Typography className={classes.typography}>{oldData?.carType}</Typography>}
                    </MenuItem>
                  ) : null}
                  {cartypes?.cars
                    ? cartypes.cars.map((e) => (
                      <MenuItem
                        key={e.id}
                        value={e.name}
                        style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                      >
                        {<Typography className={classes.typography}>{e.name}</Typography>}
                      </MenuItem>
                    ))
                    : null}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={ 12}
              display="flex"
              justifyContent="center"
              alignItems="center">
              <Button
                style={{
                  borderRadius: "19px",
                  backgroundColor: MAIN_COLOR,
                  minHeight: 50,
                  width: (isMidScreen ? '100%' :  '50%'),
                  textAlign: "center",
                }}
                onClick={()=>{
                  if(id){
                    updateCar();
                  }else{
                    addCar();
                  }
                }}
                variant="contained"
              >
                <Typography
                  style={{
                    color: colors.WHITE,
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "bold",
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  {id ? t("update") : t("add")}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Card>
        <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>
          {commonAlert.msg}
        </AlertDialog>
      </div>
    </>
  );
}

export default EditCar;