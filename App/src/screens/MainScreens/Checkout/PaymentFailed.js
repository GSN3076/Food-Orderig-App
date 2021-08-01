import React from 'react'
import { View, Text } from 'react-native'
import LottiView from "lottie-react-native";
import { widthPercentageToDP } from 'react-native-responsive-screen';

export default function PaymentFailed(props) {
    return (
        <View style={{flex:1,justifyContent:"center",alignItems:'center',backgroundColor:'white'}}>
            <LottiView source={require("../../../../assets/animations/PaymentFailed.json")}   autoPlay loop style={{width:widthPercentageToDP(80)}}/>
            <Text style={{fontFamily:'Poppins-Bold',fontSize:30}}>{props.title}</Text>
            <Text style={{fontFamily:'Poppins-SemiBold',fontSize:18}}>{props.description}</Text>
        </View>
    )
}
