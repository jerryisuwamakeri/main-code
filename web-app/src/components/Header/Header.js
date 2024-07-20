import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Menu from "@mui/icons-material/Menu";
import styles from '../../styles/headerStyle.js';
import { useTranslation } from "react-i18next";
import { Box } from '@mui/material';
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
const useStyles = makeStyles(styles);

export default function Header(props) {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir();
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [secondLogo, setSecondLogo] = React.useState(false);
  const { t } = useTranslation();
  const settings = useSelector(state => state.settingsdata.settings);
  React.useEffect(() => {
    if (props.changeColorOnScroll) {
      window.addEventListener("scroll", headerColorChange);
    }
    return function cleanup() {
      if (props.changeColorOnScroll) {
        window.removeEventListener("scroll", headerColorChange);
      }
    };
  });
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const headerColorChange = () => {
    const { color, changeColorOnScroll } = props;
    const windowsScrollTop = window.pageYOffset;
    if (windowsScrollTop > changeColorOnScroll.height) {
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[changeColorOnScroll.color]);
      setSecondLogo(true);
    } else {
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[changeColorOnScroll.color]);
      setSecondLogo(false);
    }
  };
  const { color, rightLinks, leftLinks, fixed, absolute } = props;
  const appBarClasses = classNames({
    [classes.appBar]: true,
    [classes[color]]: color,
    [classes.absolute]: absolute,
    [classes.fixed]: fixed
  });
  const brandComponent = <Button
    href="/"
    className={classes.title}>
    {secondLogo ? <img src={require("../../assets/img/logo138x75black.png").default} alt="blackLogo" /> :
      <img src={require("../../assets/img/logo138x75white.png").default} alt="whiteLogo" />
    }
  </Button>;
  return (
    <AppBar className={appBarClasses}>
          {settings && settings.appName?
      <Helmet>
        <title>{settings.appName + " | " + t("book_your_title")}</title>
        <meta name="description" content={t("about_us_content2")}/>
      </Helmet>
      :null}
      <Toolbar className={classes.container} style={{ direction: isRTL === 'rtl' ? 'rtl' : 'ltr' }}>
        {leftLinks !== undefined ? brandComponent : null}
        <div className={isRTL === 'rtl' ? null : classes.flex}>
          {leftLinks !== undefined ? (
            <Box component="div" sx={{ display: { sm: 'none', md: 'block' } }} >
              {leftLinks}
            </Box>
          ) : (
            brandComponent
          )}
        </div>

        <div style={{ direction: isRTL === 'rtl' ? 'rtl' : 'ltr' }}>
          <Box component="div" sx={{ display: { sm: 'none', md: 'block', xs: 'none' } }} >
              {rightLinks}
          </Box>
        </div>
        <Box component="div" sx={{ display: { md: 'none', xs: 'block' } }} >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Box>
      </Toolbar>
      <Box component="div" sx={{ display: { md: 'none', xs: 'block' } }} >
        <Drawer
          variant="temporary"
          anchor={"right"}
          open={mobileOpen}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={handleDrawerToggle}
        >
          <div className={classes.appResponsive}>
            {leftLinks}
            {rightLinks}
          </div>
        </Drawer>
      </Box>
    </AppBar>
  );
}

Header.defaultProp = {
  color: "white"
};

Header.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "transparent",
    "white",
    "rose",
    "dark"
  ]),
  rightLinks: PropTypes.node,
  leftLinks: PropTypes.node,
  brand: PropTypes.string,
  fixed: PropTypes.bool,
  absolute: PropTypes.bool,
  changeColorOnScroll: PropTypes.shape({
    height: PropTypes.number.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "info",
      "success",
      "warning",
      "danger",
      "transparent",
      "white",
      "rose",
      "dark",
      "header"
    ]).isRequired
  })
};
