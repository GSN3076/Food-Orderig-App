import React, { Component, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Pressable, TouchableOpacity, ToastAndroid } from 'react-native';
import firestore from "@react-native-firebase/firestore"
import { Card, Icon, List } from '@ui-kitten/components';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import CurrencyFormatter from "react-native-currency-format"
import { API_URL } from '../config/config';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { checkProductInCart, checkProductInWishList } from './utils/shopUtils';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, addToWishlist, decreaseQuantityCart, increaseQuantityCart, removeFromCart } from '../reduxStore/actions';
import Empty from './Empty';
import HeadingText from './HeadingText';
import LinearGradient from 'react-native-linear-gradient';
import { Quantity } from './CartList';

export default function CategoryProductList(props) {
    
    const PRODUCTS_QUERY = gql`
    query{
        products(
            where:{
                productCategory:${props.category.id}
            }
        ){
            type
            name
            id
            quantity
            price
            description
            specification
            productCategory{
                category
            }
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
    }`

    const [type, settype] = useState("All");

    const [products, setproducts] = useState([]);

    const { loading, data } = useQuery(PRODUCTS_QUERY)
    const dispatch = useDispatch()

    const rendeList = ({ item, index }) => {
        return (<Pressable key={`${index}${item.id}`} onPress={() => { props.navigation.navigate("ProductDetail", { item: item }) }} >
            <View style={{ flexDirection: 'row' }}>
                {item.thumbImage.url && <Image source={{ uri: `${item.thumbImage[0].url}` }} style={{ height: 100, width: 100, margin: 20, resizeMode: 'contain' }} />}
                <View style={styles.bottomRow} >
                    <Text style={styles.title} numberOfLines={2} >{item.name}   </Text>
                </View>
                <View style={[styles.bottomRow, { marginHorizontal: 5 }]} >
                    <Text style={{ fontSize: heightPercentageToDP(2) }} >₹{item.price}.00</Text>
                    <Text style={{ color: 'gold' }} ><Icon name="star" fill="gold" style={{ width: 15, height: 15 }} /> <Text style={{ fontSize: heightPercentageToDP(2) }} >{item.rate}</Text></Text>
                </View>
            </View>
        </Pressable>)
    }



    return loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} ><ActivityIndicator color="lightblue" size='large' /></View> : (
        <View  >
            <View  style={{flexDirection:'row',marginVertical:20,marginHorizontal:10}}>
                
            <TouchableOpacity onPress={() =>  settype("All")} style={{padding:3,paddingHorizontal:20,borderRadius:100,borderColor:'black',borderWidth:2,backgroundColor:type == "All" ? "black" :"white" }}>
                    <Text style={{color:type == "All" ? "white" :"black"}}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() =>  settype("Veg")} style={{padding:3,paddingHorizontal:20,borderRadius:100,borderColor:'green',borderWidth:2,marginLeft:10,backgroundColor:type == "Veg" ? "green" :"white"}}>
                    <Text style={{color:type == "Veg" ? "white" :"green"}}>Veg</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => settype("NonVeg")} style={{padding:3,paddingHorizontal:20,borderRadius:100,borderColor:'red',borderWidth:2,marginHorizontal:10,backgroundColor:type == "NonVeg" ? "red" :"white"}}>
                    <Text style={{color:type == "NonVeg" ? "white" :"red"}}>Non Veg</Text>
            </TouchableOpacity>

            </View>
            {   
                data.products.length == 0 ? <View style={{marginTop:100}}><Empty /></View>  :
                
                <FlatList
                    data={data.products}
                    renderItem={({ item, index }) =>  type == item.type || type== "All" ?  <ProductCard onPress={() => props.navigation.navigate("ProductDetail",{item:item})} key={`${index}${item.id}`}
                    removeFromCartHandler={() =>{ 
                        dispatch(removeFromCart(item.id));
                        return ToastAndroid.show("Product removed to Cart !", 2000);}} 
                    product={item} />:null }
                    onEndReachedThreshold={.5}
                    // onEndReached={loadMore}
                    extraData={products}
                />
            }
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
        marginHorizontal: 5,
        
        width: widthPercentageToDP(30),
        fontFamily:'Poppins-SemiBold'
    },
    card: {
        overflow: 'hidden',
        margin: 10,
        marginVertical:15,
        flexDirection:'row'
    },
    image: {
        height: heightPercentageToDP(10),
        width: widthPercentageToDP(20),
        resizeMode: "cover",
        overflow: 'hidden',
        borderRadius:10
    }
})


const ProductCard = ({ product,removeFromCartHandler }) => {
    const [visible, setvisible] = useState(false);

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
            let productItem = checkProductInCart(cartData, product.id);
            if (!productItem) {
                dispatch(addToCart(product));
                return ToastAndroid.show("Product added to Cart !", 2000);
            }  
        }

    console.log(cartListItem)

    return (<Pressable onPress={() => setvisible(!visible)}  >
        <View style={styles.card}>
            <View style={{flexDirection:'row'}}>
                 {product.thumbImage.length == 0 ? <Image source={require("../../assets/images/placeholder.jpg")} style={styles.image} /> : <Image source={{ uri: `${product.thumbImage[0].url}` }} style={styles.image} />}
                    <View style={{marginLeft:10}}>
                        <Text style={styles.title} numberOfLines={2} >{product.name}</Text>
                        <Text style={{ fontSize: heightPercentageToDP(2) }} >₹{product.price}.00</Text>
                        <Text style={{ color: 'gold' }} ><Icon name="star" fill="gold" style={{ width: 15, height: 15 }} /> <Text style={{ fontSize: heightPercentageToDP(2) }} >{product.rate}</Text></Text>
                    </View>
                    </View>
        {cartListItem ? <View style={{ position: 'absolute', right: 5, top: 25, }}>
            <Quantity 
                defaultQuantity={cartListItem.cartQuantity}
                onIncrease={() =>
                    dispatch(increaseQuantityCart(cartListItem.cartId))
                }
                // remove={() =>dispatch(removeFromCart(cartListItem.id)) }
                onDecrease={() =>{
                    dispatch(decreaseQuantityCart(cartListItem.cartId))
                }}
            />
        </View> : <TouchableOpacity onPress={addToCartHandle} style={{ position: 'absolute', right: 15, top: 25, }}>
             <Icon name={!cartListItem ? "shopping-bag-outline" : "shopping-bag"} fill="black" style={{ width: 25, height: 25 }} />
        </TouchableOpacity>}
        </View>

       { !visible ? null :   <View style={{margin:20,marginTop:7}}>
            <View style={{flexDirection:'row'}}>
                <Text style={{fontFamily:'Poppins-SemiBold'}}>{product.type == "Veg" ? "Vegeterian" : "Non-Vegeterian"}</Text>
                <View style={{borderColor:product.type == "Veg" ? "green": "red",borderWidth:1,justifyContent:'center',alignItems:'center',paddingHorizontal:5,marginLeft:10}} >
                     <View style={{width:10,height:10,backgroundColor:product.type == "Veg" ? "green": "red",borderRadius:20,}} />
                </View>
                
            </View>
            <Text style={{color:'black',}}>{product.description}</Text>
        </View> }
    </Pressable>)
}

