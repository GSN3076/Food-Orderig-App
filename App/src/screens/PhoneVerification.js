import { Layout,Input, Icon, Interaction, Button, } from '@ui-kitten/components';
import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, Dimensions, ScrollView, TextInput, StyleSheet, Image, Alert, ActivityIndicator, Modal } from 'react-native';
import {heightPercentageToDP,widthPercentageToDP} from "react-native-responsive-screen"
import LinearGradient from 'react-native-linear-gradient'
import auth from "@react-native-firebase/auth"
import OTPInputView from '@twotalltotems/react-native-otp-input';
import * as Aniamtable from "react-native-animatable"
import changeNavigationBarColor from 'react-native-navigation-bar-color';

changeNavigationBarColor("#ececec",true)
export default class PhoneVerificaiton extends Component {
  constructor(props) {
    super(props);
    this.state = {
        phone:'',
        submitting:false,
        code:'',
        password:'',
        name:'',
        next:false,
        phoneError:false,
        eye:false,
        confirmation:'',
        modalVisible:false,
        otp:''
    };
  }

  handleSendOtp = async () => {
    const confirmation = await auth().signInWithPhoneNumber(`+91 ${this.state.phone}`);
    this.setState({confirmation},() =>{
        console.log(this.state.confirmation)
    }); 
    this.setState({modalVisible:true});
  }

  hadnleAnimation = () =>   {
    this.animatedTextRef1.slideInLeft()
    this.animatedTextRef2.slideInUp();
    this.animatedTextRef3.slideInRight();
    this.animatedTextRef4.slideInUp();
  }

    handleNext = () => {
        if( this.state.phone.length != 0  ){
            let regphone = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!regphone.test(this.state.phone)){
                     Alert.alert("Invalid phone Id","Please enter the correct phone id.");
                return;
            }else{
                this.phoneRef.fadeOutRight(300);
                  this.setState({next:true},() =>{
                    this.passRef.slideInUp(300);
                })
            }   
          }
    }

    handleSubmit = async () => {
        this.setState({submitting:true})
        try {
              const res = await auth.PhoneAuthProvider.credential(
                this.state.confirmation._verificationId,
                this.state.otp,
              );
              this.setState({modalVisible:false})
              if(res){
                    this.props.navigation.navigate("Signup",{phone:this.state.phone})
                }else{
                    Alert.alert("Verification code is Incorrect")
                }
         } catch (error) {
           console.log(error);
            Alert.alert("Error","Something went wrong")
           console.log('Invalid code.');
         }
         finally{
            this.setState({submitting:false})
            this.setState({modalVisible:false})
         }
    }



  render() {
    return (
      <Layout  style={{flex:1}}  >
                <View style={{justifyContent:'center',alignItems:'center',flex:1}} >
                         <ScrollView  showsHorizontalScrollIndicator={false} style={{flex:1}} horizontal pagingEnabled  >
                                    <View style={{flex:1}} >
                                        <Image source={{uri:'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=634&q=80'}} style={{flex:1,width:widthPercentageToDP(100),height:heightPercentageToDP(100),}} />
                                        <LinearGradient  style={{position:'absolute',top:0,left:0,bottom:0,right:0,justifyContent:'center',alignItems:'center'}} colors={['transparent',"black"]}  >
                                                    <Aniamtable.Text ref={ref => this.animatedTextRef1 = ref} animation="fadeInUp" style={{color:'white',fontSize:heightPercentageToDP(5),margin:20,marginBottom:0,fontFamily:"Poppins-Bold"}} >Welcome to Food Order.</Aniamtable.Text>
                                                    {/* <Aniamtable.Text ref={ref => this.animatedTextRef2 = ref} animation="fadeInLeft" style={{color:'white',fontSize:heightPercentageToDP(3),marginLeft:20}} >The last three or four reps is what makes the muscle grow.</Aniamtable.Text> */}
                                        </LinearGradient>
                                    </View>
                                </ScrollView>  
                </View> 
                <View style={{height:heightPercentageToDP(30),width:Dimensions.get("screen").width,backgroundColor:'#ececec',borderTopLeftRadius:20,borderTopRightRadius:20,justifyContent:'center',alignItems:'center',position:'absolute',bottom:0}} behavior="padding"   >
                    <Aniamtable.View animation="slideInUp" duration={300} ref={ref => this.phoneRef = ref}  style={styles.textInputContainer} >
                            <Icon
                                    style={{width:20,height:20,margin:5}}
                                    fill='#8F9BB3'
                                    name='phone-outline'
                                    animation="shake"
                                />
                            <TextInput 
                                style={styles.input}
                                keyboardType="number-pad"
                                placeholder="Phone Number"
                                onChangeText={(phone) => this.setState({phone})}
                            />
                    </Aniamtable.View> 

                    { (this.state.submitting ? <ActivityIndicator size={"small"} color={"#8F9BB3"} /> : <Button   onPress={this.handleSendOtp} style={{width:widthPercentageToDP(90),height:heightPercentageToDP(7),margin:10,backgroundColor:'gold',borderColor:'gold'}}  >
                        <Text style={{fontSize:heightPercentageToDP(2),color:'black'}} >SIGN UP </Text>
                            {/* <Icon 
                                    style={{width:20,height:20,marginTop:5}}
                                    fill='black'
                                    name='log-in-outline'
                            /> */}
                    </Button>)}
                    {!this.state.next ? <Text style={{color:'black',fontSize:heightPercentageToDP(1.8),textAlign:'center',fontFamily:'Poppins-Bold',}} onPress={() => this.props.navigation.goBack("LoginScreen")} >Already have an account? Sign In</Text> : null}
                    {this.state.next ? <Text style={{color:'#8F9BB3',fontSize:heightPercentageToDP(2),textAlign:'center'}} onPress={() => this.setState({next:false})} >Change phone</Text> : null}
                </View>
                <Modal visible={this.state.modalVisible} onRequestClose={() => this.setState({modalVisible:false})} transparent onDismiss={() => this.setState({modalVisible:false})}  >
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:"rgba(0,0,0,.6)"}}>
                        <Text style={{fontFamily:'Poppins-SemiBold',fontSize:30,color:'white',marginBottom:20}}>Please Enter Your OTP here.</Text>
                        <TextInput
                            value={this.state.otp}
                            autoFocus
                            maxLength={6}
                            placeholder="888888"
                            keyboardType="number-pad"
                            style={{backgroundColor:'white',width:widthPercentageToDP(60),padding:20,paddingHorizontal:30,borderRadius:10,margin:20,fontFamily:'Poppins-SemiBold',fontSize:20,letterSpacing:8,textAlign:'center',borderColor:"gold",borderWidth:3}}
                            onChangeText={(otp) => this.setState({otp:otp})}
                        />
                        <Button onPress={() => this.handleSubmit()}>
                               <Text>Submit</Text>
                            </Button>
                    </View>
                </Modal>
      </Layout>
    );
  }
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
        letterSpacing:widthPercentageToDP(1),
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