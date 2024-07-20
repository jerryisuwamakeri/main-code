import React, { useState, useEffect, useRef } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import UserRides from "./UserRides";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, } from "react-redux";
import {MAIN_COLOR,SECONDORY_COLOR, FONT_FAMILY} from "../common/sharedFunctions"
import { makeStyles} from '@mui/styles';
import { BankDetails } from "./BannkDetails";
import UserWalletDetails from "./UserWalletDetails";
import UserInfoDetails from "./UserInfoDetails";
import { Typography } from "@mui/material";

    const useStyles = makeStyles({
  tabs: {

    "& .MuiTabs-indicator": {
      backgroundColor: SECONDORY_COLOR,
      height: 3,
    },
    "& .MuiTab-root.Mui-selected": {
      color: MAIN_COLOR
    }
  },
  typography:{
    fontFamily:FONT_FAMILY
  }
})

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function CustomerDetails() {
  const { id } = useParams();
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const staticusers = useSelector((state) => state.usersdata.staticusers);
  const navigate = useNavigate();
  const loaded = useRef(false);
  const classes = useStyles();


  useEffect(() => {
    if (staticusers) {
      const user = staticusers.filter(
        (user) => user.id === id.toString() && user.usertype === "customer"
      )[0];
      if (!user) {
        navigate("/404");
      }
      setData(user);
    } else {
      setData([]);
    }
    loaded.current = true;
  }, [staticusers, navigate, id]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="Customer tabs" className={classes.tabs} variant="scrollable" >
          <Tab
            style={{ marginRight: "20px" }}
            label={ <Typography className={classes.typography}>{t('info')}</Typography>}
            {...a11yProps(0)}
          />
          <Tab
            style={{ marginRight: "20px" }}
            label={ <Typography className={classes.typography}>{t('rides')}</Typography>}
            {...a11yProps(1)}
          />
          <Tab
            style={{ marginRight: "20px" }}
            label={ <Typography className={classes.typography}>{t('wallet')}</Typography>}
            {...a11yProps(2)}
          />
             <Tab
            style={{ marginRight: "20px" }}
            label={ <Typography className={classes.typography}>{t('bankDetails')}</Typography>}
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <UserInfoDetails data={data} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <UserRides data={data} tabid={0} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <UserWalletDetails data={data} id={0} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <BankDetails data={data} />
      </TabPanel>
    </Box>
  );
}