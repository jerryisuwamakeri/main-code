import React, { useEffect, useRef } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    Dimensions,
    Platform,
} from 'react-native';
import {
    DriverRating,
    ProfileScreen,
    PaymentDetails,
    RideListPage,
    MapScreen,
    BookedCabScreen,
    RideDetails,
    SearchScreen,
    EditProfilePage,
    AboutPage,
    OnlineChat,
    WalletDetails,
    AddMoneyScreen,
    SelectGatewayPage,
    LoginScreen,
    DriverTrips,
    WithdrawMoneyScreen,
    DriverIncomeScreen,
    RegistrationPage,
    Notifications as NotificationsPage,
    SettingsScreen,
    CarsScreen,
    CarEditScreen,
} from '../screens';
import Complain from '../screens/Complain';
var { height, width } = Dimensions.get('window');
import { useSelector } from "react-redux";
import i18n from 'i18n-js';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../common/theme';
import { Icon } from "react-native-elements";
import { MAIN_COLOR } from '../common/sharedFunctions';
import { CommonActions } from '@react-navigation/native';
import { fonts } from '../common/font';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppContainer() {
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const auth = useSelector(state => state.auth);
    const responseListener = useRef();
    const navigationRef = useNavigationContainerRef();
    const activeBookings = useSelector(state => state.bookinglistdata.active);

    useEffect(() => {
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          if (response && response.notification && response.notification.request && response.notification.request.content && response.notification.request.content.data){
            const nData = response.notification.request.content.data;
            if (nData.screen) {
              if (nData.params) {
                navigationRef.navigate(nData.screen, nData.params);
              } else {
                navigationRef.navigate(nData.screen);
              }
            } else {
              navigationRef.navigate("TabRoot");
            }
          }
        });
    }, []);
    
    const hasNotch = Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS && ((height === 780 || width === 780) || (height === 812 || width === 812) || (height === 844 || width === 844) || (height === 852 || width === 852) || (height === 896 || width === 896) || (height === 926 || width === 926) || (height === 932 || width === 932))
    const screenOptions = {
        headerStyle: {
          backgroundColor: MAIN_COLOR,
          transform: [{ scaleX: isRTL ? -1 : 1 }]
        },
        headerTintColor: colors.TRANSPARENT,
        headerTitleAlign: 'center',
        headerTitleStyle: {
            fontFamily:fonts.Bold,
          color:'white',
          transform: [{ scaleX: isRTL ? -1 : 1 }]
        },
        headerBackImage: () => 
        <Icon
            name={isRTL?'arrow-right':'arrow-left'}
            type='font-awesome'
            color={colors.WHITE}
            size={25}
            style={{margin:10, transform: [{ scaleX: isRTL ? -1 : 1 }]}}
        /> 
    };
    
    const TabRoot = () => {
        return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    animationEnabled: Platform.OS == 'android'? false : true,
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === 'Map' || route.name === 'DriverTrips') {
                            iconName = focused
                              ? 'home'
                              : 'home-outline';
                        } else if (route.name === 'RideList') {
                            iconName = focused ? 'list-circle' : 'list-circle-outline';
                        } else if (route.name === 'Wallet') {
                            iconName = focused ? 'wallet' : 'wallet-outline';
                        } else if (route.name === 'Settings') {
                            iconName = focused ? 'settings' : 'settings-outline';
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: MAIN_COLOR,
                    tabBarInactiveTintColor: colors.HEADER,
                    tabBarBadge: route.name == 'RideList' && activeBookings && activeBookings.length > 0 ? activeBookings.length :null,
                    tabBarBadgeStyle:{transform: [{ scaleX: isRTL ? -1 : 1 }]},
                    tabBarIndicatorStyle: {
                        borderBottomColor: '#C2D5A8',
                        borderBottomWidth: 2,
                      },
                    tabBarStyle: { height: hasNotch ? 80:55,transform:isRTL? [{scaleX: -1}] :[{scaleX: 1}]},
                    tabBarLabelStyle:{ fontSize: 14,fontFamily:fonts.Light,transform:isRTL? [{scaleX: -1}] :[{scaleX: 1}]},
                })}
            >
                {auth.profile && auth.profile.usertype && auth.profile.usertype == 'customer' ?
                    <Tab.Screen name="Map" 
                        component={MapScreen} 
                        options={{title: t('home'),headerShown: false}}
                        listeners={({navigation,route})=>({
                            tabPress: e => {
                                e.preventDefault()
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{name: route.name}]
                                    })
                                )
                            },
                        })}
                    />
                : null}
                {auth.profile && auth.profile.usertype && auth.profile.usertype == 'driver' ?
                    <Tab.Screen 
                        name="DriverTrips" 
                        component={DriverTrips} 
                        options={{ title: t('task_list'),...screenOptions }}
                        listeners={({navigation,route})=>({
                            tabPress: e => {
                                e.preventDefault()
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{name: route.name}]
                                    })
                                )
                            },
                        })}
                    />
                : null}
                <Tab.Screen name="RideList"
                    component={RideListPage} 
                    options={{ title: t('ride_list_title'),...screenOptions }}
                    listeners={({navigation,route})=>({
                        tabPress: e => {
                            e.preventDefault()
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{name: route.name}]
                                })
                            )
                        },
                    })}
                />
                <Tab.Screen name="Wallet" 
                    component={WalletDetails} 
                    options={{ title: t('my_wallet_tile'),...screenOptions }}
                    listeners={({navigation,route})=>({
                        tabPress: e => {
                            e.preventDefault()
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{name: route.name}]
                                })
                            )
                        },
                    })}
                />
                <Tab.Screen name="Settings" 
                    component={SettingsScreen} 
                    options={{ title: t('settings_title') ,...screenOptions}}
                    listeners={({navigation,route})=>({
                        tabPress: e => {
                            e.preventDefault()
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{name: route.name}]
                                })
                            )
                        },
                    })}
                />
            </Tab.Navigator>
        );
    }

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                screenOptions={{
                    animationTypeForReplace: 'pop',
                    animationEnabled:   Platform.OS == 'android'? false: true,
                }}
            >
                {auth.profile && auth.profile.uid ?
                    <Stack.Group>
                        <Stack.Screen name="TabRoot" component={TabRoot}  options={{headerShown: false,}}/>
                        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: t('profile_setting_menu'),...screenOptions}}/>
                        <Stack.Screen name="editUser" component={EditProfilePage} options={{ title: t('update_profile_title'),...screenOptions }}/>
                        <Stack.Screen name="Search" component={SearchScreen} options={{ title: t('search'),...screenOptions }}/>
                        <Stack.Screen name="DriverRating" component={DriverRating} options={{ title: t('rate_ride'),headerLeft: ()=> null,...screenOptions }}/>
                        <Stack.Screen name="PaymentDetails" component={PaymentDetails} options={{ title: t('payment'),...screenOptions }}/>
                        <Stack.Screen name="BookedCab" component={BookedCabScreen} options={{headerShown: false }}/>
                        <Stack.Screen name="RideDetails" component={RideDetails} options={{ title: t('ride_details_page_title'),...screenOptions }}/>
                        <Stack.Screen name="onlineChat" component={OnlineChat} options={{ title: t('chat_title'),...screenOptions }}/>
                        <Stack.Screen name="addMoney" component={AddMoneyScreen} options={{ title: t('add_money'),...screenOptions }}/>
                        <Stack.Screen name="paymentMethod" component={SelectGatewayPage} options={{ title: t('payment'),...screenOptions }}/>
                        <Stack.Screen name="withdrawMoney" component={WithdrawMoneyScreen} options={{ title: t('withdraw_money'),...screenOptions }}/>
                        <Stack.Screen name="About" component={AboutPage} options={{ title: t('about_us_menu'),...screenOptions }}/>
                        <Stack.Screen name="Complain" component={Complain} options={{ title: t('complain'),...screenOptions }}/>
                        <Stack.Screen name="MyEarning" component={DriverIncomeScreen} options={{ title: t('incomeText'),...screenOptions }}/>
                        <Stack.Screen name="Notifications" component={NotificationsPage} options={{ title: t('push_notification_title'),...screenOptions }}/>
                        <Stack.Screen name="Cars" component={CarsScreen} options={{ title: t('cars'),...screenOptions  }}/>
                        <Stack.Screen name="CarEdit" component={CarEditScreen} options={{ title: t('editcar'),...screenOptions  }}/>
                    </Stack.Group>
                    :
                    <Stack.Group screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Login" component={LoginScreen}/>
                        <Stack.Screen name="Register" component={RegistrationPage}/>
                    </Stack.Group>
                }
            </Stack.Navigator>
        </NavigationContainer>
    );
}