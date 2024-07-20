import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography
} from '@mui/material';
import DashboardCard from '../components/DashboardCard';
import {
    GoogleMap,
    Marker,
    InfoWindow
} from "@react-google-maps/api";
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { useTranslation } from "react-i18next";
import Chart from 'react-apexcharts';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { api } from 'common';
import { colors } from 'components/Theme/WebTheme';
import { FONT_FAMILY } from 'common/sharedFunctions';
const Dashboard = () => {
    const [mylocation, setMylocation] = useState(null);
    const [locations, setLocations] = useState([]);
    const [dailygross, setDailygross] = useState(0);
    const [monthlygross, setMonthlygross] = useState(0);
    const [totalgross, setTotalgross] = useState(0);

    const [settings, setSettings] = useState({});
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir();
    const usersdata = useSelector(state => state.usersdata);
    const bookinglistdata = useSelector(state => state.bookinglistdata);
    const settingsdata = useSelector(state => state.settingsdata);
    const auth = useSelector(state => state.auth);
    const cars = useSelector(state => state.cartypes.cars);
    const [allCompleteCount, setAllCompleteCount] = useState([]);
    const [allCancelCount, setAllCancelCount] = useState([]);
    const [activeCount, setActiveCount] = useState(0);
    const [driverCount, setDriverCount] = useState(0);
    const [customerCount, setCustomerCount] = useState(0);
    const dispatch = useDispatch();
    const {fetchDrivers, clearFetchDrivers} = api;

    useEffect(() => {
        dispatch(fetchDrivers('web'));
        return () => {
            dispatch(clearFetchDrivers());
        };
    }, [dispatch, fetchDrivers, clearFetchDrivers]);

    useEffect(() => {
        if (mylocation == null) {
            navigator.geolocation.getCurrentPosition(
                position => setMylocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }),
                error => console.log(error)
            );
        }
    }, [mylocation]);

    useEffect(() => {
        if (settingsdata.settings) {
            setSettings(settingsdata.settings);
        }
    }, [settingsdata.settings]);

    useEffect(() => {
        if (usersdata.drivers && bookinglistdata.bookings) {
            const liveBookings = bookinglistdata.bookings.filter(bkg => bkg.status === 'STARTED');
            const drivers = usersdata.drivers;
            let locs = [];
           
                for (let i = 0; i < drivers.length; i++) {
                    if (drivers[i].location) {
                        let carImage = 'https://cdn.pixabay.com/photo/2012/04/15/22/09/car-35502__480.png';
                        let bookingRef = null;
                        for (let j = 0; j < cars.length; j++) {
                            if (cars[j].name === drivers[i].carType) {
                                carImage = cars[j].image;
                            }
                        }
                        for(let j = 0; j<liveBookings.length; j++){
                            if(liveBookings[j].driver === drivers[i].uid){
                                bookingRef = liveBookings[j].reference;
                            }
                        }
                        locs.push({
                            id: i,
                            lat: drivers[i].location.lat,
                            lng: drivers[i].location.lng,
                            drivername: drivers[i].firstName + ' ' + drivers[i].lastName,
                            carnumber: drivers[i].vehicleNumber,
                            cartype: drivers[i].carType,
                            carImage: carImage,
                            bookingRef: bookingRef,
                            fleetadmin:drivers[i].fleetadmin
                        });
                    }
                }
                if (auth.profile.usertype === 'fleetadmin') {
                    locs = locs.filter(driver => driver.fleetadmin === auth.profile.uid);
                }
                setLocations(locs);
                
        }
    }, [usersdata.drivers, auth.profile.usertype, auth.profile.uid, cars, bookinglistdata.bookings, settings]);
    useEffect(() => {
        if (bookinglistdata.bookings) {
            let today = new Date();
            let monthlyTotal = 0;
            let yearlyTotal = 0;
            let todayTotal = 0;
            for (let i = 0; i < bookinglistdata.bookings.length; i++) {
                if ((bookinglistdata.bookings[i].status === 'PAID' || bookinglistdata.bookings[i].status === 'COMPLETE') && ((bookinglistdata.bookings[i].fleetadmin === auth.profile.uid && auth.profile.usertype === 'fleetadmin')|| auth.profile.usertype === 'admin') ) {
                    const { tripdate, convenience_fees, fleetCommission, discount } = bookinglistdata.bookings[i];
                    let tDate = new Date(tripdate);
                    if (convenience_fees && parseFloat(convenience_fees) > 0 && auth.profile.usertype === 'admin') {
                        if (tDate.getDate() === today.getDate() && tDate.getMonth() === today.getMonth() && tDate.getFullYear() === today.getFullYear()) {
                            todayTotal = todayTotal + parseFloat(convenience_fees) - parseFloat(discount);
                        }
                        if (tDate.getMonth() === today.getMonth() && tDate.getFullYear() === today.getFullYear()) {
                            monthlyTotal = monthlyTotal + parseFloat(convenience_fees) - parseFloat(discount);
                        }
                        yearlyTotal = yearlyTotal + parseFloat(convenience_fees) - parseFloat(discount);
                    }
                    if (fleetCommission && parseFloat(fleetCommission) > 0 && auth.profile.usertype === 'fleetadmin'){
                        if (tDate.getDate() === today.getDate() && tDate.getMonth() === today.getMonth() && tDate.getFullYear() === today.getFullYear()) {
                            todayTotal = todayTotal + parseFloat(fleetCommission);
                        }
                        if (tDate.getMonth() === today.getMonth() && tDate.getFullYear() === today.getFullYear()) {
                            monthlyTotal = monthlyTotal + parseFloat(fleetCommission);
                        }
                        yearlyTotal = yearlyTotal + parseFloat(fleetCommission);
                    }
                }
            }
            setDailygross(parseFloat(todayTotal).toFixed(settings.decimal));
            setMonthlygross(parseFloat(monthlyTotal).toFixed(settings.decimal));
            setTotalgross(parseFloat(yearlyTotal).toFixed(settings.decimal));
        }
    }, [bookinglistdata.bookings, settings,auth.profile.uid,auth.profile.usertype]);

    const barChartOptions = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        colors: [colors.GREEN, colors.RED],
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            }, 
        },
        chart: {
                height: 350,
                type: 'area',
                fontFamily: FONT_FAMILY 
            },
        xaxis: {
            labels: {
                style: {
                    fontFamily: FONT_FAMILY 
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    fontFamily: FONT_FAMILY 
                }
            }
        },
        title: {
            style: {
                fontFamily: FONT_FAMILY
            }
        },
        subtitle: {
            style: {
                fontFamily: FONT_FAMILY 
            }
        },
        tooltip: {
            style: {
                fontFamily: FONT_FAMILY 
            }
        },
        legend: {
            fontFamily: FONT_FAMILY 
        }
    };

    const barChart = [{
        name: t('completed_bookings'),
        data: allCompleteCount
    }, {
        name: t('cancelled_bookings'),
        data: allCancelCount
    }];
    useEffect(() => {
        if (usersdata.users) {
            let driverCount = 0;
            let activeCount = 0;
            let customerCount = 0;
            for (let i = 0; i < usersdata.users.length; i++) {
                if (usersdata.users[i].usertype === 'driver') {
                    if ((auth.profile.usertype === 'fleetadmin' && usersdata.users[i].fleetadmin === auth.profile.uid) || auth.profile.usertype === 'admin') {
                        driverCount = driverCount + 1;
                    }
                }
                if (usersdata.users[i].driverActiveStatus === true) {
                    if ((auth.profile.usertype === 'fleetadmin' && usersdata.users[i].fleetadmin === auth.profile.uid) || auth.profile.usertype === 'admin') {
                        activeCount = activeCount + 1;
                    }
                }
                if (usersdata.users[i].usertype === 'customer') {
                    if ((auth.profile.usertype === 'fleetadmin' && usersdata.users[i].fleetadmin === auth.profile.uid) || auth.profile.usertype === 'admin') {
                        customerCount = customerCount + 1;
                    }
                }
            }
            setActiveCount(activeCount);
            setDriverCount(driverCount);
            setCustomerCount(customerCount);
        } else {
            setActiveCount(0)
            setDriverCount(0)
            setCustomerCount(0)
        }
    }, [usersdata.users, auth.profile]);

    useEffect(() => {
        let allCompleteCount = [];
        let allCancelCount = [];
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (bookinglistdata.bookings) {
            for (let i = 0; i < months.length; i++) {
                let completeCount = 0;
                let cancelCount = 0;
                for (let j = 0; j < bookinglistdata.bookings.length; j++) {
                    const { tripdate } = bookinglistdata.bookings[j];
                    let tDate = new Date(tripdate);
                    if (months[i] === months[tDate.getMonth()] && (bookinglistdata.bookings[j].status === 'PAID' || bookinglistdata.bookings[j].status === 'COMPLETE')) {
                        completeCount = completeCount + 1;
                    }
                    if (months[i] === months[tDate.getMonth()] && bookinglistdata.bookings[j].status === 'CANCELLED') {
                        cancelCount = cancelCount + 1;
                    }
                }
                allCompleteCount.push(completeCount);
                allCancelCount.push(cancelCount);
            }
        }
        setAllCompleteCount(allCompleteCount);
        setAllCancelCount(allCancelCount);
    }, [bookinglistdata.bookings]);

    return (
        bookinglistdata.loading || usersdata.loading ? <CircularLoading /> :
            <div >
                <Typography variant="h4" style={{ margin: "20px 20px 0 15px", textAlign: isRTL === 'rtl' ? 'right' : 'left',fontFamily: FONT_FAMILY }}>{t('gross_earning')}</Typography>
                <Grid container direction="row" spacing={2}>
                    <Grid item xs style={{ textAlign: isRTL === 'rtl' ? 'right' : 'left', }}>
                        {settings.swipe_symbol === false ?
                            <DashboardCard crdStyle={{ display: 'flex', borderRadius: "19px", backgroundColor: colors.WALLET_CARD,color:colors.WHITE }} title={t('today_text')} image={require("../assets/img/money1.jpg").default}>{settings.symbol + ' ' + dailygross}</DashboardCard>
                            :
                            <DashboardCard crdStyle={{ display: 'flex', borderRadius: "19px", backgroundColor: colors.WALLET_CARD,color:colors.WHITE }} title={t('today_text')} image={require("../assets/img/money1.jpg").default}>{dailygross + ' ' + settings.symbol}</DashboardCard>
                        }
                    </Grid>
                    <Grid item xs style={{ textAlign: isRTL === 'rtl' ? 'right' : 'left' }}>
                        {settings.swipe_symbol === false ?
                            <DashboardCard crdStyle={{ display: 'flex', borderRadius: "19px", backgroundColor: colors.VIOLET,color:colors.WHITE }} title={t('this_month_text')} image={require("../assets/img/money2.jpg").default}>{settings.symbol + ' ' + monthlygross}</DashboardCard>
                            :
                            <DashboardCard crdStyle={{ display: 'flex', borderRadius: "19px", backgroundColor: colors.VIOLET,color:colors.WHITE }} title={t('this_month_text')} image={require("../assets/img/money2.jpg").default}>{monthlygross + ' ' + settings.symbol}</DashboardCard>
                        }
                    </Grid>
                    <Grid item xs style={{ textAlign: isRTL === 'rtl' ? 'right' : 'left' }}>
                        {settings.swipe_symbol === false ?
                            <DashboardCard crdStyle={{ display: 'flex', borderRadius: "19px", backgroundColor: colors.GREEN,color:colors.WHITE }} title={t('total')} image={require("../assets/img/money3.jpg").default}>{settings.symbol + ' ' + totalgross}</DashboardCard>
                            :
                            <DashboardCard crdStyle={{ display: 'flex', borderRadius: "19px", backgroundColor: colors.GREEN,color:colors.WHITE }} title={t('total')} image={require("../assets/img/money3.jpg").default}>{totalgross + ' ' + settings.symbol}</DashboardCard>
                        }
                    </Grid>
                </Grid>
                
                <Grid item xs={12} style={{ marginTop: 20 }}>
                    <Grid container style={{  direction: isRTL === 'rtl' ? 'rtl' : 'ltr' }} >
                        <Grid item xs={12} sm={12} md={9} lg={9} style={{ backgroundColor: colors.WHITE, borderRadius: 20, overflow: 'hidden', }} boxShadow={3}>
                            <Typography variant="h4" style={{ margin: "20px 20px 0 15px", textAlign: isRTL === 'rtl' ? 'right' : 'left',fontFamily: FONT_FAMILY }}>{t('real_time_driver_section_text')}</Typography>
                            {mylocation && mylocation.lat?
                            <GoogleMap
                                zoom={10}
                                center={mylocation}
                                mapContainerStyle={{height: `380px`,fontFamily: FONT_FAMILY }}
                                >
                                {locations.map(marker => (
                                    <Marker
                                        position={{ lat: marker.lat, lng: marker.lng }}
                                        key={marker.id}
                                        icon={{
                                            url: marker.carImage,
                                            scaledSize:  new window.google.maps.Size(35,25)
                                        }}

                                    >
                                        <InfoWindow 
                                           position={{ lat: marker.lat, lng: marker.lng }} 
                                           options={{ pixelOffset: new window.google.maps.Size(0, -32) }}
                                        >
                                            <div style={{ fontFamily: FONT_FAMILY }}>{marker.drivername}<br/>{marker.carnumber}</div>
                                        </InfoWindow>
                                
                                    </Marker>
                                ))}
                            </GoogleMap>
                            :null}
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3} style={{ padding: 25, marginTop: '30px' }}>
                            <Card style={{ borderRadius: "19px", backgroundColor: colors.WALLET_CARD, minHeight: 100, marginBottom: 20 }}>
                                <Typography style={{ color: 'white', textAlign: 'center', fontSize: 20, marginTop: 20,fontFamily: FONT_FAMILY }}>{t('total_cumtomer')}</Typography>
                                <Typography style={{ color: 'white', textAlign: 'center', fontSize: 26,fontWeight:'bold',fontFamily: FONT_FAMILY}}>{customerCount}</Typography>
                            </Card>
                            <Card style={{ borderRadius: "19px", backgroundColor: colors.VIOLET, minHeight: 100, marginBottom: 20 }}>
                                <Typography style={{ color: 'white', textAlign: 'center', fontSize: 20, marginTop: 20,fontFamily: FONT_FAMILY }}>{t('total_drivers')}</Typography>
                                <Typography style={{ color: 'white', textAlign: 'center',  fontSize: 26,fontWeight:'bold',fontFamily: FONT_FAMILY}}>{driverCount}</Typography>
                            </Card>
                            <Card style={{ borderRadius: "19px", backgroundColor: colors.GREEN, minHeight: 100 }}>
                                <Typography style={{ color: 'white', textAlign: 'center', fontSize: 20, marginTop: 20 ,fontFamily: FONT_FAMILY}}>{t('active_driver')}</Typography>
                                <Typography style={{ color: 'white', textAlign: 'center',  fontSize: 26,fontWeight:'bold' ,fontFamily: FONT_FAMILY}}>{activeCount}</Typography>
                            </Card>


                        </Grid>

                    </Grid>
                </Grid>
                <Box style={{ padding: 10, marginTop: 20, borderRadius: 20, backgroundColor: colors.WHITE}} boxShadow={6}>
                    <Typography style={{margin: "5px 20px 0 15px",color:colors.GREEN, fontWeight:"bold",fontFamily: FONT_FAMILY}} variant="h5">{t('booking_chart')}</Typography>
                    <Chart
                        options={barChartOptions}
                        series={barChart}
                        type="area"
                        width="100%"
                        height={360}
                    />
                </Box>
            </div>

    )
}

export default Dashboard;