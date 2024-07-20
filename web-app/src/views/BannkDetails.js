import React from 'react'
import { Typography, Grid, Card, Button } from "@mui/material";
import { MAIN_COLOR, SECONDORY_COLOR, FONT_FAMILY } from "../common/sharedFunctions";
import { colors } from "../components/Theme/WebTheme";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const BankDetails = (props) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir();
    const navigate = useNavigate();
    const settings = useSelector((state) => state.settingsdata.settings);
    return (
        <>
            <Card
                style={{
                    borderRadius: "19px",
                    backgroundColor: colors.WHITE,
                    marginTop: 20,
                    marginBottom: 20,
                    boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                    paddingBottom:30
                }}
            > <div
                dir={isRTL === "rtl" ? "rtl" : "ltr"}
            >
                    <Button
                        variant="text"
                        onClick={() => {
                            if(props?.data?.usertype === "customer"){
                                navigate("/users/0");
                            }else if(props?.data?.usertype === "driver"){
                                navigate("/users/1");
                            }else{
                                navigate("/404");
                            }
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
                <Grid
                    container
                    spacing={1}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        direction: isRTL === "rtl" ? "rtl" : "ltr",
                    }}
                >
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 10,
                            marginBottom: 10,
                        }}
                    >
                        <Card
                            style={{
                                borderRadius: "10px",
                                backgroundColor: colors.WHITE,
                                minHeight: 70,
                                minWidth: 300,
                                width: "80%",
                                color:colors.WHITE,
                                display: "flex",
                                boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                            }}
                        >
                            <Typography
                                style={{
                                    fontSize: 20,
                                    backgroundColor: MAIN_COLOR,
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontWeight: "bold",
                                    wordBreak: 'break-word',
                                    padding: '5px',
                                    fontFamily:FONT_FAMILY
                                }}
                            >
                                {t("bankName")}
                            </Typography>
                            <Typography
                                style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    color: colors.BLACK,
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    wordBreak: 'break-word',
                                    padding: '5px',
                                    fontFamily:FONT_FAMILY
                                }}
                            >
                                   { props.data?.bankName 
                                ? settings.AllowCriticalEditsAdmin
                                  ? props.data?.bankName
                                  : t("hidden_demo")
                                : t('no_data_available')
                            }

                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 10,
                            marginBottom: 10,
                        }}
                    >
                        <Card
                            style={{
                                borderRadius: "10px",
                                backgroundColor: colors.WHITE,
                                minHeight: 70,
                                minWidth: 300,
                                width: "80%",
                                color: colors.WHITE,
                                display: "flex",
                                boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                            }}
                        >
                            <Typography
                                style={{
                                    fontSize: 20,
                                    backgroundColor: MAIN_COLOR,
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontWeight: "bold",
                                    wordBreak: 'break-word',
                                    padding: '5px',
                                    fontFamily:FONT_FAMILY
                                }}
                            >
                                {t("bankCode")}
                            </Typography>
                            <Typography
                                style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    color: colors.BLACK,
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    wordBreak: 'break-word',
                                    padding: '5px',
                                    fontFamily:FONT_FAMILY
                                }}
                            >
                               
                                { props.data?.bankCode 
                                ? settings.AllowCriticalEditsAdmin
                                  ? props.data?.bankCode
                                  : t("hidden_demo")
                                : t('no_data_available')
                            }
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 10,
                            marginBottom: 10,
                        }}
                    >
                        <Card
                            style={{
                                borderRadius: "10px",
                                backgroundColor: colors.WHITE,
                                minHeight: 70,
                                minWidth: 300,
                                width: "80%",
                                color: colors.WHITE,
                                display: "flex",
                                boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                            }}
                        >
                            <Typography
                                style={{
                                    fontSize: 20,
                                    backgroundColor: MAIN_COLOR,
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontWeight: "bold",
                                    wordBreak: 'break-word',
                                    padding: '5px',
                                    fontFamily:FONT_FAMILY
                                }}
                            >
                                {t("bankAccount")}
                            </Typography>
                            <Typography
                                style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    color: colors.BLACK,
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    wordBreak: 'break-word',
                                    padding: '5px',
                                    fontFamily:FONT_FAMILY
                                }}
                            >
                              { props.data?.bankAccount 
                                ? settings.AllowCriticalEditsAdmin
                                  ? props.data?.bankAccount
                                  : t("hidden_demo")
                                : t('no_data_available')
                            }
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Card>
        </>
    )
}