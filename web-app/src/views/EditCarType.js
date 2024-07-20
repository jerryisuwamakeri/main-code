import React, { useEffect, useState } from "react";
import AlertDialog from "../components/AlertDialog";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useSelector, useDispatch } from "react-redux";
import { Typography, TextField, Button, Grid, Card } from "@mui/material";
import { api } from "common";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CircularLoading from "components/CircularLoading";
import { useParams } from "react-router-dom";
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
    rootRtl_3: {
      "& label": {
        right: 17,
        left: "auto",
        paddingRight: 12,
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
    rootRtl: {
      "& label": {
        right: 20,
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
    rootRtl_1: {
      "& label": {
        right: 0,
        left: "auto",
        paddingRight: 20,
        fontFamily: FONT_FAMILY,
      },
      "& legend": {
        textAlign: "right",
        marginRight: 30,
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
    rootRtl_4: {
      "& label": {
        right: 17,
        left: "auto",
        paddingRight: 12,
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
  rootRtl_5: {
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
      textAlign: "right",
      right: 0,
      left: "auto",
      paddingRight: 40,
      fontFamily: FONT_FAMILY,
    },
  }));
const EditCarType = () => {
    const { t, i18n } = useTranslation();
    const { id} = useParams();
    const isRTL = i18n.dir();
    const settings = useSelector((state) => state.settingsdata.settings);
    const cartypes = useSelector((state) => state.cartypes);
    const carlistdata = useSelector((state) => state.carlistdata);
    const staticusers = useSelector((state) => state.usersdata.staticusers);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loding, setLoding] = useState(false);
    const [commonAlert, setCommonAlert] = useState({ open: false, msg: "" });
    const { editCarType, updateUserCar, editCar } = api;
    const [oldData, setOldData] = useState(null);
    const [data, setData] = useState(null);
    const classes = useStyles();
  
    useEffect(() => {
      if ( id){
          if( cartypes && cartypes.cars) {
        const carData = cartypes.cars.filter(
          (item) => item.id === id.toString()
        )[0];
        if (!carData) {
          navigate("/404");
        }
        setData(carData);
        setOldData(carData);
      }
      } else{
        setData({
            name: "",
            base_fare: 0,
            convenience_fee_type: "",
            pos: "",
            convenience_fees: 0,
            rate_per_hour: 0,
            extra_info: "",
            min_fare: 0,
            rate_per_unit_distance: 0,
            fleet_admin_fee: 0,
            image: "https://cdn.pixabay.com/photo/2012/04/15/22/09/car-35502__480.png",
        })
      }
    }, [cartypes,cartypes.cars, id, navigate]);
  
    const handleInputChange = (e) => {
      setData({ ...data, [e.target.id]: e.target.value });
    };
  
    const handleInputToNumberChange = (e) => {
      setData({ ...data, [e.target.id]: Number(e.target.value) });
    };
  
    const handleExtraInfoChange = (e) => {
      setData({ ...data, extra_info: e.target.value });
    };
  
    const handleCommonAlertClose = (e) => {
      e.preventDefault();
      setCommonAlert({ open: false, msg: "" });
    };
    const handleSubmit = () => {

        if(! id) {
            if (
                !(
                  data &&
                  data.name &&
                  data.pos &&
                  data.convenience_fee_type &&
                  data.base_fare &&
                  data.min_fare &&
                  data.rate_per_hour &&
                  data.rate_per_unit_distance
                )
              ) {
                if (!(data && data.name)) {
                  setCommonAlert({ open: true, msg: t("proper_input_name") });
                } else if (!data.pos) {
                  setCommonAlert({ open: true, msg: t("position_required") });
                } else if (!data.base_fare) {
                  setCommonAlert({ open: true, msg: t("base_fare_required") });
                } else if (!data.min_fare) {
                  setCommonAlert({ open: true, msg: t("min_fare_required") });
                } else if (!data.rate_per_hour) {
                  setCommonAlert({ open: true, msg: t("rate_per_hour_required") });
                } else if (!data.rate_per_unit_distance) {
                  setCommonAlert({
                    open: true,
                    msg: t("rate_per_unit_distance_required"),
                  });
                } else if (!data.convenience_fee_type) {
                  setCommonAlert({ open: true, msg: t("convenience_fee_type_required") });
                }
              } else {
                settings.AllowCriticalEditsAdmin
                  ? new Promise((resolve, reject) => {
                    setLoding(true);
                    setTimeout(() => {
                      if (data && data.name) {
                        data["createdAt"] = new Date().getTime();
                        dispatch(editCarType(data, "Add"));
                        resolve();
                        setLoding(false);
                        navigate("/cartypes");
                      } else {
                        setCommonAlert({ open: true, msg: t("proper_input_name") });
                        reject(new Error("Enter proper name"));
                        setLoding(false);
                      }
                    }, 600);
                  })
                  : new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      setCommonAlert({ open: true, msg: t("demo_mode") });
                    }, 600);
                  });
              }
        }

        else if(id){
          if (
              !(
                data &&
                data.name &&
                data.pos &&
                data.convenience_fee_type &&
                data.base_fare &&
                data.min_fare &&
                data.rate_per_hour &&
                data.rate_per_unit_distance
              )
            ) {
              if (!(data && data.name)) {
                setCommonAlert({ open: true, msg: t("proper_input_name") });
              } else if (!data.pos) {
                setCommonAlert({ open: true, msg: t("position_required") });
              } else if (!data.base_fare) {
                setCommonAlert({ open: true, msg: t("base_fare_required") });
              } else if (!data.min_fare) {
                setCommonAlert({ open: true, msg: t("min_fare_required") });
              } else if (!data.rate_per_hour) {
                setCommonAlert({ open: true, msg: t("rate_per_hour_required") });
              } else if (!data.rate_per_unit_distance) {
                setCommonAlert({
                  open: true,
                  msg: t("rate_per_unit_distance_required"),
                });
              } else if (!data.convenience_fee_type) {
                setCommonAlert({ open: true, msg: t("convenience_fee_type_required") });
              }
            } else {
              settings.AllowCriticalEditsAdmin
              ? new Promise((resolve) => {
                setLoding(true);
                setTimeout(() => {
                  resolve();
                  if (data !== oldData) {
                    delete data.tableData;
                    if (data.name !== oldData.name) {
                      let users = staticusers?.filter(
                        (user) =>
                          user.usertype === "driver" && user.carType === oldData.name
                      );
                      for (let i = 0; i < users?.length; i++) {
                        dispatch(
                          updateUserCar(users[i].id, {
                            carType: data.name,
                          })
                        );
                      }
                      let cars = carlistdata.cars.filter(
                        (car) => car.carType === oldData.name
                      );
                      for (let i = 0; i < cars.length; i++) {
                        dispatch(
                          editCar({ ...cars[i], carType: data.name }, "Update")
                        );
                      }
                    }
                    dispatch(editCarType(data, "Update"));
                    navigate("/cartypes");
                    setLoding(false);
                  }else{
                    setLoding(false); 
                    setCommonAlert({ open: true, msg: t("make_changes_to_update") });
                  }
                }, 600);
              })
              : new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  alert(t("demo_mode"));
                }, 600);
              });
          }
        }
    };
  
    const handleChangeConvenienceFeeType = (e) => {
      setData({ ...data, convenience_fee_type: e.target.value });
    };
  return loding ? (
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
          padding: 25,
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
          {id ? t("update_carType_title") : t("add_carType_title")}
        </Typography>
        <div
          dir={isRTL === "rtl" ? "rtl" : "ltr"}
          style={{
            marginBottom: 20,
          }}
        >
          <Button
            variant="text"
            onClick={() => {
              navigate("/cartypes");
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
          sx={{ gridTemplateColumns: "50%", direction:isRTL === "rtl" ? "rtl" : "ltr", }}
        >
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
               InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              label={t("name")}
              id="name"
              value={data?.name || ""}
              fullWidth
              onChange={handleInputChange}
              className={isRTL === "rtl" ? classes.rootRtl : classes.textField}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
               InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              label={t("base_fare")}
              id="base_fare"
              value={data?.base_fare || 0}
              fullWidth
              type="number"
              onChange={handleInputToNumberChange}
              className={
                isRTL === "rtl" ? classes.rootRtl_3 : classes.textField
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
                {<Typography className={classes.typography}>{t("convenience_fee_type")}</Typography>}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="convenience_fee_type"
                value={data?.convenience_fee_type || ""}
                label={t("convenience_fee_type")}
                onChange={handleChangeConvenienceFeeType}
                className={
                  isRTL === "rtl"
                    ? classes.selectField_rtl
                    : classes.selectField
                }
              >
                <MenuItem
                  style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                  value={"flat"}
                >
                  {<Typography className={classes.typography}>{t("flat")}</Typography>}
                </MenuItem>
                <MenuItem
                  style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                  value={"percentage"}
                >
                  {<Typography className={classes.typography}>{t("percentage")}</Typography>}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
               InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              label={t("convenience_fee")}
              id="convenience_fees"
              value={data?.convenience_fees || 0}
              type="number"
              fullWidth
              onChange={handleInputToNumberChange}
              className={
                isRTL === "rtl" ? classes.rootRtl_4 : classes.textField
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
               InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              label={t("rate_per_hour")}
              id="rate_per_hour"
              value={data?.rate_per_hour || 0}
              type="number"
              fullWidth
              onChange={handleInputToNumberChange}
              className={
                isRTL === "rtl" ? classes.rootRtl_3 : classes.textField
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
               InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              label={t("min_fare")}
              id="min_fare"
              value={data?.min_fare || 0}
              type="number"
              fullWidth
              onChange={handleInputToNumberChange}
              className={
                isRTL === "rtl" ? classes.rootRtl_2 : classes.textField
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
               InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              label={t("rate_per_unit_distance")}
              id="rate_per_unit_distance"
              value={data?.rate_per_unit_distance || 0}
              type="number"
              fullWidth
              onChange={handleInputToNumberChange}
              className={
                isRTL === "rtl" ? classes.rootRtl_1 : classes.textField
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
               InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              label={t("position")}
              id="pos"
              value={data?.pos || 0}
              type="number"
              fullWidth
              onChange={handleInputToNumberChange}
              className={
                isRTL === "rtl" ? classes.rootRtl_4 : classes.textField
              }
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
               InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              label={t("fleet_admin_fee")}
              id="fleet_admin_fee"
              value={data?.fleet_admin_fee || 0}
              type="number"
              fullWidth
              onChange={handleInputToNumberChange}
              className={
                isRTL === "rtl" ? classes.rootRtl_5 : classes.textField
              }
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
               InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              label={t("extra_info")}
              id="extra_info"
              value={data?.extra_info || ""}
              fullWidth
              onChange={handleExtraInfoChange}
              className={
                isRTL === "rtl" ? classes.rootRtl_3 : classes.textField
              }
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{display:"flex", justifyContent:"center", alignItems:"center"}}>
            <Button
              style={{
                borderRadius: "19px",
                backgroundColor: MAIN_COLOR,
                minHeight: 50,
                minWidth: "50%",
                textAlign: "center",
                boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
              }}
              onClick={handleSubmit}
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
                {id  ? t("update") : t("submit")}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Card>
      <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>
        {commonAlert.msg}
      </AlertDialog>
    </div>
  );
};

export default EditCarType
