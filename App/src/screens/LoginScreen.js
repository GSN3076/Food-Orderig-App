import { Layout, Input, Icon, Interaction, Button, } from '@ui-kitten/components';
import React, { Component, useRef, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Dimensions, ScrollView, TextInput, StyleSheet, Image, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen"
import LinearGradient from 'react-native-linear-gradient'
import auth from "@react-native-firebase/auth"
import OTPInputView from '@twotalltotems/react-native-otp-input';
import * as Aniamtable from "react-native-animatable"
import Animated from 'react-native-reanimated';
import Asyncstorage from "@react-native-community/async-storage"
import { EventRegister } from "react-native-event-listeners"
import { ThemeProvider } from '@react-navigation/native';
import { API_URL } from '../config/config';
import { useDispatch } from 'react-redux';
import { loginUser } from '../reduxStore/actions';


export default function LoginScreen (props) {
            const [email, setemail] = useState('')
            const [submitting, setsubmitting] = useState(false);
            const [code, setcode] = useState('');
            const [password, setpassword] = useState('');
            const [next, setnext] = useState(false);
            const [emailError, setemailError] = useState(false);
            const [eye, seteye] = useState(true);
            const animatedTextRef1 = useRef();
            const animatedTextRef2 = useRef();
            const animatedTextRef3 = useRef();
            const animatedTextRef4 = useRef();
            const passRef = useRef("")
            const emailRef = useRef()
            const dispatch = useDispatch()

   const handleSendOtp = () => {

        setsubmitting(true)

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "identifier": email, "password": password });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        };

        fetch(`${API_URL}/auth/local`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.user) {
                    dispatch(loginUser({...result.user,token:result.jwt}));
                    setsubmitting(false)
                }else{
                    console.log(result)
                    Alert.alert(result.data[0].messages[0].message)
                    setsubmitting(false)
                }
            })
            .catch(error => console.log('error', error))
            .finally(()=> setsubmitting(false))
    }

const  hadnleAnimation = () => {
        animatedTextRef1.current.slideInLeft()
        animatedTextRef2.current.slideInUp();
        animatedTextRef3.current.slideInRight();
        animatedTextRef4.current.slideInUp();
    }

 const   handleNext = () => {

        if (email.length != 0) {
            let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!regEmail.test(email)) {
                Alert.alert("Invalid Email Id", "Please enter the correct email id.");
                return;
            } else {
                emailRef.current.fadeOutRight(300);
                setnext(true) 
                // passRef.current.slideInUp(300);
            }
        }
    }

        return (
            <Layout style={{ flex: 1 }}  >
                <StatusBar hidden />
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} >
                    <ScrollView  showsHorizontalScrollIndicator={false} style={{ flex: 1 }} horizontal pagingEnabled  >
                        <View style={{ flex: 1 }} >
                            <Image source={{ uri: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80' }} style={{ flex: 1, width: widthPercentageToDP(100), height: heightPercentageToDP(100), }} />
                            
                            <LinearGradient style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, justifyContent: 'center', alignItems: 'center' }} colors={['transparent', "black"]}  >
                                <Image source={require("../../assets/images/logo.png")}  style={{width:widthPercentageToDP(20),height:heightPercentageToDP(10)}}/>
                                <Aniamtable.Text ref={animatedTextRef1} animation="fadeInUp" style={{ color: 'white', fontSize: heightPercentageToDP(7), margin: 20, marginTop: 60, }} >Healthy <Text style={{fontFamily:'Poppins-Bold'}}>Food</Text> is no more <Text style={{fontFamily:'Poppins-Bold'}}>Booring.</Text></Aniamtable.Text>
                                {/* <Aniamtable.Text ref={animatedTextRef2} animation="fadeInLeft" style={{ color: 'white', fontSize: heightPercentageToDP(3), marginLeft: 20 }} >The last three or four reps is what makes the muscle grow.</Aniamtable.Text> */}
                            </LinearGradient>
                        </View>
                    </ScrollView>
                </View>
                <View style={{ height: heightPercentageToDP(25), width: Dimensions.get("screen").width, backgroundColor: '#ececec', borderTopLeftRadius: 20, borderTopRightRadius: 20, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0 }} behavior="padding"   >
                    {next ? <Aniamtable.View ref={passRef} style={styles.textInputContainer} >
                        {/* <Text style={styles.countryCode} >+91</Text> */}
                        <TextInput
                            style={styles.input}
                            secureTextEntry={eye}
                            placeholder="******************"
                            onChangeText={(password) => setpassword( password )}
                        />
                        <Icon
                            animation='shake'
                            style={{ width: 20, height: 20, margin: 5 }}
                            fill={!eye ? "gold" : '#8F9BB3'}
                            name='eye-outline'
                            onPress={() => seteye(!eye)}
                        />
                    </Aniamtable.View> : <Aniamtable.View animation="slideInUp" duration={300} ref={emailRef} style={styles.textInputContainer} >
                            <Icon
                                style={{ width: 20, height: 20, margin: 5 }}
                                fill='#8F9BB3'
                                name='email-outline'
                                animation="shake"
                            // animationConfig={{ cycles: Infinity }}
                            />
                            {/* <Text style={styles.countryCode} >+91</Text> */}
                            <TextInput
                                style={styles.input}
                                keyboardType="email-address"
                                placeholder="example@gmail.com"
                                // maxLength={10}
                                onChangeText={(email) => setemail( email )}
                            />
                        </Aniamtable.View>
                    }
                    {!next ? <Button onPress={handleNext} style={{ width: widthPercentageToDP(90), height: heightPercentageToDP(7), margin: 10, backgroundColor:'gold',borderColor:'gold'}}  >
                        <Text style={{ fontSize: heightPercentageToDP(2), letterSpacing: heightPercentageToDP(.5),color:'black' }} >Next</Text>
                    </Button> : (submitting ? <ActivityIndicator size={"small"} color={"#8F9BB3"} /> : <Button onPress={handleSendOtp} style={{ width: widthPercentageToDP(90), height: heightPercentageToDP(7), margin: 10,backgroundColor:'gold',borderColor:'gold' }}  >
                        <Text style={{ fontSize: heightPercentageToDP(2),color:'black' }} >Log In </Text>
                        {/* <Icon
                            style={{ width: 20, height: 20, marginTop: 10 }}
                            fill='black'
                            name='log-in-outline'
                        /> */}
                    </Button>)}
                    {!next ? <Text style={{ color: 'black', fontSize: heightPercentageToDP(1.7), textAlign: 'center',fontFamily:'Poppins-Bold' }} onPress={() => props.navigation.navigate("PhoneVerification")} >Don't have an account? Create an Account</Text> : null}
                    {next ? <Text style={{ color: 'black', fontSize: heightPercentageToDP(1.5), textAlign: 'center' ,fontFamily:'Poppins-SemiBold'}} onPress={() => setnext(false)} > Change Email</Text> : null}
                </View>
            </Layout>
        );
}

const styles = StyleSheet.create({
    textInputContainer: {
        width: widthPercentageToDP(90),
        height: heightPercentageToDP(7),
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'white',
        justifyContent: "center",
    },
    input: {
        width: widthPercentageToDP(80),
        height: heightPercentageToDP(6),
        borderRadius: 10,
        backgroundColor: 'white',
        fontSize: heightPercentageToDP(2),
        padding: 5,
        letterSpacing: widthPercentageToDP(1),
    },
    countryCode: {
        fontSize: heightPercentageToDP(3),
        margin: 5
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: widthPercentageToDP(80)
    },
    header: {
        width: widthPercentageToDP(80),
        padding: 10
    },
    heading: {
        fontSize: heightPercentageToDP(4),
        fontWeight: 'bold',
        textAlign: 'center'
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
        borderBottomColor: '#3366FF',
        color: 'black',
        fontSize: heightPercentageToDP(2)
    },

    underlineStyleHighLighted: {
        borderColor: "#3366FF",
        color: 'black'
    },

})


