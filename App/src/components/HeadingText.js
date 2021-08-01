import React from 'react'
import { View, Text } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'

export default function HeadingText(props) {
    return (
        <View style={{flexDirection:'row',alignItems:'center'}} >
            <Text style={{ fontSize: heightPercentageToDP(2), marginHorizontal: heightPercentageToDP(2),fontFamily:'Poppins-Bold' }} >{props.text}</Text>
            <View style={{borderWidth:.8,borderColor:'#ececec',height:.8,width:widthPercentageToDP(100)}} />
        </View>
    )
}
