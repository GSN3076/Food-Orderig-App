import { Button, Icon, Layout, ThemeProvider } from '@ui-kitten/components';
import { ThemeService, useTheme } from '@ui-kitten/components/theme/theme/theme.service';
import React, { Component, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

export default function OtpScreen(props) {

  const [code, setCode] = useState('');

console.log(props.route.params)

const  handleOTP = async() =>{
    try {
       await  props.route.params.confirmation.cofirm(code)
       Alert.alert("Sucess")
    } catch (error) {
      console.log(error)
      console.log('Invalid code.');
    }
  }

    return (
            <Layout style={{flex:1,alignItems:'center'}} >
                <LinearGradient style={{position:'absolute',top:0,left:0,right:0,height:heightPercentageToDP(40),}} colors={['#ADC8FF','#102693',]}  >

                </LinearGradient>
                    <View style={{alignItems:'center',backgroundColor:'#fff',height:heightPercentageToDP(55),borderRadius:heightPercentageToDP(2),marginTop:heightPercentageToDP(10),width:widthPercentageToDP(90),elevation:3}} >
                        <Text style={{fontSize:heightPercentageToDP(3),marginTop:heightPercentageToDP(10)}} >Enter One Time Password.</Text>
                        <Text style={{fontSize:heightPercentageToDP(2),marginTop:10}} >Resend in 23.</Text>
                    <OTPInputView
                        style={{width: '80%', height: heightPercentageToDP(20),}}
                        pinCount={6}
                        // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                        onCodeChanged = {code => { setCode(code)}}
                        autoFocusOnLoad
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        onCodeFilled = {(code) => {
                            console.log(`Code is ${code}, you are good to go!`)
                        }}      
                />
                <Text style={{fontSize:heightPercentageToDP(2),margin:10}} >Change Number</Text>
                <Button  onPress={handleOTP} style={{width:widthPercentageToDP(80),height:heightPercentageToDP(7),margin:10,}}  >
                        <Text style={{fontSize:heightPercentageToDP(2),}} >Verify Number </Text>
                    </Button>
                </View>
            </Layout>
        );
  
}


const styles = StyleSheet.create({
    borderStyleBase: {
      width: 30,
      height: 45
    },
  
    borderStyleHighLighted: {
      borderColor: "#3366FF",
    },
  
    underlineStyleBase: {
      width: 30,
      height: 45,
      borderWidth: 0,
      borderBottomWidth: 1,
      borderBottomColor:'#3366FF',
      color:'black',
      fontSize:heightPercentageToDP(2)
    },
  
    underlineStyleHighLighted: {
      borderColor: "#3366FF",
      color:'black'
    },
  });