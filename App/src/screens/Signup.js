import { Layout,Input, Icon, Interaction, Button, } from '@ui-kitten/components';
import React, { Component, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Dimensions, ScrollView, TextInput, StyleSheet, Image, Alert, ActivityIndicator, Modal } from 'react-native';
import {heightPercentageToDP,widthPercentageToDP} from "react-native-responsive-screen"
import LinearGradient from 'react-native-linear-gradient'
import auth from "@react-native-firebase/auth"
import OTPInputView from '@twotalltotems/react-native-otp-input';
import * as Aniamtable from "react-native-animatable"
import { API_URL } from '../config/config';
import { loginUser } from '../reduxStore/actions';
import { useDispatch } from 'react-redux';


export default function LoginScreen (props) {

        const dispatch = useDispatch()
        const [email, setemail] = useState();
        const [submitting, setsubmitting] = useState(false);
        const [code, setcode] = useState();
        const [password, setpassword] = useState();
        const [name, setname] = useState();
        const [next, setnext] = useState();
        const [emailError, setemailError] = useState();
        const [eye, seteye] = useState(false);
        const [confirmation, setconfirmation] = useState();
        const [otp, setotp] = useState();
        const [phone, setphone] = useState(props.route.params.phone);

        
       const handleNext = () => {
        if( email.length != 0  ){
            let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!regEmail.test(email)){
                     Alert.alert("Invalid Email Id","Please enter the correct email id.");
                return;
            }else{
                // emailRef.fadeOutRight(300);
                // setnext(next:true,() =>{
                //     passRef.slideInUp(300);
                // })
            }   
          }
    }


 const createAccount = () =>{
      setsubmitting(true)
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({"password":password,"username":name,"email":email,phone:phone});
      console.log(raw)
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      };

      fetch(`${API_URL}/auth/local/register`, requestOptions)
        .then(response => response.json())
        .then(result => {
          dispatch(loginUser({...result.user,token:result.jwt}));
          console.log(result)
        })
        .catch(error => console.log('error', error))
        .finally(() => {
          setsubmitting(false)
        })
      }

    return (
      <Layout  style={{flex:1}}  >
                <View style={{justifyContent:'center',alignItems:'center',flex:1}} >
                         <ScrollView  showsHorizontalScrollIndicator={false} style={{flex:1}} horizontal pagingEnabled  >
                                    <View style={{flex:1}} >
                                        <Image source={{uri:'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=634&q=80'}} style={{flex:1,width:widthPercentageToDP(100),height:heightPercentageToDP(100),}} />
                                        <LinearGradient  style={{position:'absolute',top:0,left:0,bottom:0,right:0,justifyContent:'center',alignItems:'center'}} colors={['transparent',"black"]}  >
                                                    <Aniamtable.Text  animation="fadeInUp" style={{color:'white',fontSize:heightPercentageToDP(5),margin:20,marginBottom:100,fontFamily:"Poppins-Bold"}} >Welcome to Food Order.</Aniamtable.Text>
                                                    {/* <Aniamtable.Text ref={ref => animatedTextRef2 = ref} animation="fadeInLeft" style={{color:'white',fontSize:heightPercentageToDP(3),marginLeft:20}} >The last three or four reps is what makes the muscle grow.</Aniamtable.Text> */}
                                        </LinearGradient>
                                    </View>
                                </ScrollView>  
                </View> 
                <View style={{height:heightPercentageToDP(40),width:Dimensions.get("screen").width,backgroundColor:'#ececec',borderTopLeftRadius:20,borderTopRightRadius:20,justifyContent:'center',alignItems:'center',position:'absolute',bottom:0}} behavior="padding"   >
                             <Aniamtable.View animation="slideInUp" duration={300}   style={styles.textInputContainer} >
                            <Icon
                                    style={{width:20,height:20,margin:5}}
                                    fill='#8F9BB3'
                                    name='person-outline'
                                    animation="shake"
                                    // animationConfig={{ cycles: Infinity }}
                                />
                            {/* <Text style={styles.countryCode} >+91</Text> */}
                            <TextInput 
                                style={styles.input}
                                keyboardType="email-address"
                                placeholder="Username"
                                // maxLength={10}
                                onChangeText={(name) => setname(name)}
                            />
                    </Aniamtable.View>

                    <Aniamtable.View animation="slideInUp" duration={300}   style={styles.textInputContainer} >
                            <Icon
                                    style={{width:20,height:20,margin:5}}
                                    fill='#8F9BB3'
                                    name='email-outline'
                                    animation="shake"
                                    // animationConfig={{ cycles: Infinity }}
                                />
                            {/* <Text style={styles.countryCode} >+91</Text> */}
                            <TextInput 
                                style={styles.input}
                                keyboardType="email-address"
                                placeholder="Email"
                                // maxLength={10}
                                onChangeText={(email) => setemail(email)}
                            />
                    </Aniamtable.View> 
                    
                         <Aniamtable.View   style={styles.textInputContainer} >
                                    {/* <Text style={styles.countryCode} >+91</Text> */}
                                    <Icon   
                                            animation='shake'
                                            style={{width:20,height:20,margin:5}}
                                            fill='#8F9BB3'
                                            // animationConfig={{ cycles: Infinity }}
                                            name='lock-outline'
                                            onPress={() => seteye(!eye)}
                                        />
                                    <TextInput 
                                        style={styles.input}
                                        secureTextEntry={eye}
                                        placeholder="******************"
                                        // maxLength={10}
                                        onChangeText={(password) => setpassword(password)}
                                    />
                                        
                            </Aniamtable.View>  

                        { (submitting ? <ActivityIndicator size={"small"} color={"#8F9BB3"} /> : <Button   onPress={createAccount} style={{width:widthPercentageToDP(90),height:heightPercentageToDP(7),margin:10,backgroundColor:'gold',borderColor:'gold'}}  >
                        <Text style={{fontSize:heightPercentageToDP(2),color:'black'}} >SIGN UP</Text>
                            {/* <Icon 
                                    style={{width:20,height:20,marginTop:5}}
                                    fill='black'
                                    name='log-in-outline'
                            /> */}
                    </Button>)}
                    {/* {!next ? <Text style={{color:'black',fontSize:heightPercentageToDP(1.8),textAlign:'center',fontFamily:'Poppins-SemiBold'}} onPress={() => props.navigation.goBack("LoginScreen")} >Already have an account ? Sign In</Text> : null} */}
                    {/* {next ? <Text style={{color:'#8F9BB3',fontSize:heightPercentageToDP(2),textAlign:'center'}} onPress={() => setnext(false)} >Change Email</Text> : null} */}
                </View>
             
      </Layout>
    );
  }



const styles = StyleSheet.create({
    textInputContainer:{
        width:widthPercentageToDP(90),
        height:heightPercentageToDP(7),
        flexDirection:'row',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:'white',
        justifyContent:"center",
        marginTop:10
    },
    input:{
        width:widthPercentageToDP(80),
        height:heightPercentageToDP(6),
        borderRadius:10,
        backgroundColor:'white',
        fontSize:heightPercentageToDP(2),
        padding:5,
        letterSpacing:widthPercentageToDP(.6),
        fontFamily:"Poppins-SemiBold"
    },
    countryCode:{
        fontSize:heightPercentageToDP(3),
        margin:5
    },
    bottomRow:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:widthPercentageToDP(80)
    },
    header:{
        width:widthPercentageToDP(80),
        padding:10
    },
    heading:{
        fontSize:heightPercentageToDP(4),
        fontWeight:'bold',
        textAlign:'center'
    },
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
      
})