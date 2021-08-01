import { gql, useQuery } from '@apollo/client'
import { Layout } from '@ui-kitten/components'
import React, { useState } from 'react'
import { View, Text, FlatList, Image, Pressable, TouchableOpacity } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { useSelector } from 'react-redux'
import Header from '../../../components/Header'
import Loader from '../../../components/Loader'
import { formatCurrency } from '../../../components/utils/utils'
import { API_URL } from '../../../config/config'
import moment from "moment"
import Empty from '../../../components/Empty'
import { useNavigation } from '@react-navigation/core'

export default function Subscriptions(props) {
    const userReducer = useSelector(state => state.userReducer)
    const {user} = userReducer 

    const GET_ORDER_QUERY = gql`
    query getSubscriptions {
    subscriptions(where:{
        user:${user.id}
        status:"PAID"
    }
    sort:"created_at:desc"
    ){
        id
    	mealsPerDay
        created_at
    	status
    	totalAmount
    	products{
            name
            id
            price
            images{
                url
            }
        }
    	plan{
         description  
         subscriptionType
         duration
            image{
                url
            }
         }
        shipping_address{
            id
        }
      name
    }
}
    `
    const { data, error,loading } = useQuery(GET_ORDER_QUERY)
    console.log(data)
    var inThirtyDays = moment().add('days', 30);
    console.log(moment(inThirtyDays).format("DD/MMM/YYYY"))

    return loading ? <Loader />:(
        <Layout style={{flex:1}}>
                <Header title={"Subscriptions"} onPress={() => props.navigation.goBack()} />
               {data.subscriptions.length ==0 ? <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                   <Empty />
               </View> : <FlatList
                    data={data.subscriptions}
                    renderItem={({item,index}) => <SubscriptionCard item={item} index={index} /> }
                />}
        </Layout>
    )
}



const SubscriptionCard = ({item,index}) =>{
    const [visible, setvisible] = useState(false);
    const navigation = useNavigation()

    return (
        <TouchableOpacity  onPress={() => navigation.navigate("SubscriptionDetails",{item:item})}>
        <View style={{flexDirection:'row',margin: widthPercentageToDP(4),alignItems:'center',justifyContent:'space-between'}} >
                <View style={{flexDirection:'row'}}>
                        <View style={{}} >
                        <Text style={{fontSize:12,margin:5,}}>#Subscription ID {item.id}</Text>
                            {
                                    item.plan  
                                     ? 
                                    <Image style={{width:heightPercentageToDP(10),height:heightPercentageToDP(10),borderRadius:4}} source={{uri:`${item.plan.image.url}`}}  />
                                        :
                                    <Image style={{width:heightPercentageToDP(10),height:heightPercentageToDP(10),borderRadius:4}} source={require("../../../../assets/images/placeholder.jpg")}  />
                            }
                        </View>
                    <View style={{margin:5,marginTop:heightPercentageToDP(4)}}>
                        {item.products.length >= 1 ? <Text style={{fontSize:heightPercentageToDP(2),fontFamily:"Poppins-SemiBold"}}>{item.name}</Text> : null}
                        {item.products.length >= 1 ? <Text>{item.products.length} Items </Text> : null}
                        <Text style={{fontSize:heightPercentageToDP(2),}}>{formatCurrency(item.totalAmount,true)}</Text>
                    </View>
                </View>
        </View>

                            <View style={{marginHorizontal: 20,}}>
                            <Text style={{color:'black'}}>{item.plan.description}</Text>
                            <View style={{flexDirection:'row',justifyContent:'space-between',}}>
                                <Text style={{color:'grey',}}>Subscribed on <Text style={{fontFamily:'Poppins-SemiBold'}}>{moment(item.created_at).format("DD MMMM YYYY")}</Text> </Text>
                                <Text style={{color:'black',backgroundColor:'gold',borderRadius:10,paddingHorizontal:8}}>Last Date <Text style={{fontFamily:'Poppins-SemiBold'}}>{moment(moment(item.created_at).add('days',item.plan.duration)).format("DD MMM YYYY")}</Text> </Text>
                            </View>
                                </View>

        </TouchableOpacity>
    )
}
