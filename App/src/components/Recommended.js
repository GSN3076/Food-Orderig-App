import React, { Component, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Pressable, TouchableOpacity, ToastAndroid } from 'react-native';
import firestore from "@react-native-firebase/firestore"
import { Card, Icon, List } from '@ui-kitten/components';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import CurrencyFormatter from "react-native-currency-format"
import { API_URL } from '../config/config';
import { gql, useQuery } from '@apollo/client';
import { checkProductInCart, checkProductInWishList } from './utils/shopUtils';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, addToWishlist, removeFromCart } from '../reduxStore/actions';
import Empty from './Empty';
import HeadingText from './HeadingText';

export default function Recommended(props) {

// console.log()
    const PRODUCTS_QUERY = gql`
    query{
        products(where:{
            productCategory:${props.product.productCategory.id}
        }){
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
            category
        }
        }`

    const [products, setproducts] = useState([]);

    const { data, loading } = useQuery(PRODUCTS_QUERY)
    const dispatch = useDispatch()

    const rendeList = ({ item, index }) => {
        return (<Pressable key={`${index}${item.id}`} onPress={() => { props.navigation.navigate("ProductDetail", { item: item }) }} >
            <View style={{ flexDirection: 'row' }}>
                {item.thumbImage.url && <Image source={{ uri: `${API_URL}${item.thumbImage[0].url}` }} style={{ height: 100, width: 100, margin: 20, resizeMode: 'contain' }} />}
                <View style={styles.bottomRow} >
                    <Text style={styles.title} numberOfLines={2} >{item.name}</Text>
                </View>
                <View style={[styles.bottomRow, { marginHorizontal: 5 }]} >
                    <Text style={{ fontSize: heightPercentageToDP(2) }} >₹{item.price}.00</Text>
                    <Text style={{ color: 'gold' }} ><Icon name="star" fill="gold" style={{ width: 15, height: 15 }} /> <Text style={{ fontSize: heightPercentageToDP(2) }} >{item.rate}</Text></Text>
                </View>
            </View>
        </Pressable>)
    }


    const loadMore = () => {

    }

    return loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} ><ActivityIndicator color="lightblue" size='large' /></View> : (
        <View>
            <HeadingText text="Recommended Products" />
            {data.products.length == 0 ? <Empty />  :
                <FlatList
                    numColumns={2}
                    data={data.products}
                    renderItem={({ item, index }) => <ProductCard onPress={() => props.navigation.navigate("ProductDetail",{item:item})} key={`${index}${item.id}`} removeFromCartHandler={() =>{ dispatch(removeFromCart(item.id));
                        return ToastAndroid.show("Product removed to Cart !", 2000);}} product={item} />}
                    onEndReachedThreshold={.5}
                    onEndReached={loadMore}
                    extraData={products}
                />}
        </View>
    );

}


const styles = StyleSheet.create({
    bottomRow: {
        flexDirection: 'row',
        margin: 3,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: heightPercentageToDP(2),
        fontWeight: '900',
        margin: 5,
        width: widthPercentageToDP(30)
    },
    card: {
        // height:heightPercentageToDP(30),
        width: widthPercentageToDP(45),
        // borderRadius: 10,
        overflow: 'hidden',
        margin: 10,
        borderWidth:.5,
        borderColor:'#ececec'
    },
    image: {
        height: heightPercentageToDP(25),
        width: "100%",
        // borderRadius:10,
        resizeMode: "contain",
        overflow: 'hidden'
    }
})


const ProductCard = ({ product,removeFromCartHandler,onPress }) => {

    const wishlistData = useSelector((state) => state.wishlistReducer);
    const cartData = useSelector((state) => state.cartReducer);
    const dispatch = useDispatch()
    const wishlistItem = checkProductInWishList(wishlistData, product.id);
    const cartListItem = checkProductInCart(cartData, product.id);


    const addToWishlistHandle = () => {
        // e.preventDefault();
        dispatch(addToWishlist(product));
        // ToastAndroid.();
        if (!wishlistItem) {
            return ToastAndroid.show("Product added to wishlist !", 2000);
        } else {
            return ToastAndroid.show("Product removed from wishlist !", 2000);
        }
    };


    const addToCartHandle = () => {
            let productItem = checkProductInCart(cartData, product.cartId);
            // console.log(productItem)
            if (!productItem) {
                dispatch(addToCart(product));
                return ToastAndroid.show("Product added to Cart !", 2000);
            }
    };




    return (<Pressable onPress={onPress}  >
        <View style={styles.card}>
            {product.thumbImage.length == 0 ? <Image source={require("../../assets/images/placeholder.jpg")} style={styles.image} /> : <Image source={{ uri: `${API_URL}${product.thumbImage[0].url}` }} style={styles.image} />}
            
            <View style={styles.bottomRow} >
                <Text style={styles.title} numberOfLines={2} >{product.name}</Text>
            </View>
            <View style={[styles.bottomRow, { marginHorizontal: 5 }]} >
                <Text style={{ fontSize: heightPercentageToDP(2) }} >₹{product.price}.00</Text>
                <Text style={{ color: 'gold' }} ><Icon name="star" fill="gold" style={{ width: 15, height: 15 }} /> <Text style={{ fontSize: heightPercentageToDP(2) }} >{product.rate}</Text></Text>
            </View>
            <Text style={{ fontSize: heightPercentageToDP(1.4), marginHorizontal: 5 }} numberOfLines={2} >{product.vendor.name}</Text>
            <TouchableOpacity onPress={addToCartHandle} style={{ position: 'absolute', bottom:50, right: 3, }}>
            <Icon name={!cartListItem ? "shopping-bag-outline" : "shopping-bag"} fill="grey" style={{ width: 28, height: 28 }} />
        </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={addToWishlistHandle} style={{ position: 'absolute', right: 15, top: 25, }}>
            <Icon name={!wishlistItem ? "heart-outline" : "heart"} fill="lightgreen" style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
    </Pressable>)
}