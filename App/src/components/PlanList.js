import { gql, useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, Text, FlatList, Pressable, Image } from 'react-native'
import { API_URL } from '../config/config'
import Loader from './Loader'

export default function PlanList(props) {
    const navigation = useNavigation()
    
    const GET_PLANS = gql`
    query getPlans{
        plans{
                id
                name
                description
                duration
                mealsPerDay
                discount
                subscriptionType
                image{
                    url
                }
                products{
                    name
                    id
                    quantity
                    price
                    vendor{
                        name
                    }
                    thumbImage{
                        url
                    }
                    images{
                        url
                    }
                        rate
                        brand
                    }
            }
        }`   
    const {data,loading,error} = useQuery(GET_PLANS)
    
    return loading ? <Loader />:(
        <View>
            <Text style={{fontFamily:'Poppins-Bold',margin:20,marginBottom:0,fontSize:20}}>Subscribe to our Customize Plan.</Text>
                <View>
                    <FlatList 
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={data.plans}
                        renderItem={({item,index}) => renderItem(item,index,navigation)}
                    />
                </View>
        </View>
    )
}


const renderItem = (item,index,navigation) =>{
    
    return(<Pressable onPress={() => navigation.navigate("PlanDetails",{item:item})}>
                <View style={{margin:10,overflow: 'hidden',}}>
                    <Image source={{uri:`${item.image.url}`}}  style={{width:250,height:140,flex:1,borderRadius:10,}} />
                    <Text style={{fontSize:16,marginTop:5,marginBottom:0,fontFamily:'Poppins-Bold'}}>{item.name}</Text>
                    <Text style={{fontSize:12,width:200}}>{item.description}</Text>
                </View>
        </Pressable>)
}
