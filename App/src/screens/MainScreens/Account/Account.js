import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import auth from "@react-native-firebase/auth"
import { Divider, Icon, Layout, ListItem } from '@ui-kitten/components';
import firestore from "@react-native-firebase/firestore"
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Header from '../../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../../reduxStore/actions';
import { API_URL } from '../../../config/config';
import { createStackNavigator } from '@react-navigation/stack';
import Orders from './Orders';
import Settings from './Settings';
import Subscriptions from './Subscriptions';
import Cart from '../Home/Cart';
import Checkout from '../Checkout/Checkout';
import SubscriptionDetails from './SubscriptionDetails';

 function Account(props) {

  const userReducer = useSelector(state =>state.userReducer)
  const {user} = userReducer
  const dispatch = useDispatch()

  const logout = () =>{
    dispatch(logoutUser())
  }

    return (
      <Layout style={{flex:1}}>
          <Header title="Account"  onPress={() => props.navigation.goBack()} />
          <View style={{flexDirection:'row',margin:heightPercentageToDP(2)}}>
              {
                !user.avatar ? <Image source={{uri:'https://www.xovi.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png'}} style={{width:widthPercentageToDP(15),height:widthPercentageToDP(15),borderRadius:widthPercentageToDP(15),borderColor:'#D6E4FF',borderWidth:5}} />:
                <Image source={{uri:`${user.avatar.url}`}} style={{width:widthPercentageToDP(15),height:widthPercentageToDP(15),borderRadius:6,backgroundColor:'#ececec',borderColor:"grey",borderWidth:1}} />
              }
              <View style={{marginHorizontal:10}} >
                <Text style={{fontSize:heightPercentageToDP(2),fontFamily:'Poppins-SemiBold'}}>{user.username}</Text>
                <Text style={{fontSize:heightPercentageToDP(1.5)}}>{user.email}</Text>
              </View>
          </View>
          <View>
            <Divider />
          <ListItem
            onPress={() => props.navigation.navigate("Orders")}
            title={"My Orders"}
            description={"See all Your Orders"}
            accessoryLeft={() => <Icon name="shopping-bag-outline" fill="grey" style={{width:20,height:20}}  />}
            accessoryRight={() => <Icon name="arrow-ios-forward-outline" fill="grey" style={{width:20,height:20}}  />}
          />
          <ListItem
            onPress={() => props.navigation.navigate("Subscriptions")}
            title={"My Subscription"}
            description={"See all Your Subsciption"}
            accessoryLeft={() => <Icon name="shopping-bag-outline" fill="grey" style={{width:20,height:20}}  />}
            accessoryRight={() => <Icon name="arrow-ios-forward-outline" fill="grey" style={{width:20,height:20}}  />}
          />
          <ListItem
            title={"My Cart"}
            onPress={() => props.navigation.navigate("Cart")}
            description={"See Products in Cart"}
            accessoryLeft={() => <Icon name="shopping-cart-outline" fill="grey" style={{width:20,height:20}}  />}
            accessoryRight={() => <Icon name="arrow-ios-forward-outline" fill="grey" style={{width:20,height:20}}  />}
          />
          <ListItem
            title={"Settings"}
            onPress={() => props.navigation.navigate("Settings")}
            description={"Edit and Mange your Account"}
            accessoryLeft={() => <Icon name="settings-outline" fill="grey" style={{width:20,height:20}}  />}
            accessoryRight={() => <Icon name="arrow-ios-forward-outline" fill="grey" style={{width:20,height:20}}  />}
          />
          <ListItem
            title={"Logout"}
            onPress={() => dispatch(logoutUser())}
            description={"Use Different Account"}
            accessoryLeft={() => <Icon name="log-out-outline" fill="grey" style={{width:20,height:20}}  />}
            accessoryRight={() => <Icon name="arrow-ios-forward-outline" fill="grey" style={{width:20,height:20}}  />}
          />
          {/* <ListItem
            title={"Become Seller"}
            onPress={() => props.navigation.navigate("SellerHome")}
            description={"Sell your product"}
            accessoryLeft={() => <Icon name="car-outline" fill="grey" style={{width:20,height:20}}  />}
            accessoryRight={() => <Icon name="arrow-ios-forward-outline" fill="grey" style={{width:20,height:20}}  />}
          /> */}

          <ListItem
            title={"App Version"}
            description={"1.0.0"}
            accessoryLeft={() => <Icon name="checkmark-circle-2-outline" fill="grey" style={{width:20,height:20}}  />}
            accessoryRight={() => <Icon name="arrow-ios-forward-outline" fill="grey" style={{width:20,height:20}}  />}
          />
          </View>
      </Layout>
    );
  }



 export default function () {
  const AccountStack = createStackNavigator()
  return (
    <AccountStack.Navigator headerMode="none">
      <AccountStack.Screen name="Account">
          {props => <Account {...props} />}
      </AccountStack.Screen>
      <AccountStack.Screen name="Orders">
          {props => <Orders {...props} />}
      </AccountStack.Screen>
      <AccountStack.Screen name="Settings">
          {props => <Settings {...props} />}
      </AccountStack.Screen>
      <AccountStack.Screen name="Cart">
          {props => <Cart {...props} />}
      </AccountStack.Screen>
      <AccountStack.Screen name="Checkout">
          {props => <Checkout {...props} />}
      </AccountStack.Screen>
      <AccountStack.Screen name="Subscriptions">
          {props => <Subscriptions {...props} />}
      </AccountStack.Screen>
      
      <AccountStack.Screen name="SubscriptionDetails">
          {props => <SubscriptionDetails {...props} />}
      </AccountStack.Screen>
    </AccountStack.Navigator>
  ) 
 }