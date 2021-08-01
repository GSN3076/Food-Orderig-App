import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

export default function Loader() {
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator color="blue" size="large"  />
        </View>
    )
}
