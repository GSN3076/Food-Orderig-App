import React, { Component } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import firestore from "@react-native-firebase/firestore"
import { Card, Icon, List } from '@ui-kitten/components';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import CurrencyFormatter from "react-native-currency-format"

import { gql, useQuery } from '@apollo/client';
import { API_URL } from '../config/config';
import Carousel from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient';



export default function Banner(props) {
const BANNER_QUERY = gql`
query{
  homePage{
    Banner{
      image{
        url
      }
      title
      subtitle
    }
  }
}`

    const { data, loading } = useQuery(BANNER_QUERY)
    

    renderItem = ({ item, index }) => {
        return (<Pressable onPress={() => {  }} >
                <View style={{ height: heightPercentageToDP(25), width: widthPercentageToDP(100), justifyContent: 'center', alignItems: 'center' ,}}>
                    <View style={{overflow:'hidden',borderRadius: 15,}} >
                        <Image source={{ uri: `${item.image.url}` }} style={{ height: heightPercentageToDP(25), width: widthPercentageToDP(95),  }} />
                        <LinearGradient colors={["transparent","rgba(0,0,0,0.7)"]}  style={{position:'absolute',top:0,left:0,bottom:0,right: 0,justifyContent:'flex-end',padding:20}} >
                            <Text style={{color:'white',fontSize:heightPercentageToDP(3),fontFamily:'Poppins-Bold'}}>{item.title}</Text>
                            <Text style={{color:'white',fontSize:20}}>{item.subtitle}</Text>
                        </LinearGradient>
                    </View>
                </View>
        </Pressable>
        )
    }


    return loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} ><ActivityIndicator color="lightblue" size='large' /></View> : (
        <View>
             <Carousel
            //   ref={(c) => { this._carousel = c; }}
              data={data.homePage.Banner}
              loop
              autoplay
              renderItem={renderItem}
              sliderWidth={widthPercentageToDP(100)}
              itemWidth={widthPercentageToDP(100)}
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