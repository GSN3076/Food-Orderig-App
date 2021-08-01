import { Button, Icon } from '@ui-kitten/components';
import React, { Component } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import LottieView from "lottie-react-native"
import { useDispatch, useSelector } from 'react-redux';
import { API_URL } from '../config/config';
import { removeFromWishlist } from '../reduxStore/actions';


export default function FavouriteList(props) {

  const wishlistData = useSelector((state) => state.wishlistReducer);
    const dispatch = useDispatch()


    const removeToWishlistHandle = (item) => {
            dispatch(removeFromWishlist(item.id));
            return ToastAndroid.show("Product removed from wishlist !", 2000);
    };


  const renderItem = ({ item, index }) => {
    return (<TouchableOpacity onPress={() => props.navigation.navigate('ProductDetail', { item, item })} style={{ height: heightPercentageToDP(15), width: widthPercentageToDP(100), margin: 10, flexDirection: 'row', alignItems: 'center', }} >
      <View style={{ margin: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',flex:1 }} >
        <View style={{ flexDirection: 'row',  }}>
          <View style={{}} >
          {  item.thumbImage.length == 0 ? <Image source={require("../../assets/images/placeholder.jpg")} style={{ width: widthPercentageToDP(20), height: widthPercentageToDP(20), borderRadius: 10 }} />:<Image source={{ uri: `${item.thumbImage[0].url}` }} style={{ width: widthPercentageToDP(20), height: widthPercentageToDP(20), borderRadius: 10 }} />}
          </View>
          <View>
            <Text style={{ fontSize: heightPercentageToDP(1.8), marginHorizontal: 5, }} numberOfLines={2}>{item.name}</Text>
            <Text style={{ fontSize: heightPercentageToDP(1.6), marginHorizontal: 5 }} numberOfLines={2}>{item.vendor.name}</Text>
            <Text style={{ fontSize: heightPercentageToDP(1.6), margin: 5 }} numberOfLines={2}>₹{item.price}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => removeToWishlistHandle(item)}  >
          <Icon name="trash-outline" fill="red" style={{ width: 20, height: 20,marginRight:20 }} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>)
  }


  return (
    <View style={{ flex: 1 }} >
      {wishlistData.length == 0 ?
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} >
          <LottieView
            source={require("../../assets/empty.json")}
            autoSize
            autoPlay
            style={{ width: widthPercentageToDP(50) }}
          />
        </View>
        : <FlatList
          data={wishlistData}
          renderItem={renderItem}
          extraData={wishlistData}
        />}
    </View>
  );
}
