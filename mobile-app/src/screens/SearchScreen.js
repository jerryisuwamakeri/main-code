import React, { useState, useEffect } from 'react';
import { Icon } from 'react-native-elements';
import { colors } from '../common/theme';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  Keyboard,
  Image,
  Modal,
  ScrollView,
  Platform
} from 'react-native';
import i18n from 'i18n-js';
import { api } from 'common';
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../components/Footer'
import { checkSearchPhrase, appConsts } from '../common/sharedFunctions';
import { MAIN_COLOR } from '../common/sharedFunctions';
var { width,height } = Dimensions.get('window');
import {  StackActions } from '@react-navigation/native';
import { Entypo, MaterialIcons, AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from 'react-native-elements';
import uuid from 'react-native-uuid';
import { fonts } from '../common/font';

const hasNotch =
  Platform.OS === "ios" &&
  !Platform.isPad &&
  !Platform.isTV &&
  (height === 780 ||
    width === 780 ||
    height === 812 ||
    width === 812 ||
    height === 844 ||
    width === 844 ||
    height === 852 ||
    width === 852 ||
    height === 896 ||
    width === 896 ||
    height === 926 ||
    width === 926 ||
    height === 932 ||
    width === 932);
export default function SearchScreen(props) {
  const { t } = i18n;
  const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
  const {
    fetchCoordsfromPlace,
    fetchPlacesAutocomplete,
    updateTripPickup,
    updateTripDrop,
    editAddress
  } = api;
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState([]);
  const [isShowingResults, setIsShowingResults] = useState(false);
  const tripdata = useSelector(state => state.tripdata);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const { locationType, addParam } = props.route.params;
  const [loading, setLoading] = useState();
  const settingsdata = useSelector(state => state.settingsdata.settings);
  const [settings, setSettings] = useState({});
  const [selLocations, setSelLocations] = useState([]);
  const auth = useSelector(state => state.auth);
  const [profile, setProfile] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isShowingResults2, setIsShowingResults2] = useState(false);
  const [searchResults2, setSearchResults2] = useState([]);
  const [searchKeyword2, setSearchKeyword2] = useState('');
  const [addressName,setAddressName] = useState('');
  const [address,setAddress] = useState('');
  const addressdata = useSelector(state => state.addressdata);
  const [saveNameValue, setSaveNameValue] = useState('');
  const saveName = [
    {value: t('home'), lable: t('home'), icon: 'home-outline', type: 'material-community'},
    {value: t('work'), lable: t('work'), icon: 'work-outline', type: 'materialIcons'},
    {value: t('other'), lable: t('other'), icon: 'location', type: 'entypo'}
  ];

  const [UUID, setUUID] = useState();

  useEffect(()=>{
    const uuidv4 = uuid.v4()
    setUUID(uuidv4);
    return () => {
      setUUID(null);
    };
  },[]);

  useEffect(() => {
    if (addressdata.addresses) {
        setSavedAddresses(addressdata.addresses);
    } else {
      setSavedAddresses([]);
    }    
  },[addressdata, addressdata.addresses]);

  useEffect(() => {
    if (settingsdata) {
      setSettings(settingsdata);
    }
  }, [settingsdata]);

  useEffect(() => {
    if (auth.profile && auth.profile.uid) {
        setProfile(auth.profile);
    } else {
        setProfile(null);
    }
  }, [auth && auth.profile]);

  useEffect(() => {
    if (settingsdata) {
      setSettings(settingsdata);
    }
  }, [settingsdata]);

  const setAddressOnMap = (item)=>{
    props.navigation.dispatch(StackActions.pop(1));
    if(locationType == 'pickup'){
      dispatch(updateTripPickup({...tripdata.pickup, source:"mapSelect"}));
    }else{
      dispatch(updateTripDrop({...tripdata.drop, source:"mapSelect"}));
    }
  }

  useEffect(() => {
    if (tripdata.drop && locationType == 'drop') {
      let arr = []
      if (tripdata.drop && tripdata.drop.waypoints) {
        const waypoints = tripdata.drop.waypoints;
        for (let i = 0; i < waypoints.length; i++) {
          arr.push(waypoints[i]);
        }
      }
      if (tripdata.drop.add) {
        arr.push({
          lat: tripdata.drop.lat,
          lng: tripdata.drop.lng,
          add: tripdata.drop.add,
          source: tripdata.drop.source
        });
      }
      setSelLocations(arr);
    }
  }, [locationType, tripdata.drop]);

  const searchLocation = async (text) => {
    setSearchKeyword(text);
    if (text.length > (settings.AllowCriticalEditsAdmin ? 3 : 5)) {
      const res = await fetchPlacesAutocomplete(text, UUID);
      if (res) {
        setSearchResults(res);
        setIsShowingResults(true);
      }
    }
  };

  const updateLocation = (data) => {
    setModalVisible(false);
    setLoading(true);
    setSearchKeyword(checkSearchPhrase(data.description));
    setIsShowingResults(false);
    if (data.place_id) {
      fetchCoordsfromPlace(data.place_id).then((res) => {
        if (res && res.lat) {
          if (locationType == 'pickup') {
            dispatch(updateTripPickup({
              lat: res.lat,
              lng: res.lng,
              add: data.description,
              source: 'search'
            }));
            if (appConsts.hasMultiDrop) {
              props.navigation.dispatch(StackActions.pop(1));
            }
          } else {
            if (appConsts.hasMultiDrop) {
              let arr = selLocations;
              arr.push({
                lat: res.lat,
                lng: res.lng,
                add: data.description,
                source: 'search'
              });
              Keyboard.dismiss();
              setSelLocations(arr);
            } else {
              dispatch(updateTripDrop({
                lat: res.lat,
                lng: res.lng,
                add: data.description,
                source: 'search'
              }));
            }
          }
          setLoading(false);
          if (!appConsts.hasMultiDrop) {
            props.navigation.dispatch(StackActions.pop(1));
          }
        } else {
          Alert.alert(t('alert'), t('place_to_coords_error'));
        }
      });
    } else {
      if (data.description) {
        if (locationType == 'pickup') {
          dispatch(updateTripPickup({
            lat: data.lat,
            lng: data.lng,
            add: data.description,
            source: 'search'
          }));
          if (appConsts.hasMultiDrop) {
            props.navigation.dispatch(StackActions.pop(1));
          }
        } else {
          if (appConsts.hasMultiDrop) {
            let arr = [...selLocations];
            let notFound = true;
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].add == data.description) {
                notFound = false;
                break;
              }
            }
            if (notFound) {
              let entry = {
                lat: data.lat,
                lng: data.lng,
                add: data.description,
                source: 'search'
              };
              arr.push(entry);
            }
            Keyboard.dismiss();
            setSelLocations(arr);
          } else {
            dispatch(updateTripDrop({
              lat: data.lat,
              lng: data.lng,
              add: data.description,
              source: 'search'
            }));
          }

        }
        setLoading(false);
        if (!appConsts.hasMultiDrop) {
          props.navigation.dispatch(StackActions.pop(1));
        }
      }
    }
  }

  const searchSaveLocation = async (text) => {
    setSearchKeyword2(text);
    if (text.length > (settings.AllowCriticalEditsAdmin ? 3 : 5)) {
      const res = await fetchPlacesAutocomplete(text, UUID);
      if (res) {
        setSearchResults2(res);
        setIsShowingResults2(true);
      }
    }
  };

  useEffect(() => {
    if (tripdata.drop && locationType == 'drop') {
      let arr = []
      if (tripdata.drop && tripdata.drop.waypoints) {
        const waypoints = tripdata.drop.waypoints;
        for (let i = 0; i < waypoints.length; i++) {
          arr.push(waypoints[i]);
        }
      }
      if (tripdata.drop.add) {
        arr.push({
          lat: tripdata.drop.lat,
          lng: tripdata.drop.lng,
          add: tripdata.drop.add,
          source: tripdata.drop.source
        });
      }
      setSelLocations(arr);
    }
  }, [locationType, tripdata.drop]);

  const okClicked = () => {
    let waypoints = [...selLocations];
    waypoints.splice(selLocations.length - 1, 1);
    let dropObj = {
      ...selLocations[selLocations.length - 1],
      waypoints: waypoints
    }
    dispatch(updateTripDrop(dropObj));
    props.navigation.dispatch(StackActions.pop(1));
  }

  const saveLocation = (item)=>{
    setLoading(true);
    if(item && saveNameValue && ((saveNameValue== t('other') && addressName) || saveNameValue!= t('other'))){
      let name = saveNameValue== t('other') ? addressName : saveNameValue
      fetchCoordsfromPlace(item.place_id).then((res) => {
        if (res && res.lat) {
          let dropObj = {
            lat: res.lat,
            lng: res.lng,
            description: item.description,
            name: name.toLowerCase()
          }
         dispatch(editAddress(profile.uid, dropObj, 'Add'));
        }
      })
      setTimeout(()=>{
        setAddress('')
        setAddressName('')
        setLoading(false)
        setSearchKeyword2('')
        setSaveNameValue('')
      },3000)
    }else{
      Alert.alert(
        t('alert'),
        t('no_details_error'),
        [
          { text: t('ok'), onPress: () => {setLoading(false) } }
        ]
      );
    }
  }

  const removeItem = (index) => {
    let arr = [...selLocations];
    arr.splice(index, 1);
    setSelLocations(arr);
  }

  const onPressDelete = (item) =>{
    dispatch(editAddress(profile.uid, item, 'Delete'));
  }

  const closeModel = () => {
    setSearchKeyword2('')
    setAddressName('')
    setAddress('')
    setModalVisible(!modalVisible)
    setSaveNameValue('')
  }

  const cancelAddress = () => {
    setSearchKeyword2('')
    setAddressName('')
    setAddress('')
    setSaveNameValue('')
  }


  return (
    <View style={{flex:1}}>
      <View style={{flex: 1,backgroundColor: colors.TRANSPARENT, height:'100%', width: '100%', alignContent: 'center', alignItems:'center' }}>

      <View style={[styles.addressBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={[styles.contentStyle]}>
          {locationType == 'drop' ?
            <View style={[styles.addressBox, {flexDirection:isRTL? 'row-reverse':'row'}]}>
              <View style={styles.hbox1} />
              <View style={[styles.addressStyle1, {flexDirection:isRTL? 'row-reverse':'row'}]}>
                <Text numberOfLines={1} style={[styles.textStyle, { textAlign: isRTL ? "right" : "left", fontSize: 14 }]}>{tripdata.pickup && tripdata.pickup.add ? tripdata.pickup.add : t('map_screen_where_input_text')}</Text>
              </View>
            </View>
          : null }

          {appConsts.hasMultiDrop && selLocations.length > 0 ?
            <FlatList
              data={selLocations}
              renderItem={({ item, index }) => {
                return (
                <View key={"key" + index} style={[styles.addressBox, {flexDirection:isRTL? 'row-reverse':'row', marginBottom: 1, width: width-12}]}>
                  <View style={styles.multiAddressChar}>
                    <Text style={{fontFamily:fonts.Bold, fontSize: 14, color: colors.BLACK }}>{String.fromCharCode(65+index)}</Text> 
                  </View>
                  <View style={[styles.multiAddressStyle, {flexDirection:isRTL? 'row-reverse':'row'}]}>
                    <Text numberOfLines={1} style={[styles.textStyle, {textAlign: isRTL ? "right" : "left", width: width-80 }]}>{item.add}</Text>
                  </View>
                  <TouchableOpacity style={styles.dropremove} onPress={() => removeItem(index)}>
                    <Entypo name="cross" size={24} color= {colors.SECONDARY} style={{borderLeftWidth: 1, borderLeftColor: colors.SECONDARY}}/>
                  </TouchableOpacity>
                </View>
                );
              }}
              keyExtractor={(item) => item.add}
              style={styles.multiLocation}
            />
          : null}
    
          <View style={styles.addressStyle2}>
            <View style={[styles.autocompleteMain, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {locationType == 'pickup' ?
                <View style={styles.hbox1} />
              :
                <View style={styles.hbox3} />
              }
              <TextInput
                placeholder={t('search_for_an_address')}
                returnKeyType="search"
                style={[styles.searchBox, isRTL ? { textAlign: 'right' } : { textAlign: 'left' }]}
                placeholderTextColor= {colors.BLACK}
                onChangeText={(text) => searchLocation(text)}
                value={searchKeyword}
              />
            </View>
          </View>
        </View>
      </View>

      {!searchKeyword ?
       <TouchableOpacity onPress={() => setAddressOnMap()} style={[styles.saveBox,{flexDirection:isRTL? 'row-reverse':'row', marginTop: 5}]}>
        <View style={{height: 45, justifyContent: 'center' }}>
          <Text style={{ textAlign: isRTL ? "right" : "left", fontSize: 20, fontFamily:fonts.Regular}}>{ locationType == 'pickup' ? t('pickup_address_from_map') : t('drop_address_from_map')}</Text>
        </View>
        <MaterialIcons name={isRTL ? "keyboard-arrow-left" : "keyboard-arrow-right"} size={34} color= {colors.SECONDARY} />
      </TouchableOpacity>
      :null }

     {!searchKeyword ?
     <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.saveBox,{flexDirection:isRTL? 'row-reverse':'row', marginTop: 10}]}>
        <View style={{height: 45, justifyContent: 'center' }}>
          <Text style={{ textAlign: isRTL ? "right" : "left", fontFamily:fonts.Regular,fontSize: 20}}>{t('saved_address')}</Text>
        </View>
        <MaterialIcons name={isRTL ? "keyboard-arrow-left" : "keyboard-arrow-right"} size={34} color= {colors.SECONDARY} />
      </TouchableOpacity>
      :null }

      {searchKeyword && isShowingResults ?
        <FlatList
          keyboardShouldPersistTaps='always'
          data={searchResults}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                key={item.description}
                style={styles.resultItem}
                onPress={() => updateLocation(item)}>
                <Text numberOfLines={1} style={{fontSize: 16,fontFamily:fonts.Regular, textAlign: isRTL ? "right" : "left", width: width-20}}>{item.description}</Text>
              </TouchableOpacity>
            );
          }}
          style={styles.searchResultsContainer}
        />
        : null}

        {loading ?
          <View style={styles.loading}>
            <ActivityIndicator color={colors.BLACK} size='large' />
          </View>
        : null}
        {selLocations.length > 0 && locationType == 'drop' ?
          <TouchableOpacity  onPress={okClicked} style={styles.floting}>
            <Text style={styles.headerTitleStyle}>{t('ok')}</Text>
          </TouchableOpacity>
        : null}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={[styles.centeredView,{marginTop: hasNotch ? 35 : null}]}>
          <View style={styles.modalView}>
            <View style={{flexDirection:isRTL? 'row-reverse':'row', alignItems: "center", backgroundColor: MAIN_COLOR}}>
              <View style={{width: 40, height: 45}}>
              {((searchKeyword2 && isShowingResults2) || address || addressName) ?
                  !address ?
                  <Entypo name="cross" size={35} color= {colors.WHITE} onPress={() => searchSaveLocation()} style={{marginTop: 4}}/>
                  : null
                :
                <MaterialIcons name={isRTL ? "keyboard-arrow-right" : "keyboard-arrow-left"} size={40} color= {colors.WHITE} onPress={() => closeModel()}/>
              }
              </View>
              <View style={styles.savedbox}>
                <Text style={styles.savesadd}>{t('saved_address')}</Text>
              </View>
            </View>
          </View>

          <View style={{height: 65, alignItems: 'center'}}>
          {(searchKeyword2 && isShowingResults2) || address || addressName?
            <View style={{ height: 10, width: width, backgroundColor: MAIN_COLOR}}>
              <View style={{ height: 10, width: width, backgroundColor: colors.WHITE, borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
              </View>
            </View>
            : null }
            
            <View style={[styles.addressStyle2,{borderWidth: 1, borderRadius: 5, marginTop: ((searchKeyword2 && isShowingResults2) || address || addressName) ? 0 : 10}]}>
              <View style={[styles.autocompleteMain, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <FontAwesome name="search" size={20} color={colors.BLACK} style={{marginHorizontal: 5}} />
                <TextInput
                  placeholder={t('search_for_an_address')}
                  returnKeyType="search"
                  style={[styles.searchBox, isRTL ? { textAlign: 'right' } : { textAlign: 'left', width: width-75}]}
                  placeholderTextColor={colors.BLACK}
                  onChangeText={(text) => searchSaveLocation(text)}
                  value={ address ? address.description : searchKeyword2}
                />
                {address ?
                  <TouchableOpacity style={{ justifyContent: 'center' ,alignItems: 'center', height: 48}} onPress={() => setAddress('')}>
                    <Entypo name="cross" size={24} color= {colors.SECONDARY} style={{borderLeftWidth: 1, borderLeftColor: colors.SECONDARY}}/>
                  </TouchableOpacity>
                : null }
              </View>
            </View>

            {address?
              <View style={[styles.categoryBox, {flexDirection: isRTL? 'row-reverse' : 'row'}]}>
                {saveName.map((item, index) => (
                  <TouchableOpacity
                  key={index}
                    style={[styles.categoryItem,{backgroundColor: colors.WHITE, borderColor: item.value == saveNameValue ? MAIN_COLOR : null, borderWidth: item.value == saveNameValue ? 3 : 1, marginHorizontal: 2}]}
                    onPress={() => {
                      setSaveNameValue(item.value);
                    }}
                  >
                    <Icon
                      name={item.icon}
                      type={item.type}
                      color={colors.BLACK}
                      size={22}
                      containerStyle={{ margin: 1 }}
                    />
                    <Text style={styles.categoryLabel}>
                      {item.lable}
                    </Text>
                  </TouchableOpacity>
                  
                ))}
              </View>
            : null}

            {address && saveNameValue== t('other') ?
              <View style={{width:width - 15, marginTop: 10}}>
                <TextInput
                  style={{fontFamily:fonts.Regular, borderBottomColor: colors.SECONDARY, borderBottomWidth: 1, height: 40}}
                  placeholder={t('name')}
                  placeholderTextColor={colors.SECONDARY}
                  value={addressName ? addressName : ''}
                  keyboardType={'email-address'}
                  onChangeText={(text) => { setAddressName( text ) }}
                  secureTextEntry={false}
                  blurOnSubmit={true}
                  errorStyle={styles.errorMessageStyle}
                  inputContainerStyle={[styles.inputContainerStyle, {height: 50}]}
                  autoCapitalize='none'
                />    
              </View>
            :null}

            {address ? 
            <View style={{flexDirection: isRTL?'row-reverse' : 'row', width: width, justifyContent :'space-evenly'}}>
              {loading ? null :
                <Button
                  onPress={() => cancelAddress()}
                  title={t('cancel')}
                  loading={false}
                  titleStyle={[styles.buttonTitle]}
                  buttonStyle={[styles.registerButton, { marginTop: 20, backgroundColor: colors.RED}]}
                />
              }
              <Button
                onPress={() => saveLocation(address)}
                title={t('save')}
                loading={loading}
                titleStyle={styles.buttonTitle}
                buttonStyle={[styles.registerButton, { marginTop: 20}]}
              />
            </View>
            : null }
          </View>

          {searchKeyword2 && isShowingResults2 && !address?
            <FlatList
              keyboardShouldPersistTaps='always'
              data={searchResults2}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    key={item.description}
                    style={styles.resultItem}
                    onPress={() => setAddress(item)}>
                    <Text numberOfLines={1} style={{fontSize: 16, fontFamily:fonts.Regular, textAlign: isRTL ? "right" : "left", width: width-20}}>{item.description}</Text>
                  </TouchableOpacity>
                );
              }}
              style={[styles.searchResultsContainer,{marginTop: 10}]}
            />
            : null}
          
          {(searchKeyword2 && isShowingResults2) || address || addressName?
           null 
          :
            <View style={styles.savedaddlist}>
              <ScrollView style={{flex: 1, width: width-15, height: 'auto'}} showsVerticalScrollIndicator={false}>
                {savedAddresses && savedAddresses.length > 0 ?
                  savedAddresses.map((address, index) => {
                    return (
                      <View key={index} style={{flexDirection:isRTL? 'row-reverse':'row', borderBottomWidth: 1, width: width-15, minHeight: 60, paddingVertical: 5}}>
                        <TouchableOpacity onPress={() => updateLocation(address)} style={{flexDirection:isRTL? 'row-reverse':'row', alignItems: "center", width: width-50}}>
                          <View style={styles.vew1}>
                            {address.name == 'home' ?
                              <AntDesign name="home" size={22} color= {colors.BLACK} />
                            : address.name == 'work'?
                              <MaterialIcons name="work-outline" size={22} color= {colors.BLACK} />
                            :
                              <Entypo name="location" size={22}  color= {colors.BLACK} />
                            }
                          </View>
                          <View style={{ justifyContent: 'center', width: width-95, marginHorizontal: 5}}>
                            <Text style={[styles.savedAddressesBox, { textAlign: isRTL ? "right" : "left"}]}>{(address.name).toUpperCase()}</Text>
                            <Text style={[styles.savedAddressesBox, { textAlign: isRTL ? "right" : "left", fontSize: 13}]}>{address.description}</Text>
                          </View>
                        </TouchableOpacity>
                        <View style={{width: 30}}>
                          <MaterialCommunityIcons name="delete-circle-outline" size={28} color={colors.SECONDARY} onPress={() => onPressDelete(address)} />
                        </View>
                        
                      </View>
                    );
                  })
                : 
                  <View style={styles.nosavedadd}>
                    <Text style={{fontSize: 18,fontFamily:fonts.Bold}}>{t('no_saved_address')}</Text> 
                  </View>
                }
              </ScrollView>
            </View>
          }
        </View>
      </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  floting:{
    minWidth: 150,
    height:50,
    position:'absolute',
    bottom:40,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    borderRadius:10,
    backgroundColor:colors.GREEN,
    shadowColor: colors.BLACK,
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40
  },
  autocompleteMain: {
    alignItems: 'center'
  },
  searchBox: {
    width: width-45,
    height: 40,
    fontSize: 14,
    borderColor: colors.WHITE,
    color:  colors.BLACK,
    borderRadius: 10,
    fontFamily:fonts.Regular
  },
  description: {
    color: colors.BLACK,
    textAlign: 'left',
    fontSize: 14
  },
  resultItem: {
    width: '100%',
    justifyContent: 'center',
    borderBottomColor: colors.BLACK,
    borderBottomWidth: 1,
    backgroundColor: colors.TRANSPARENT,
    alignItems: 'flex-start',
    height: 40,
    justifyContent:'center',
    borderBottomWidth: .5,
    paddingHorizontal: 5
  },
  searchResultsContainer: {
    width: width,
    paddingHorizontal: 5
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily: fonts.Bold,
    fontSize: 20
  },
  multiLocation: {
    width: width-10
  },
  addressBar: {
    marginVertical: 5,
    width: width - 10,
    flexDirection: 'row',
    backgroundColor: colors.WHITE,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    borderRadius: 8,
    elevation: 3
  },
  contentStyle: {
    justifyContent: 'center',
    width: width,
    alignItems: 'center'
  },
  addressBox: {
    height: 48,
    width: width - 20,
    alignItems:'center',
    paddingTop: 2
  },
  addressStyle1: {
    borderBottomColor: colors.BLACK,
    borderBottomWidth: 1,
    height: 48,
    width: width - 55,
    alignItems:'center'
  },
  addressStyle2: {
    height: 45,
    width: width - 15,
    justifyContent: 'center',
    marginTop: 2
  },
  hbox1: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: colors.GREEN_DOT,
    marginHorizontal: 3
  },
  hbox3: {
    height: 12,
    width: 12,
    backgroundColor: colors.RED,
    marginHorizontal: 5
  },
  textStyle: {
    fontFamily: fonts.Regular,
    fontSize: 14,
    color: colors.BLACK,
    width: width - 36
  },
  saveBox:{
    height: 50,
    width: width-10,
    justifyContent:'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: colors.WHITE,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    borderRadius: 10,
    elevation: 3
  },
  centeredView: {
    flex: 1,
    backgroundColor: colors.WHITE
  },
  modalView: {
    backgroundColor:  colors.WHITE,
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  vew1: {
    backgroundColor: colors.WHITE,
    borderRadius: 30,
    marginHorizontal: 5,
    padding: 5,
    shadowColor: colors.BLACK,
    shadowOffset: {
        width:0,
        height: 2,
    },
    shadowOpacity: 3,
    shadowRadius: 2,
    elevation: 2
  },
  savedAddressesBox:{
      fontFamily: fonts.Regular,
      color:  colors.BLACK,
      fontSize: 16
  },
  buttonTitle: {
    fontSize: 14,
    fontFamily:fonts.Regular
  },
  registerButton: {
    backgroundColor: MAIN_COLOR,
    width: 120,
    height: 45,
    borderWidth: 0,
    marginTop: 30,
    borderRadius: 15,
  },
  floatButton: {
    borderWidth: 1,
    borderColor: colors.BLACK,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    position: "absolute",
    right: 10,
    height: 60,
    backgroundColor: colors.BLACK,
    borderRadius: 30
  },
  savedbox:{
    height: 45,
    width: width-80,
    justifyContent: 'center'
  },
  savesadd:{
    textAlign: 'center',
    fontSize: 20,
    fontFamily:fonts.Bold,
    color: colors.WHITE
  },
  savedaddlist: {
    flex: 1,
    backgroundColor: colors.WHITE,
    shadowColor: colors.BLACK,
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    width: width
  },
  nosavedadd:{
    flex: 1,
    width: width-15,
    alignItems:'center',
    backgroundColor: colors.WHITE,
    marginTop: 50
  },
  dropremove:{
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: colors.BLACK,
    borderBottomWidth: 1,
    height: 48
  },
  categoryBox: {
    width: width-10,
    height: 60,
    marginTop: 5
  },
  categoryItem: {
    height: 50,
    width: 90,
    marginVertical: 5,
    paddingVertical: 5,
    backgroundColor: colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: 5,
    borderColor: colors.SECONDARY,
    borderWidth: 1
  },
  categoryLabel:{
    fontFamily: fonts.Regular,
    fontSize: 14,
  },
  multiAddressStyle: {
    borderBottomColor: colors.BLACK,
    borderBottomWidth: 1,
    height: 48,
    width: width - 55,
    alignItems:'center',
    width: width-80
  },
  multiAddressChar:{
    height: 20,
    width: 20,
    marginHorizontal: 3,
    borderWidth: 1,
    backgroundColor: colors.SECONDARY,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
})