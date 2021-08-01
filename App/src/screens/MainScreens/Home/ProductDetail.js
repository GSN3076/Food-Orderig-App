import { Divider, Icon, Layout } from '@ui-kitten/components';
import React, { Component } from 'react';
import { View, Text, FlatList, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import FloatingButton from '../../../components/FloatingButton';
import Header from '../../../components/Header';
import firestore from "@react-native-firebase/firestore"
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, addToWishlist } from '../../../reduxStore/actions';
import { API_URL } from '../../../config/config';
import { gql, useQuery } from '@apollo/client';
import Loader from '../../../components/Loader';
import { checkProductInCart, checkProductInWishList } from '../../../components/utils/shopUtils';
import Review from '../../../components/Review';
import Recommended from '../../../components/Recommended';

export default function ProductDetail (props) {
  
    const PRODUCT_QUERY = gql`
        query  {
  product(id:${props.route.params.item.id}){
    name
    quantity
    price
    description
    specification
    vendor{
      name
    }
    id
    thumbImage{
      url
    }
    images{
      url
    }
    rate
    brand
    category
    productCategory{
      id
      image{
        url
      }
      category
    }
  }
}`

    
    const { data, loading } = useQuery(PRODUCT_QUERY)


    const cartlistData = useSelector(state => state.cartReducer);
    const wishlistData = useSelector(state=> state.wishlistReducer);
    const dispatch = useDispatch()
    const wishlistItem = checkProductInWishList(wishlistData,props.route.params.item.id)
    const cartsItem = checkProductInCart(cartlistData,props.route.params.item.id)
    
    const addFavourites = () =>{
         dispatch(addToWishlist(data.product))   
    }
    const addToCartHandler = () =>{
          cartsItem ? props.navigation.navigate("Checkout",{item:data.product}) : dispatch(addToCart(data.product))   
   }

    // const {name,images,vendorName,ratings,description,specification,price,discount,tax}  = data.product;

    return loading ? <Loader />:  (
            <Layout style={{flex:1}}>
                <Header title={data.product.name} />
                <ScrollView style={{flex:1,marginBottom:heightPercentageToDP(10)}} >
                        {/* <Header title={name} /> */}
                        <FlatList 
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled
                            renderItem={({item,index}) =>{
                                return <Image source={{uri:`${item.url}`}} style={{flex:1,width:widthPercentageToDP(100),height:heightPercentageToDP(50),resizeMode:'contain'}}  />
                            }}
                            data={data.product.images}
                            horizontal
                        />
                        <View style={{height:heightPercentageToDP(5),marginTop:20,margin:10}} >
                        <FlatList 
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled
                            renderItem={({item,index}) =>{
                                return <Image source={{uri:`${item.url}`}} style={{width:widthPercentageToDP(10),height:heightPercentageToDP(5),resizeMode:'cover',borderWidth:.5,borderColor:'#ececec',margin:3,borderRadius:5}}  />
                            }}
                            data={data.product.images}
                            horizontal
                        />
                        </View>
                        <View style={{flex:1,margin:10 }} >
                                        <View style={{borderTopColor:'#ececec',borderTopWidth:.6,marginTop:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}} >
                                                <View>
                                                    <Text style={{fontSize:heightPercentageToDP(2),margin:10}} >{data.product.name}</Text>
                                                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}} >
                                                            <Text style={{fontSize:heightPercentageToDP(3),margin:10}} >₹{data.product.price} <Text style={{fontSize:heightPercentageToDP(2),color:'#3366FF'}} >{data.product.discount}% Discount </Text></Text>
                                                        </View>
                                                </View>
                                                <TouchableOpacity  onPress={addFavourites} style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}} >
                                            <Icon name={wishlistItem ? "heart":"heart-outline" }  fill={"#3366FF"} style={{height:30,width:30,margin:5}}  />
                                        </TouchableOpacity>
                                        
                                        </View>
                                        <View style={{borderTopColor:'#ececec',borderTopWidth:.6,marginTop:10,}} >
                                            <Text style={{fontSize:heightPercentageToDP(3),margin:10}} >Description</Text>
                                            <Text style={{fontSize:heightPercentageToDP(2),margin:10,}} >{data.product.description}</Text>
                                            
                                        </View>
                                        <View style={{borderTopColor:'#ececec',borderTopWidth:.6,marginTop:10,}} >
                                            <Text style={{fontSize:heightPercentageToDP(3),margin:10}} >Specification</Text>
                                            <Text style={{fontSize:heightPercentageToDP(2),margin:10}} >{data.product.specification}</Text>
                                        </View>
                        </View>
                          <Divider style={{marginVertical:heightPercentageToDP(2)}} />
                            <Review product={data.product} />
                            <Divider style={{marginVertical:heightPercentageToDP(2)}} />
                          {data.product.productCategory ? <Recommended navigation={props.navigation} product={data.product} />:null}
                </ScrollView> 
                <FloatingButton title={cartsItem ? "Go To Checkout":"Add to bag"} icon="shopping-bag-outline" onPress={addToCartHandler}  />
            </Layout>
        );
  }


