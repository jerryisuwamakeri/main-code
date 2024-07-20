import React from "react";
import classNames from "classnames";
import { makeStyles } from "@mui/styles";
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import styles from '../styles/staticPages.js';
import Parallax from "components/Parallax/Parallax";
import { useTranslation } from "react-i18next";
import { colors } from "components/Theme/WebTheme.js";


const dashboardRoutes = [];

const useStyles = makeStyles(styles);

export default function AboutUs(props) {
  const { t,i18n } = useTranslation();
  const isRTL = i18n.dir();
  const classes = useStyles();
  const { ...rest } = props;

  return (
    <div style={{margin:'-8px'}}>
      <Header
        color="transparent"
        routes={dashboardRoutes}
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: "primary"
        }}
        {...rest}
      />
      <Parallax small filter image={require("assets/img/header-back.jpg").default} />
      <div className={classNames(classes.main, classes.mainRaised)}>
 
        <div className={classes.container}>
            <br/>
            <h2 style={{textAlign:isRTL === 'rtl'?'right':'left',position: "relative",marginTop: "30px",minHeight: "32px",color:colors.Header,textDecoration: "none",[isRTL === "rtl" ? "marginRight" : "marginRight"]: isRTL ? "30px" : "0px",wordBreak: "break-word"}}>{t('about_us')}</h2>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription} >{t('about_us_content2')}</p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription} >{t('about_us_content1')}</p>
            <br/>
        </div>
        </div>

      <Footer />
    </div>
  );
}
