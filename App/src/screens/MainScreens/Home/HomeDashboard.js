import { Divider, Icon, Layout } from '@ui-kitten/components';
import React, { Component, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import ProductList from '../../../components/ProductList';
import ProductDetail from './ProductDetail';
import firestore from "@react-native-firebase/firestore"
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Banner from '../../../components/Banner';
import VendorList from '../../../components/VendorList';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { API_URL } from '../../../config/config';
import PlanList from '../../../components/PlanList';
import HeadingText from '../../../components/HeadingText';
import Categories from '../../../components/Categories';
import { ApolloClient, gql, InMemoryCache, useQuery } from '@apollo/client';
import Loader from '../../../components/Loader';
import moment from "moment"
import Carousel from 'react-native-snap-carousel';

export default function HomeDashboard(props) {
        const userReducer = useSelector(state => state.userReducer)
        const catrtListData = useSelector((state) => state.cartReducer);
        const wishlistData = useSelector((state) => state.wishlistReducer); 
        const [loading, setloading] = useState(true);
        const { user } = userReducer 
        const [openTime, setopenTime] = useState('');
        const [closeTime, setcloseTime] = useState("");
        const [isBetween, setisBetween] = useState();
        const [timeSlot, settimeSlot] = useState([]);
    
        useEffect(() =>{
            getTimeSlot();
        },[]);

        const client = new ApolloClient({
            uri: `${API_URL}/graphql`,
            cache: new InMemoryCache(),
            headers:{
                "Authorization":`Bearer ${user.token}`,
            },
        });
  
        const getTimeSlot = async () =>{
        const GET_TIMESLOT = gql`
            query{
            timeslot{
                TimeSlot{
                        start
                        end
                        title
                }                
            }
        }`
  
        const res = await client.query({query:GET_TIMESLOT});
    
        if(!res.error){
                settimeSlot(res.data.timeslot.TimeSlot)
                        setloading(false);
                console.log(timeSlot[0].title);
            }
        };

        // useEffect(() =>{
            // var format = 'hh:mm:ss'
            // setTimeout(() =>{
                // setisBetween(moment(moment(),format).isBetween(moment(openTime,format),moment(closeTime,format)));
                // console.log("Time Slot.........",moment(moment(),format).isBetween(moment(openTime,format),moment(closeTime,format)));
            // },1000);
        // },[isBetween,loading])

    return loading ? <Loader /> : (
        <Layout style={{ flex: 1, }}>
            <ScrollView>
                <View style={styles.header}>
                    <View style={{ margin: 4, flexDirection: 'row', alignItems: 'center' }} >
                        <Image source={require("../../../../assets/images/logo.png")} style={{width:widthPercentageToDP(15),height:heightPercentageToDP(5),resizeMode:'contain'}} />
                        <View>
                            <Text style={{fontFamily:'Poppins-Bold'}}>Food Order</Text>
                            <Text style={{fontSize:10}}>Delivering Health To Your Doorsteps</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', }} >
                        <TouchableOpacity onPress={() => props.navigation.navigate("Cart")} >
                        </TouchableOpacity>
                    </View>
                </View>
               
               <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',backgroundColor:'white',marginBottom:10}}>
                    <Carousel
                        autoplay
                        autoplayInterval={4000}
                        itemHeight={heightPercentageToDP(10)}
                        sliderHeight={heightPercentageToDP(10)}
                        sliderWidth={widthPercentageToDP(100)}
                        contentContainerStyle={{backgroundColor:"white"}}
                        loop
                        itemWidth={widthPercentageToDP(100)}
                        pagingEnabled
                        data={timeSlot}
                        renderItem={({item,index}) => {
                            return item ?  (
                                <View style={{padding:heightPercentageToDP(1.4),backgroundColor:'gold',opacity:5,alignSelf:'center',borderRadius:10,marginVertical:6,width:widthPercentageToDP(95),height:heightPercentageToDP(10),elevation:2}}>
                                    {item.title == "Takeaway" ? <Text style={{fontSize:heightPercentageToDP(2.1),fontFamily:'Poppins-Bold',color:'black'}}>Order anytime for takeaway {"\n"}store timing</Text> : <Text style={{fontSize:heightPercentageToDP(2.1),fontFamily:'Poppins-Bold',color:'black'}}>Order by {item.title == "Lunch" ? "12" : "6" } pm today and get it Deliver by</Text>}
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Text style={{fontFamily:'Poppins-Bold',color:'black',fontSize:10}}>{moment(item.start,"h:mm a").format("h:mm a")} - </Text>
                                        <Text style={{fontFamily:'Poppins-Bold',color:'black',fontSize:10}}> {moment(item.end,"h:mm a").format("h:mm a")}</Text>
                                    </View>
                                </View>
                            ): null
                        }}
                    />
               </View>
                    <Banner />
                    <PlanList />
                    <Divider style={{marginVertical:20}} />
                    <View>
                        <Categories navigation={props.navigation} />
                    </View>
                        <HeadingText text="Order right now" />
                    <ProductList />
                </ScrollView>
                {catrtListData.length == 0 ? null :<View style={{height:heightPercentageToDP(10),elevation:10,backgroundColor:'white',flexDirection:'row',justifyContent:"space-between",padding:10}}>
                            <View style={{}}>
                                <Text style={{fontFamily:'Poppins-SemiBold',fontSize:14}} >{catrtListData.length} Items in Cart</Text>
                                <Text style={{fontFamily:'Poppins-SemiBold',fontSize:10}} >Order Now</Text>
                            </View>
                            <View style={{}} >
                                <TouchableOpacity onPress={() => props.navigation.navigate("Checkout")} style={{backgroundColor:"gold",padding:10,borderRadius:10}}>
                                    <Text style={{}}>Order Now</Text>
                                </TouchableOpacity>
                            </View>
            </View>}
        </Layout>
    );
}


const styles = StyleSheet.create({
    header: {
        height: heightPercentageToDP(10),
        width: widthPercentageToDP(100),
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10
    }
})