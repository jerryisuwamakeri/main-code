import React, { useEffect, useState } from 'react';
import Header from "components/Header/Header.js";
import HomeFooter from "components/Footer/HomeFooter.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import {colors} from '../components/Theme/WebTheme';
import Hero from "../components/Hero";
import Section from "../components/Section";
import Download from "../components/Download";

import { useSelector } from "react-redux";

const dashboardRoutes = [];

export default function LandingPage(props) {

  const auth = useSelector(state => state.auth);

  const { ...rest } = props;

  const [role, setRole] = useState();

  useEffect(() => {
    if (auth && auth.profile) {
      if(auth.profile.uid){
        let role = auth.profile.usertype;
        setRole(role);
      }
    }
  }, [auth]);

  return (
    <div style={{backgroundColor:colors.LandingPage_Background,margin:'-8px'}}>
      <Header
        color="transparent"
        routes={dashboardRoutes}
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
      <Hero role={role}/>
      <Section role={role} color={colors}/>
      <Download />
      <HomeFooter />
    </div>
  );
}
