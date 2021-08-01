import React from 'react'
import { View, Text } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import LottieView from "lottie-react-native";

export default function Empty() {
    return (
        <View>
         <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} >
          <LottieView
            source={require("../../assets/empty.json")}
            autoSize
            autoPlay
            style={{ width: widthPercentageToDP(50) }}
          />
        </View>
    </View>
    )
}
