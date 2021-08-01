import { Layout } from '@ui-kitten/components';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { useSelector } from 'react-redux';
import CartList from '../../../components/CartList';
import FloatingButton from '../../../components/FloatingButton';
import Header from '../../../components/Header';

export default function Cart (props){
    const catrtListData = useSelector((state) => state.cartReducer);
    return (
      <Layout style={{flex:1}} >
                <Header title="Cart" onPress={() => props.navigation.goBack()} />
                <CartList navigation={props.navigation}  />
                { catrtListData.length == 0 ? null : <FloatingButton title={"GO TO CHECKOUT"} onPress={() => props.navigation.navigate("Checkout")}  icon="shopping-bag-outline"  />}
      </Layout>
    );
}
