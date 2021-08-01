import React from 'react'
import { View, Text } from 'react-native'
import LottiView from "lottie-react-native";
import { widthPercentageToDP } from 'react-native-responsive-screen';


export default function PaymentSuccess() {
    return (
        <View style={{flex:1,justifyContent:"center",alignItems:'center',backgroundColor:'white'}}>
            <LottiView source={require("../../../../assets/animations/PaymentSuccess.json")}   autoPlay loop style={{width:widthPercentageToDP(100)}}/>
            <Text style={{fontFamily:'Poppins-Bold',fontSize:30}}>Payment Successful</Text>
        </View>
    )
}
