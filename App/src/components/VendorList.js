import React, { Component } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import firestore from "@react-native-firebase/firestore"
import { Card, Icon, List } from '@ui-kitten/components';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import CurrencyFormatter from "react-native-currency-format"
import { API_URL, PRIMAR_COLOR } from '../config/config';
import { gql, useQuery } from '@apollo/client';
import LinearGradient from 'react-native-linear-gradient';
import HeadingText from './HeadingText';

export default function VendorList(props) {

    const PRODUCTS_QUERY = gql`
    query{
    vendors{
        name
        id
        Avatar{
          url
        }
    }
    }`

    const { data, loading } = useQuery(PRODUCTS_QUERY)

    renderItem = ({ item, index }) => {
        console.log(item)
    return (<Pressable  onPress={() => { props.navigation.navigate("Vendor", { item: item }) }} >
                <View style={{ width: heightPercentageToDP(18), height: heightPercentageToDP(30), borderRadius:heightPercentageToDP(2), margin: 10, overflow: 'hidden',borderWidth:1,borderColor:'#ececec' }} >
                    <Image source={{ uri: `${item.Avatar.url}` }} style={{ width: heightPercentageToDP(18), height: heightPercentageToDP(30), resizeMode: 'cover', }} />
                <LinearGradient colors={["transparent","rgba(0,0,0,.5)"]} style={{position:"absolute",top:0,left:0,bottom:0,right: 0,justifyContent:'flex-end',padding:heightPercentageToDP(2)}} >
                    <Text style={{color:'white'}}>{item.name}</Text>
                </LinearGradient>
                </View>
                
        </Pressable>
        )
    }


    const loadMore = () => {

    }

    return loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} ><ActivityIndicator color="lightblue" size='large' /></View> : (
        <View style={{ marginTop: 10 }} >
            <HeadingText  text="Top Sellers"/>
            <FlatList
                data={data.vendors}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
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
        width: widthPercentageToDP(40),
        borderRadius: 10,
        overflow: 'hidden',
        margin: 20,
        borderWidth: .5,
        borderColor: '#ececec'
    },
    image: {
        height: heightPercentageToDP(25),
        width: "100%",
        // borderRadius:10,
        resizeMode: "contain",
        overflow: 'hidden'
    }
})