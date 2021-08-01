import React, { Component, useEffect, useState } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout, } from '@ui-kitten/components';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import { API_URL, auth } from './src/config/config';
import { EvaIconsPack } from "@ui-kitten/eva-icons"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import OtpScreen from './src/screens/OtpScreen';
import { StatusBar, View,Text, Alert, Vibration } from 'react-native';
import UserInfo from './src/screens/UserInfo';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-community/async-storage';
import { setCustomText } from "react-native-global-props"
import Signup from './src/screens/Signup';
import { useSelector } from 'react-redux';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import changeNavigationBarColor from "react-native-navigation-bar-color"
import SellerHome from './src/screens/Seller/SellerHome';
import Walkthrough from './src/screens/Walkthrough';
import PhoneVerificaiton from './src/screens/PhoneVerification';
import SplashScreen from 'react-native-splash-screen';
// import messaging from "@react-native-firebase/messaging"


import PushNotification from "react-native-push-notification";



// Must be outside of any component LifeCycle (such as `componentDidMount`).






const MainStack = createStackNavigator();
const AuthStack = createStackNavigator();

const customTextProps = {
  style: {
    fontFamily: 'Poppins-Regular',
  }
};


setCustomText(customTextProps)


const MainScreen = () => {
  return (
    <MainStack.Navigator screenOptions={{}} headerMode="none">
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="SellerHome" component={SellerHome}  />
    </MainStack.Navigator>
  )
}

const AuthScreen = () => {
  return (
    <AuthStack.Navigator screenOptions={{}} headerMode="none" >
      <MainStack.Screen name="Walkthrough" component={Walkthrough} />
      <MainStack.Screen name="PhoneVerification" component={PhoneVerificaiton} />
      <MainStack.Screen name="Login" component={LoginScreen} />
      <MainStack.Screen name="Signup" component={Signup} />
      <MainStack.Screen name="OTP" component={OtpScreen} />
      <MainStack.Screen name="UserInfo" component={UserInfo} />
    </AuthStack.Navigator>
  )
}




export default function App() {

  const userReducer = useSelector(state => state.userReducer) 
  const {user} = userReducer
  
  const client = new ApolloClient({
    uri: `${API_URL}/graphql`,
    cache: new InMemoryCache(),
    headers:{
      "Authorization":`Bearer ${user ?  user.token : ""}`
    }
  });
  

const [loading, setloading] = useState(true);

SplashScreen.hide()
changeNavigationBarColor("white",true);

console.log(user)



useEffect(() =>{

  PushNotification.configure({
    onRegister: function (token) {
    console.log("TOKEN:", token);
  },
    onNotification: function (notification) {
      Vibration.vibrate()
    },
    onAction: function (notification) {
      
    },
    onRegistrationError: function(err) {
      console.error(err.message, err);
    },
      permissions:{
        badge:true,
        alert:true,
        sound:true,
      },
    popInitialNotification: true,
    requestPermissions: true,
  });

},[])



return (<>
    <IconRegistry icons={EvaIconsPack} />
      <ApolloProvider client={client}>
        <ApplicationProvider {...eva} theme={eva.light}>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
            <NavigationContainer>
              {
                user ? <MainScreen /> : <AuthScreen />
              }
            </NavigationContainer>
        </ApplicationProvider>
        </ApolloProvider>
  </>
  )
}