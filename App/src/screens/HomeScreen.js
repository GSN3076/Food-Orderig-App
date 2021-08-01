import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import AsyncStorage from '@react-native-community/async-storage';
import { EventRegister } from 'react-native-event-listeners';
import Home from './MainScreens/Home/Home';
import Search from './MainScreens/Search/Search';
import Account from './MainScreens/Account/Account';
import Wishlist from './MainScreens/Wishlist/Wishlist';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { Icon } from '@ui-kitten/components';
import CartList from '../components/CartList';
import Cart from './MainScreens/Home/Cart';

const BottomTabs = createBottomTabNavigator();

export default class HomeScreen extends Component {

  render() {
    return (
        <BottomTabs.Navigator tabBarOptions={{
                    showLabel:false,
                    style:{
                        height:heightPercentageToDP(7),
                        borderWidth:0,
                        elevation:0
                    },
                    keyboardHidesTabBar:true}}>
                    <BottomTabs.Screen  name="Home" options={{
                        tabBarIcon:(props) => <Icon name={props.focused ? "home" : "home-outline" } fill={"gold"}  style={{height: heightPercentageToDP(3) ,width:props.focused ? heightPercentageToDP(4) : heightPercentageToDP(3) ,}}   />
                    }}  >
                        {props =><Home {...props}  />}
                        </BottomTabs.Screen>
                    <BottomTabs.Screen name="Search" component={Search}
                    options={{
                        tabBarIcon:(props) => <Icon name={props.focused ? "search" : "search-outline" } fill={"black"}  style={{height: heightPercentageToDP(3) ,width:props.focused ? heightPercentageToDP(4) : heightPercentageToDP(3) ,}}  />
                    }}
                    />
                    <BottomTabs.Screen name="CartList"  
                    options={{
                        tabBarIcon:(props) => <Icon name={props.focused ? "shopping-cart" : "shopping-cart-outline" } fill={"black"}  style={{height: heightPercentageToDP(3) ,width:props.focused ? heightPercentageToDP(4) : heightPercentageToDP(3) ,}}   />
                    }}>
                        {props => <Cart {...props}   />}
                        </BottomTabs.Screen>
                    <BottomTabs.Screen name="Account" component={Account} options={{
                        tabBarIcon:(props) => <Icon name={props.focused ? "person" : "person-outline" } fill={"black"}  style={{height: heightPercentageToDP(3) ,width:props.focused ? heightPercentageToDP(4) : heightPercentageToDP(3) ,}}   />
                    }}   />
        </BottomTabs.Navigator>
    );
  }
}
