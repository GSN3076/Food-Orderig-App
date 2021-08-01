import { useNavigation } from '@react-navigation/core'
import { Calendar, Divider, Layout } from '@ui-kitten/components'
import React, { useState } from 'react'
import { View, Text, Image, ScrollView, FlatList } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import Header from '../../../components/Header'
import HeadingText from '../../../components/HeadingText'
import moment from "moment"
import LottieView from "lottie-react-native"
import { formatCurrency } from '../../../components/utils/utils'

export default function SubscriptionDetails(props) {

    const subscribeItem = props.route.params.item
    console.log(subscribeItem.plan.description)

    // const [isExpired, setisExpired] = useState();
    const navigation = useNavigation()

    const now = new Date();
    const start = new Date(moment(subscribeItem.created_at));
    const end = new Date(moment(subscribeItem.created_at).get("year"), moment(subscribeItem.created_at).get("month"), moment(subscribeItem.created_at).get("date") + subscribeItem.plan.duration);

    const isExpired = !moment().isBetween(start, end)


    return (
        <Layout style={{ backgroundColor: 'white' }}>
            <Header title={subscribeItem.name} onPress={() => navigation.goBack()} />
            <ScrollView style={{ paddingBottom: 200 }}>
                <View style={{ overflow: 'hidden' }}>
                    <Image source={{ uri: `${subscribeItem.plan.image.url}` }} style={{ height: heightPercentageToDP(20), }} />
                    <LinearGradient style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, padding: 20, justifyContent: 'flex-end' }} colors={["transparent", "rgba(0,0,0,.5)"]}>
                        <Text style={{ color: 'white', fontSize: 20, fontFamily: "Poppins-Bold" }}>{subscribeItem.name}</Text>
                        <Text style={{ color: 'white', fontSize: 12, }}>{subscribeItem.plan.description}</Text>
                    </LinearGradient>
                </View>
                    <View style={{ backgroundColor: 'white', marginTop: heightPercentageToDP(2), marginBottom: 100 }}> 
                        <View style={{ padding: 20, marginVertical: 5,flexDirection:'row',alignItems:'center',justifyContent:'space-between' }}>
                        <View >
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15 }}>Subscribed on</Text>
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 25 ,color:'green'}}>{moment(subscribeItem.created_at).format("DD MMM YYYY")}</Text>
                        </View>
                        <View >
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15 }}>Expiration Date</Text>
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 25 ,color:'red'}}>{moment(subscribeItem.created_at).add(subscribeItem.plan.duration, "day").format("DD MMM YYYY")}</Text>
                        </View>
                        </View>
                        <Divider style={{marginVertical:10}} />
                        <View  style={{paddingHorizontal:20,marginVertical:10}}>
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15 }}>Meals</Text>
                            <FlatList 
                                data={subscribeItem.products}
                                renderItem={({item,index}) =>{
                                    return (
                                        <View style={{flexDirection:'row',marginVertical:5}}>
                                                <Image source={{uri: `${!item.images  || item.images.length == 0 ? "" : item.images[0].url}`}}  style={{height:50,width:50,borderRadius:10,backgroundColor:"#ececec"}} />
                                            <View style={{margin: 5}}>
                                                <Text style={{fontFamily:'Poppins-Bold',}}>{item.name}</Text>
                                                <Text style={{fontFamily:'Poppins-Bold',}}>{formatCurrency(item.price)}</Text>
                                            </View>                                                
                                        </View>
                                    )
                                }} 
                            /> 
                        </View>
                        <View style={{paddingHorizontal: 20, marginVertical: 5}}>
                             <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20 }}>{subscribeItem.mealsPerDay} {subscribeItem.plan.subscriptionType === "month" ? "Meals/Day" :"Meals" }</Text>
                        </View>
                        <View style={{ paddingHorizontal: 20, marginVertical: 5,alignItems:'flex-end' }}>
                               <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15 }}>Amount Paid</Text>
                             <Text style={{ fontWeight:"bold", fontSize: 25 }}>{formatCurrency(subscribeItem.totalAmount)}</Text>
                        </View>
                    <Divider style={{marginVertical:10}} />
                        {isExpired ? 
                      <View style={{flex:1,marginVertical:20}}>
                        <View style={{height:heightPercentageToDP(20),width:widthPercentageToDP(100),justifyContent:'center',alignItems:"center"}}>
                                <Text style={{fontFamily:'Poppins-Bold',fontSize:30}}>Your Subscription is Expired</Text>
                                <LottieView source={require("../../../components/Expire.json")} autoPlay loop={false} style={{height:heightPercentageToDP(20),width:widthPercentageToDP(100)}} />
                        </View>
                    </View>
                    :  <View style={{ padding: 20, marginVertical: 5 }}>
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, marginVertical: 5 }}>Meal Calendar</Text>
                            <Calendar
                                max={end}
                                min={start}
                                style={{alignSelf:'center'}}
                            />
                        </View>}
                    </View>
            </ScrollView>
        </Layout>
    )
}
