import { Button, Icon } from '@ui-kitten/components';
import React, { Component } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import LottieView from "lottie-react-native"
import { useDispatch, useSelector } from 'react-redux';
import { API_URL } from '../config/config';
import { removeAllFromCart, removeFromCart} from '../reduxStore/actions';
import { calculateTotalPrice } from './utils/shopUtils';
import cartReducer from '../reduxStore/cartReducer';


export default function CheckoutList(props) {

    const catrtListData = useSelector((state) => state.cartReducer);
    const dispatch = useDispatch()

    const removeFromCartHandler = (index) => {
            dispatch(removeFromCart(index));            
            return ToastAndroid.show("Product removed from wishlist !", 2000);
    };

  const renderItem = ({ item, index }) => {
    return (<TouchableOpacity key={`${index}${item.id}`}  style={{  width: widthPercentageToDP(100), margin: 10, flexDirection: 'row', alignItems: 'center', borderBottomColor:'#ececec',borderBottomWidth:.6}} >
      <View style={{ margin: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',flex:1 }} >
        <View style={{ flexDirection: 'row', }}>
          <View style={{}} >
          {  item.thumbImage.length == 0 ? <Image source={require("../../assets/images/placeholder.jpg")} style={{ width: widthPercentageToDP(10), height: widthPercentageToDP(10), borderRadius: 3 }} />:<Image source={{ uri: `${item.thumbImage[0].url}` }} style={{ width: widthPercentageToDP(10), height: widthPercentageToDP(10), borderRadius: 3 }} />}
          </View>
          <View>
            <Text style={{ fontSize: heightPercentageToDP(1.5), marginHorizontal: 5,width:widthPercentageToDP(40),fontFamily:'Poppins-SemiBold' }} numberOfLines={2}>{item.name}</Text>
              {/* <Text style={{ fontSize: heightPercentageToDP(1.6), marginHorizontal: 5 }} numberOfLines={2}></Text> */}
            <Text style={{ fontSize: heightPercentageToDP(1.2), marginHorizontal: 5 ,color:'black',fontFamily:'Poppins-SemiBold'}} numberOfLines={2}>{item.discount  ?  <Text><Text style={{textDecorationLine:'line-through'}}>₹{item.price} </Text> ₹{(item.price - (item.price * item.discount)/100)}  ({item.discount}% Discount)</Text> : "₹"+(item.price) }  </Text>
          </View>
        </View>
        <View>
          <Text style={{marginRight:heightPercentageToDP(4),fontSize:heightPercentageToDP(2),fontFamily:'Poppins-SemiBold'}}>₹{(item.price - (item.price * item.discount)/100) * item.cartQuantity}</Text>
            {!item.discount ? <Text style={{marginRight:heightPercentageToDP(4),fontSize:heightPercentageToDP(1.3),fontFamily:'Poppins-SemiBold'}}>{item.cartQuantity} X ₹{item.price}</Text>:
          <Text style={{marginRight:heightPercentageToDP(4),fontSize:heightPercentageToDP(1.3),fontFamily:'Poppins-SemiBold'}}>{item.cartQuantity} X ₹{(item.price - (item.price * item.discount)/100)}</Text>}
        </View>
              </View>
    </TouchableOpacity>)
  }

  return (
    <View style={{ flex: 1 }} >

      {catrtListData.length == 0 ?
        <View style={{ justifyContent: 'center', alignItems: 'center',  }} >
          <LottieView
            source={require("../../assets/empty.json")}
            autoSize
            autoPlay
            style={{ width: widthPercentageToDP(50) }}
          />
        </View>
        : <FlatList
          style={{marginBottom:heightPercentageToDP(10)}}
          data={catrtListData}
          renderItem={renderItem}
          extraData={catrtListData}
        />}
       
    </View>
  );
}
