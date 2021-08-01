import { Icon, Layout } from '@ui-kitten/components';
import React, { Component, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import ProductList from '../../../components/ProductList';
import SearchResult from '../../../components/SearchResult';

export default function Search (props) {
  const [focus, setfocus] = useState(true);
  const [serachText, setserachText] = useState('');
    
  const submitSearch = () =>{

  }
  const closeSearch = () =>{
    
  }
  return (
      <Layout style={{flex:1,}}>
            <View style={{margin:4,flexDirection:'row',alignItems:'center'}} >
                          {
                            focus ?
                            <TouchableOpacity onPress={closeSearch} >
                              <Icon name="close-circle" fill="grey" style={{width:30,height:30}} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={submitSearch}>
                              <Icon name="search-outline" fill="grey" style={{width:30,height:30}} />
                            </TouchableOpacity>
                          }
                            <TextInput
                              autoFocus
                              onChangeText={(e) =>setserachText(e)}
                              onBlur={() => setfocus(false)}
                              onFocus={() => setfocus(true)}
                              placeholder="Search here"
                                style={{width:widthPercentageToDP(80),backgroundColor:'#ececec',borderRadius:10,padding:9,margin:10}}
                            />
                    </View>
                    <View style={{flex:1,}} >
                            <SearchResult  searchText={serachText} navigation={props.navigation} />
                    </View>
      </Layout>
    );
  
}
