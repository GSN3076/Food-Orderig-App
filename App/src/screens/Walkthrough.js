import React, { Component, useRef } from 'react';
import { View, Text,Animated, Image, TouchableOpacity, FlatList, Dimensions, StatusBar } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
// import {  PRIMARY_COLOR, SECONDARY_COLOR,  } from '../utils/config';
const PRIMARY_COLOR = "gold"
const SECONDARY_COLOR = "black"
const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height
import Ionicons from "react-native-vector-icons/Ionicons"
import LottieView from "lottie-react-native"

const data = [
    {
        title:"Healthy food is no more booring",
        subtitle:'No More Booring.',
        image:require("../../assets/images/featured1.png"),
        color:'#f2d974'
    },
    {
        title:"Meals for all your fitness goals",
        subtitle:'Subscribe Now',
        image:require("../../assets/images/featured2.png"),
        color:'#f2d974'
    },
    {
        title:"Order your freshly prepared healthy meals",
        subtitle:`Order Right now`,
        image:require("../../assets/images/featured3.png"),
        color:'#f2d974'
    },  
]

export default function Walkthrough(props){
        const xOffset = useRef(new Animated.Value(0)).current; 
        const onScroll = Animated.event([{ nativeEvent: { contentOffset: { x: xOffset } } }]);
        return (
            <View style={{flex:1,backgroundColor:"white",}}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                <View style={{justifyContent:'center',alignItems:'center',}}>
                    <Image
                        source={require("../../assets/images/logo.png")}
                        style={{height:heightPercentageToDP(14),width:widthPercentageToDP(80),resizeMode:'contain'}}
                    />
                    <Text style={{fontFamily:'Poppins-Bold',fontSize:20,}}>Welcome!</Text>
                </View>
                
                        <FlatList 
                            pagingEnabled
                            horizontal
                            data={data.reverse()}
                            onScroll={onScroll}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item,index}) =>{
                            return (<Animated.View key={`${index}anim`} style={{flex:1,
                                          justifyContent:'center',
                                          alignItems:'center',
                                          flexDirection:'column',
                                          width:widthPercentageToDP(100)
                                      }}>
                                        <Animated.View 
                                        style={{
                                        opacity:xOffset.interpolate({
                                        inputRange:[
                                          (index - 1) * WIDTH, 
                                          index * WIDTH, 
                                          (index + 1) * WIDTH
                                        ],
                                        outputRange: [0, 1, 0],
                                        extrapolate:'clamp',
                                      }),}}>
                                            <Animated.Image source={item.image} style={{height:heightPercentageToDP(30),width:WIDTH,resizeMode:'contain',}} />
                                        </Animated.View>
                                   <Animated.Text style={{color:"black",fontSize:widthPercentageToDP(6),fontFamily:'Poppins-Bold',
                                            textAlign:"center",
                                            opacity:xOffset.interpolate({
                                            inputRange: [
                                                (index - 1) * WIDTH, 
                                                index * WIDTH, 
                                                (index + 1) * WIDTH
                                                ],
                                                outputRange: [0, 1, 0],
                                                extrapolate:'clamp',
                                            }),
                                            transform:[
                                                {
                                                    translateY:xOffset.interpolate({
                                                    inputRange: [
                                                        (index - 1) * WIDTH, 
                                                        index * WIDTH, 
                                                        (index + 1) * WIDTH
                                                        ],
                                                        outputRange: [0, 1, 0],
                                                        extrapolate:'clamp',
                                                    })
                                                }
                                                ]
                                            }}>
                                          {item.title}
                                        </Animated.Text>

                                        <Animated.Text style={{color:"black",fontSize:widthPercentageToDP(5),fontFamily:'Poppins-SemiBold',
                                            textAlign:"center",
                                            opacity:xOffset.interpolate({
                                            inputRange: [
                                                (index - 1) * WIDTH, 
                                                index * WIDTH, 
                                                (index + 1) * WIDTH
                                                ],
                                                outputRange: [0, 1, 0],
                                                extrapolate:'clamp',
                                            }),
                                            transform:[
                                                {
                                                    translateY:xOffset.interpolate({
                                                    inputRange: [
                                                        (index - 1) * WIDTH, 
                                                        index * WIDTH, 
                                                        (index + 1) * WIDTH
                                                        ],
                                                        outputRange: [0, 1, 0],
                                                        extrapolate:'clamp',
                                                    })
                                                }
                                                ]
                                            }}>
                                          {item.subtitle}
                                        </Animated.Text>
                                    </Animated.View>
                                )
                        }}
                    />
                                            {/* <Image style={{position:'absolute',top:heightPercentageToDP(4),left:widthPercentageToDP(5),width:widthPercentageToDP(50),height:heightPercentageToDP(8),resizeMode:'contain'}} source={require("../../assets/images/logo.png")} /> */}
                                               <View style={{justifyContent:'center',alignItems:'center',marginBottom:50}}>
                                               <View style={{flexDirection:'row',justifyContent:"flex-start",alignItems:'center'}}>
                                            {data.map((item,index) =>{
                                                return <Animated.View key={`item${index}`} style={{height:10,
                                                    width:xOffset.interpolate({
                                                        inputRange: [
                                                            (index - 1) * WIDTH, 
                                                            index * WIDTH, 
                                                            (index + 1) * WIDTH
                                                          ],
                                                          outputRange: [10, 20, 10],
                                                    }),
                                                    opacity:xOffset.interpolate({
                                                        inputRange: [
                                                          (index - 1) * WIDTH, 
                                                          index * WIDTH, 
                                                          (index + 1) * WIDTH
                                                        ],
                                                        outputRange: [0.5, 1, 0.5],
                                                        extrapolate:'clamp',
                                                      }),
                                                    borderRadius:10,backgroundColor:SECONDARY_COLOR,margin:10}} />
                                            })}
                                        </View>
                                        
                                               <TouchableOpacity  onPress={() => props.navigation.navigate("Login")} style={{height:heightPercentageToDP(8),width:heightPercentageToDP(18),borderRadius:heightPercentageToDP(10),backgroundColor:PRIMARY_COLOR,justifyContent:'center',alignItems:'center',}} >
                                                    <Ionicons size={heightPercentageToDP(3)} color={"black"} name="md-arrow-forward"  />
                                                </TouchableOpacity>
                                               </View>
                                                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginBottom:10}}>
                                                <Text style={{fontFamily:'Poppins-SemiBold',textAlign:'center',marginTop:5,color:'grey'}}>Powered by</Text>
                                                    <Image source={require("../../assets/images/logo-dark.png")}  style={{width:80,height:70,resizeMode:'contain'}}/>
                                                </View>
                            </View>
        )
}