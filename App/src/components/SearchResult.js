import { gql, useQuery } from '@apollo/client';
import { Icon } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, ToastAndroid, Pressable, StyleSheet } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL } from '../config/config';
import { addToCart, addToWishlist, decreaseQuantityCart, increaseQuantityCart, removeFromCart } from '../reduxStore/actions';
import { Quantity } from './CartList';
import Empty from './Empty';
import Loader from './Loader';
import { checkProductInCart, checkProductInWishList } from './utils/shopUtils';

export default function SearchResult(props) {
    
    const dispatch = useDispatch()
    const SEARCH_QUERY = gql`
    query search  {
  products(
    limit: 10, start: 0, sort: "name:asc",  
    where:{
    name_contains:"${props.searchText}"
  }){
    name
    quantity
    price
    description
    vendor{
      name
    }
    id
    thumbImage{
      url
    }
  }
}`
    
    const {data,loading} = useQuery(SEARCH_QUERY);

    const renderProductList = ({item,index}) =>{
        console.log(item)
        return (<TouchableOpacity onPress={() => props.navigation.navigate("ProductDetail",{item:item})} style={{margin: 20,flexDirection:'row'}}>
            {item.thumbImage.length >= 1  ? <Image source={{uri:`${API_URL}${item.thumbImage[0].url}`}} style={{width:60,height:60,borderRadius:4,backgroundColor:'grey'}} />:<Image source={require("../../assets/images/placeholder.jpg")} style={{width:60,height:60,borderRadius:4,backgroundColor:'grey'}} />}
            <View style={{marginHorizontal:10}}>
                <Text style={{fontSize:14,fontFamily:'Poppins-Bold',}}>{item.name}</Text>
                <Text style={{fontSize:12,fontFamily:'Poppins-Bold',color:'grey'}}>₹{item.price}</Text>
            </View>

            {cartListItem ? <View style={{ position: 'absolute', right: 5, top: 25, }}>
            <Quantity 
                onRemove={() => dispatch(removeFromCart(cartListItem.cartId))}
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

    </TouchableOpacity>)
    }

    const renderVendorList = ({item,index}) =>{
        return (
            <TouchableOpacity onPress={() => props.navigation.navigate("Vendor",{item:item})} style={{margin: 10,justifyContent:'center',alignItems:'center'}}>
                <Image source={{uri:`${API_URL}${item.Avatar.url}`}} style={{width:60,height:60,borderWidth:2,borderColor:'lightblue',borderRadius:50,}} />
                <Text style={{fontSize:14}}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    return loading ? <Loader /> : (
        <View style={{flex:1}}>
            { data.products.length == 0 ?
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Image source={require("../../assets/images/not-found.png")}  style={{height:100,width:100,}}/>
                <Text style={{fontSize:20,margin: 20,}}><Text style={{fontFamily:"Poppins-Bold"}}>{props.searchText}</Text> search terms Not Found</Text>
            </View>
            : <View>
            {/* {data.vendors.length == 0 ? null : <FlatList 
                horizontal
                data={data.vendors}
                renderItem={renderVendorList}
            />} */}
            {data.products.length == 0 ? null : <FlatList 
                data={data.products}
                renderItem={({ item, index }) => <ProductCard onPress={() => props.navigation.navigate("ProductDetail",{item:item})} key={`${index}${item.id}`} removeFromCartHandler={() =>{ dispatch(removeFromCart(item.id));
                    return ToastAndroid.show("Product removed to Cart !", 2000);}} product={item} />}
            />}
            </View>}
        </View>
    )
}


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
                        <Text style={{ fontSize:11}} >₹{product.price}.00</Text>
                        <Text style={{ color: 'gold' }} ><Icon name="star" fill="gold" style={{ width: 15, height: 15 }} /> <Text style={{ fontSize: heightPercentageToDP(2) }} >{product.rate}</Text></Text>
                    </View>
                    </View>
        {cartListItem ? <View style={{ position: 'absolute', right: 5, top: 25, }}>
            <Quantity 
                onRemove={() => dispatch(removeFromCart(cartListItem.cartId))}
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
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{fontFamily:'Poppins-SemiBold'}}>{product.type == "Veg" ? "Vegeterian" : "Non-Vegeterian"}</Text>
                <View style={{borderColor:product.type == "Veg" ? "green": "red",borderWidth:1,justifyContent:'center',alignItems:'center',paddingHorizontal:4,marginLeft:10,paddingVertical:3}} >
                     <View style={{width:8,height:8,backgroundColor:product.type == "Veg" ? "green": "red",borderRadius:20,}} />
                </View>
            </View>
            <Text style={{color:'black',marginTop:6,fontFamily:'Poppins-SemiBold'}}>{product.description}</Text>
        </View> }
    </Pressable>)
}


const styles = StyleSheet.create({
    bottomRow: {
        flexDirection: 'row',
        margin: 3,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 12,
        // marginHorizontal: 5,
        
        width: widthPercentageToDP(40),
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