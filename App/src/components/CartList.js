import { Button, Divider, Icon } from '@ui-kitten/components';
import React, { Component, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import LottieView from "lottie-react-native"
import { useDispatch, useSelector } from 'react-redux';
import { API_URL } from '../config/config';
import { decreaseQuantityCart, increaseQuantityCart, removeAllFromCart, removeFromCart } from '../reduxStore/actions';


export default function CartList(props) {

  const catrtListData = useSelector((state) => state.cartReducer);
  const dispatch = useDispatch()

  const removeFromCartHandler = (item) => {
    dispatch(removeFromCart(item.cartId));
    return ToastAndroid.show("Product removed from wishlist !", 2000);
  };


  const renderItem = ({ item, index }) => {
    return (<TouchableOpacity key={`${index}${item.id}`}  style={{ width: widthPercentageToDP(100), marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', }} >
      <View style={{ margin: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }} >
        <View style={{ flexDirection: 'row', }}>
          <View style={{}} >
            {item.thumbImage.length == 0 ? <Image source={require("../../assets/images/placeholder.jpg")} style={{ width: widthPercentageToDP(15), height: widthPercentageToDP(15), borderRadius: 5 }} /> : <Image source={{ uri: `${item.thumbImage[0].url}` }} style={{ width: widthPercentageToDP(15), height: widthPercentageToDP(15), borderRadius: 5 }} />}
          </View>
          <View style={{marginLeft:10}}>
            <Text style={{ fontSize: heightPercentageToDP(1.7), marginHorizontal: 5, width: widthPercentageToDP(40),fontFamily:'Poppins-SemiBold' }} numberOfLines={2}>{item.name}</Text>
            <View style={{flexDirection:"row"}}>
              <Icon fill="gold" style={{height:15,width:15}} name="star" />
              <Text style={{ fontSize: heightPercentageToDP(1.4), }} numberOfLines={2}>  {item.rate}</Text>
            </View>
            <Text style={{ fontSize: heightPercentageToDP(1.4), marginHorizontal: 5 }} numberOfLines={2}>₹{item.price}</Text>
          </View>
        </View>
        <Quantity
          onRemove={() =>dispatch(removeFromCart(item.cartId))}
          defaultQuantity={item.cartQuantity}
          onIncrease={() =>
            dispatch(increaseQuantityCart(item.cartId))
          }
          onDecrease={() =>
            dispatch(decreaseQuantityCart(item.cartId))
          }
        />
        <TouchableOpacity style={{margin:20}} onPress={() => removeFromCartHandler(item)}>
          <Icon name="trash-outline" fill="red" style={{width:20,height:20}} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>)
  }


  return (
    <View style={{ flex: 1 }} >
      <View style={{ position:"absolute",top:20,right:5 }} >
        <TouchableOpacity onPress={() => dispatch(removeAllFromCart())} style={{ flexDirection: 'row' }}  >
          <Text style={{ fontSize: heightPercentageToDP(2) }}>Delete all</Text>
          <Icon name="trash-outline" fill="red" style={{ width: 20, height: 20, marginLeft: 5, marginRight: 20 }} />
        </TouchableOpacity>
      </View>
      {catrtListData.length == 0 ?
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} >
          <LottieView
            source={require("../../assets/empty.json")}
            autoSize
            autoPlay
            style={{ width: widthPercentageToDP(50) }}
          />
        </View>
        : <FlatList
            style={{flex:1,marginTop:40}}
            data={catrtListData}
            renderItem={renderItem}
        />}
    </View>
  );
}

export const Quantity = ({ defaultQuantity, onIncrease, onDecrease, maxValue ,onRemove}) => {
  // const cartItem = useSelector(state => state.cartReducer);
  const [quantity, setQuantity] = useState(
    defaultQuantity 
  );

  useEffect(() =>{
    setQuantity(defaultQuantity)
  },[defaultQuantity]);

  return (
    <View>
      <View style={{ alignItems: 'center', flexDirection: "row", }} >
        {quantity == 1 ? <TouchableOpacity
          onPress={() => {
            onRemove && onRemove();
          }}>
          <Icon name="trash" fill="black" style={{ width: 20, height: 20, marginHorizontal: 10 }} />
        </TouchableOpacity> : <TouchableOpacity
          onPress={() => {
            if (quantity == 1) {
              // dispatch(removeFromCart())
              return;
            }
            setQuantity(quantity - 1);
            onDecrease && onDecrease();
          }}
        >
          <Icon name="minus-circle" fill="black" style={{ width: 20, height: 20, marginHorizontal: 10 }} />
        </TouchableOpacity>}
        <Text style={{ margin: 3, fontSize: heightPercentageToDP(2),fontFamily:'Poppins-SemiBold' }} >{quantity}</Text>
        <TouchableOpacity
          onPress={() => {
            if (quantity >= maxValue) {
              return;
            }
            setQuantity(quantity + 1);
            onIncrease && onIncrease();
          }}
        >
          <Icon name="plus-circle" fill="black" style={{ width: 20, height: 20, marginHorizontal: 10 }} />
        </TouchableOpacity>
      </View>

    </View>
  )
}
