import { Icon } from '@ui-kitten/components';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

export default function FloatingButton (props){

    return (
      <View style={{position:'absolute',bottom:8,left:0,right:0,justifyContent:'center',alignItems:'center',flexDirection:'row', }} >
                <TouchableOpacity onPress={props.onPress}  style={{width:widthPercentageToDP(90),height:heightPercentageToDP(7),backgroundColor:'gold',borderRadius:20,flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',paddingHorizontal:60,margin:5,elevation:2}}>
                           <Text style={{color:'black',fontSize:heightPercentageToDP(2),}} >{props.title}</Text>
                            <Icon name={props.icon} fill="#000" style={{width:20,height:20}} />    
                </TouchableOpacity>
      </View>
    );
  }

