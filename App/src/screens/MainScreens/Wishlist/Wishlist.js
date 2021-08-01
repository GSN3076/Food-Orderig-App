import { Layout } from '@ui-kitten/components';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import CartList from '../../../components/CartList';
import FavouriteList from '../../../components/FavouriteList';
import Header from '../../../components/Header';

export default function Wishlist (props) {
  
    return (
      <Layout style={{flex:1}} >
          <Header title={"Favourites"} onPress={() =>props.navigation.goBack()} />
          <FavouriteList navigation={props.navigation}    />
      </Layout>
    );
  }

