import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { fonts } from '../common/font';

const Radioform = () => {


    const [driver,setDriver] = useState();
    const [focusDriver,setfocusDriver] = useState(false)
    const [rider,setRider] = useState()
    const [focusrider,setfocusRider] = useState(false)

    const selectDriver = ()=>{
        if(focusDriver===false){
            setfocusRider(false)
            setfocusDriver(true)
        }

    }
    const selectRider = () =>{
        if(focusrider===false ){
            setfocusDriver(false)
            setfocusRider(true)
        }
    }


    return (
        <View style={{ flexDirection: "row", gap: 15 }} >
            <View style={{ flexDirection: "row", gap: 15, justifyContent: "center", alignItems: 'center' }}>
                <TouchableOpacity style={{ width: 35, borderWidth: 3, borderRadius: 20, height: 35,justifyContent:'center', alignItems:'center' }}
                onPress={selectDriver}>
                { (focusDriver  === true )  ?
                        <View style={{width:25, backgroundColor:"black",height:25, borderRadius:12,  }}></View>
                        : null
                }

                </TouchableOpacity>
                <Text style={{ fontFamily:fonts.Bold, fontSize: 18 }}>Driver</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 15, justifyContent: "center", alignItems: 'center' }}>
                <TouchableOpacity style={{ width: 35, borderWidth: 3, borderRadius: 20, height: 35,justifyContent:'center', alignItems:'center' }}
                
                onPress={selectRider}
                >
                { (focusrider === true)  ?

                        <View style={{width:25, backgroundColor:"black",height:25, borderRadius:12,  }}  ></View>
                : null
                }

                </TouchableOpacity>
                <Text style={{ fontFamily:fonts.Bold, fontSize: 18 }}>Rider</Text>
            </View>
        </View>
    )
}

export default Radioform