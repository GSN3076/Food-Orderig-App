import { gql, useQuery } from '@apollo/client'
import { Layout } from '@ui-kitten/components'
import React from 'react'
import { View, Text, FlatList, Image } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { useSelector } from 'react-redux'
import Header from '../../../components/Header'
import Empty from '../../../components/Empty'
import Loader from '../../../components/Loader'
import { formatCurrency } from '../../../components/utils/utils'
import { API_URL } from '../../../config/config'
import moment from "moment"

export default function Orders(props) {
    const userReducer = useSelector(state => state.userReducer)
    const {user} = userReducer 

    const GET_ORDER_QUERY = gql`
    query getInitalData{
      orders(
        sort:"created_at:desc"
        where:{
          user:${user.id}
          status:"paid"
        }){
              id	
              total
              created_at
              status
              order_status
                 products{
                  name
                  id
                  rate
                  quantity
                  price
                  new
                  brand
                  code
                  discount
                  thumbImage{
                    url
                  }
                  images{
                    url
                  }
              }
        }
    }
    `
    const { data, error,loading } = useQuery(GET_ORDER_QUERY)

    const renderList = ({item,index}) =>{
        
        return (
            <View style={{flexDirection:'row',margin: widthPercentageToDP(4),alignItems:'center',justifyContent:'space-between'}} >
                    <View style={{flexDirection:'row'}}>
                        <View style={{}} >
                            <Text style={{fontSize:heightPercentageToDP(2),margin:5,}}>#Order ID {item.id}</Text>
                            {
                                            item.products.length >= 1 ? 
                                    <Image style={{width:heightPercentageToDP(10),height:heightPercentageToDP(10),borderRadius:4}} source={{uri:`${item.products[0].images[0].url}`}}  />
                                            :
                                        <Image style={{width:heightPercentageToDP(10),height:heightPercentageToDP(10),borderRadius:4}} source={require("../../../../assets/images/placeholder.jpg")}  />
                            }
                        </View>
                        <View style={{margin:5,marginTop:heightPercentageToDP(4)}}>
                            {item.products.length >= 1 ? <Text style={{fontSize:heightPercentageToDP(2),width:widthPercentageToDP(40),fontFamily:'Poppins-SemiBold'}}>{item.products[0].name}</Text> : null}
                            {item.products.length >= 1 ? <Text>{item.products.length} Items </Text> : null}
                            <Text style={{fontSize:heightPercentageToDP(2),}}>{formatCurrency(item.total,true)}</Text>
                        </View>
                    </View>
                    <Text style={{color:'grey',position:'absolute',right: 0,top:10}}>{moment(item.created_at).format("DD MMM YYYY")}</Text>
                    <View style={{margin:5}}>
                        <Text style={{color:"black",textTransform:"uppercase",backgroundColor:'gold',paddingHorizontal:8,borderRadius:10,paddingTop:2}} >{item.order_status}</Text>
                    </View>
            </View>
        )
    }

    return loading ? <Loader />:(
        <Layout style={{flex:1}}>
                <Header title={"My Orders"} onPress={() => props.navigation.goBack()} />
                {data.orders.length == 0 ? <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Empty />
                    </View> :<FlatList
                    showsVerticalScrollIndicator={false}                    
                    data={data.orders}
                    renderItem={renderList}
                />}
        </Layout>
    )
}
