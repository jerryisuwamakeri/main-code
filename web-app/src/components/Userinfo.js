import React from "react";
import { Typography, Grid, Card, } from "@mui/material";
import { useTranslation } from "react-i18next";
import { colors } from "../components/Theme/WebTheme";
import { MAIN_COLOR, SECONDORY_COLOR, FONT_FAMILY } from "../common/sharedFunctions";

function Userinfo(props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir();
    const {title , value} = props;
    return (
        <Grid
            container
            spacing={2}
            sx={{ direction: isRTL === "rtl" ? "rtl" : "ltr", }}
        >
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                <Card
                    style={{
                        borderRadius:
                            isRTL === "rtl" ? "0 15px 15px 0" : "15px 0 0 15px",
                        minHeight: 80,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        padding: 10,
                        backgroundColor: MAIN_COLOR,
                        boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                    }}
                >
                    <Typography
                        style={{
                            color: "white",
                            textAlign: "center",
                            fontSize: 16,
                            fontFamily:FONT_FAMILY
                        }}
                    >
                        {t(title)}
                    </Typography>
                </Card>
            </Grid>
            <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                <Card
                    style={{
                        borderRadius:
                            isRTL === "rtl"
                                ? "15px 0 0 15px "
                                : "0 15px 15px 0",
                        backgroundColor: colors.WHITE,
                        minHeight: 80,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        padding: 10,
                        boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                    }}
                >
                    <Typography
                        style={{
                            color: "black",
                            textAlign: "center",
                            fontSize: 18,
                            fontWeight: "bold",
                            fontFamily:FONT_FAMILY
                        }}
                    >
                        {value}
                    </Typography>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Userinfo