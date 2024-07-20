import React, { useState, useEffect, useRef } from "react";
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
import { colors } from "components/Theme/WebTheme";
import { makeStyles } from "@mui/styles";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useParams } from "react-router-dom";
import { MAIN_COLOR, SECONDORY_COLOR, FONT_FAMILY } from "../common/sharedFunctions";

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

const EditPromo = () => {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const isRTL = i18n.dir();
    const settings = useSelector((state) => state.settingsdata.settings);
    const promos = useSelector(state => state.promodata.promos);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loding, setLoding] = useState(false);
    const [commonAlert, setCommonAlert] = useState({ open: false, msg: "" });
    const { editPromo } = api;
    const classes = useStyles();
    const [data, setData] = useState();
    const [oldData, setOldData] = useState(null);
    const[promoCodes, setPromoCodes] = useState([])
    
    const inputRef = useRef(null);

    const handleInputChange = (e) => {
        setData({ ...data, [e.target.id]: e.target.value });
    };

    const handleInputToNumberChange = (e) => {
        setData({ ...data, [e.target.id]: Number(e.target.value) });
    };

    const handleCommonAlertClose = (e) => {
        e.preventDefault();
        setCommonAlert({ open: false, msg: "" });
    };

    const handleChangePromoType = (e) => {
        setData({ ...data, promo_discount_type: e.target.value });
    };

    const handelUpdate = () => {
        settings.AllowCriticalEditsAdmin ?
            new Promise((resolve, reject) => {
                setLoding(true);
                setTimeout(() => {
                    if(!data.promo_name){
                        setLoding(false);
                        setCommonAlert({ open: true, msg: t('promo_name_error')});
                        reject();
                    }else if(!data.promo_code){
                        setLoding(false);
                        setCommonAlert({ open: true, msg: t('promo_code_error')});
                        reject();
                    }else if(!data.promo_description){
                        setLoding(false);
                        setCommonAlert({ open: true, msg: t('promo_description_error')});
                        reject();
                    }else if(!data.promo_discount_type){
                        setLoding(false);
                        setCommonAlert({ open: true, msg: t('promo_discount_type_error')});
                        reject();
                    }else if(!data.promo_discount_value){
                        setLoding(false);
                        setCommonAlert({ open: true, msg: t('promo_discount_value_error')});
                        reject();
                    }else if(!data.max_promo_discount_value){
                        setLoding(false);
                        setCommonAlert({ open: true, msg: t('max_promo_discount_value_error')});
                        reject();
                    }else if(!data.min_order){
                        setLoding(false);
                        setCommonAlert({ open: true, msg: t('min_order_error')});
                        reject();
                    }else if(data.promo_discount_type === "flat" && (data.max_promo_discount_value > data.min_order)){
                        setLoding(false);
                        setCommonAlert({ open: true, msg: t('flat_minorder_maxorder')});
                        reject();
                    } else {
                        if (data !== oldData) {
                            const filteredCodes = promoCodes.filter((item)=>{
                                return(
                                    item !== data.promo_code.toUpperCase() 
                                )
                            })
                            if(filteredCodes && filteredCodes.includes(data.promo_code.toUpperCase())){
                                setLoding(false);
                                setCommonAlert({ open: true, msg: t("code_already_avilable") });
                            }else{
                            delete data.tableData;
                            data['promo_code'] = data.promo_code.toUpperCase();
                            data['promo_show'] = data.promo_show ? true : false;
                            data['createdAt'] = new Date().getTime();
                            data['promo_validity'] = data.promo_validity ? new Date(data.promo_validity).getTime() : null;
                            dispatch(editPromo(data, "Update"));
                            setLoding(false);
                            navigate("/promos");
                            resolve();
                            }
                        } else {
                            setLoding(false);
                            setCommonAlert({ open: true, msg: t("make_changes_to_update") });
                        }
                    }
                }, 600);
            })
            :
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                    setCommonAlert({ open: true, msg: t("demo_mode") });
                }, 600);
            });
    };

    useEffect(()=>{
        if(promos){
            setPromoCodes(promos.map((item)=> {
                return(
                    item.promo_code
                )
            }))
        }
    },[promos])

    useEffect(() => {
        if (id) {
            if(promos) {
            const promoData = promos.filter(
                (item) => item.id === id.toString()
            )[0];
            if (!promoData) {
                navigate("/404");
            }
            setData(promoData);
            setOldData(promoData);
        }
        } else if (!id) {
            setData({
                createdAt: new Date().getTime(),
                promo_name: "",
                promo_description: "",
                promo_discount_type: "",
                promo_code: "",
                promo_discount_value: 0,
                max_promo_discount_value: 0,
                min_order: 0,
                promo_usage_limit: 0,
                user_avail: 0,
            });
        } else {
            navigate("/404");
        }
    }, [promos, id, navigate,]);


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
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                }}
            >
                <Typography
                    variant="h5"
                    style={{
                        marginTop: -15,
                        textAlign: isRTL === "rtl" ? "right" : "left",
                        fontFamily: FONT_FAMILY,
                    }}
                >
                    {id ? t("update_promo_title") : t("add_promo_title")}
                </Typography>
                <div
                    dir={isRTL === "rtl" ? "rtl" : "ltr"}
                >
                    <Button
                        variant="text"
                        onClick={() => {
                            navigate("/promos");
                        }}
                    >
                        <Typography
                            style={{
                                marginBottom: 10,
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
                        direction: isRTL === 'rtl' ? 'rtl' : 'ltr'
                    }}
                >

                    <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                        <TextField
                            InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                            label={t("promo_name")}
                            id="promo_name"
                            value={data?.promo_name || ""}
                            fullWidth
                            onChange={handleInputChange}
                            className={isRTL === "rtl" ? classes.rootRtl : classes.textField}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                        <TextField
                            InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                            label={t("description")}
                            id="promo_description"
                            value={data?.promo_description || ""}
                            fullWidth
                            onChange={handleInputChange}
                            className={isRTL === "rtl" ? classes.rootRtl : classes.textField}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                        <FormControl
                            fullWidth
                            style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                        >
                            <InputLabel
                                id="promo_discount_type"
                                className={isRTL === "rtl" ? classes.right : ""}
                                sx={{ "&.Mui-focused": { color: MAIN_COLOR } }}
                            >
                                {<Typography className={classes.typography}>{t('type')}</Typography>}
                            </InputLabel>
                            <Select
                                labelId="promo_discount_type"
                                id="promo_discount_type"
                                value={data?.promo_discount_type || ""}
                                label={t("type")}
                                onChange={handleChangePromoType}
                                className={
                                    isRTL === "rtl"
                                        ? classes.selectField_rtl
                                        : classes.selectField
                                }
                            >
                                <MenuItem
                                    style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                                    value={"percentage"}
                                >
                                    {<Typography className={classes.typography}>{t('percentage')}</Typography>}
                                </MenuItem>
                                <MenuItem
                                    style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                                    value={"flat"}
                                >
                                    {<Typography className={classes.typography}>{t('flat')}</Typography>}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                        <TextField
                            InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                            label={t("promo_code")}
                            id="promo_code"
                            value={data?.promo_code || ""}
                            fullWidth
                            onChange={handleInputChange}
                            className={isRTL === "rtl" ? classes.rootRtl_2 : classes.textField}
                        />
                    </Grid>


                    <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                        <TextField
                            InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                            label={t("promo_discount_value")}
                            id="promo_discount_value"
                            value={data?.promo_discount_value || 0}
                            type="number"
                            fullWidth
                            onChange={handleInputToNumberChange}
                            className={isRTL === "rtl" ? classes.rootRtl_3 : classes.textField}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                        <TextField
                            InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                            label={t("max_limit")}
                            id="max_promo_discount_value"
                            value={data?.max_promo_discount_value || 0}
                            type="number"
                            fullWidth
                            onChange={handleInputToNumberChange}
                            className={isRTL === "rtl" ? classes.rootRtl_1 : classes.textField}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                        <TextField
                            InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                            label={t("min_limit")}
                            id="min_order"
                            value={data?.min_order || 0}
                            type="number"
                            fullWidth
                            onChange={handleInputToNumberChange}
                            className={isRTL === "rtl" ? classes.rootRtl_1 : classes.textField}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                        <FormControl
                            fullWidth
                            style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    disablePast
                                    inputRef={inputRef}
                                    renderInput={(props) => <TextField {...props} className={isRTL === "rtl" ? classes.rootRtl_2 : classes.textField} />}
                                    label={t("end_date")}
                                    value={data?.promo_validity ? data.promo_validity : new Date()}
                                    onChange={(newValue) => {
                                        setData({
                                            ...data,
                                            promo_validity: newValue,
                                        });
                                    }}
                                    autoFocus={false}
                                />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                        <TextField
                            InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                            label={t("promo_usage")}
                            id="promo_usage_limit"
                            value={data?.promo_usage_limit || 0}
                            type="number"
                            fullWidth
                            onChange={handleInputToNumberChange}
                            className={isRTL === "rtl" ? classes.rootRtl_4 : classes.textField}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={6} xl={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Button
                            style={{
                                borderRadius: "19px",
                                backgroundColor: MAIN_COLOR,
                                minHeight: 50,
                                minWidth: "100%",
                                textAlign: "center",
                                boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                            }}
                            onClick={handelUpdate}
                            variant="contained"
                        >
                            <Typography
                                style={{
                                    color: colors.WHITE,
                                    textAlign: "center",
                                    fontSize: 16,
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
    );
};

export default EditPromo