import { Icon } from '@ui-kitten/components';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{flexDirection:'row',alignItems:'center',height:heightPercentageToDP(10),padding:widthPercentageToDP(5),shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      backgroundColor:'white',
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 10,}} >
                 <TouchableOpacity onPress={this.props.onPress}><Icon  name="arrow-back-outline" fill="gold" style={{width:40,height:30}} /></TouchableOpacity>
                 <View>
                 <Text style={{fontSize:heightPercentageToDP(2.5),width:widthPercentageToDP(80),fontFamily:'Poppins-Bold'}} numberOfLines={1} > {this.props.title} </Text>
                 {/* <Text style={{fontSize:heightPercentageToDP(1.6),width:widthPercentageToDP(80),}} numberOfLines={1} > {this.props.title} </Text> */}
                 </View>
      </View>
    );
  }
}
