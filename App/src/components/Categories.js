import { gql, useQuery } from '@apollo/client'
import React from 'react'
import { View, Text, FlatList, Pressable, Image } from 'react-native'
import { API_URL } from '../config/config'
import Loader from './Loader'

export default function Categories(props) {

    const GET_CATEGORIES = gql`
    query getCategory{
        categories{
            id
            category
            image{
                url
            }
        }
        }
    `
    const {data,loading,error} = useQuery(GET_CATEGORIES)
    console.log(data);
    
    return loading ? <Loader /> : (
        <View>
                <FlatList
                    data={data.categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={(({item,index}) => {
                    return (
                        <Pressable onPress={() => {props.navigation.navigate("Category",{item:item})}}>
                            <View style={{margin:14,alignItems:"center"}}>
                                <Image style={{width:140,height:140,borderRadius:10}}  source={{uri:`${item.image.url}`}}/>
                                <Text style={{fontFamily:'Poppins-SemiBold',textAlign:'center',marginVertical:10,width:100}} numberOfLines={2} >{item.category}</Text>
                            </View>
                        </Pressable>
                    )
                })}
                />
        </View>
    )
}
