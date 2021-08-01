import { Layout } from '@ui-kitten/components'
import React from 'react'
import { View, Text, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import CategoryProductList from '../../../components/CategoryProductList'
import Header from '../../../components/Header'
import { API_URL } from '../../../config/config'

export default function Category(props) {
    const category = props.route.params.item
    return (
        <Layout style={{flex:1,}}>
            <Header title={category.category} onPress={() => props.navigation.goBack()} />
            <View style={{}}>
                <Image source={{uri:`${category.image.url}`}} style={{width:widthPercentageToDP(100),height:150,borderRadius:5,margin:0}} />
                    <LinearGradient style={{position:'absolute',top:0,left:0,bottom:0,right:0,justifyContent:'flex-end'}} colors={["transparent","rgba(0,0,0,.5)"]} >
                        <Text style={{fontFamily:'Poppins-SemiBold',margin:10,color:'white',fontSize:20}}>{category.category}</Text>
                        {/* <Text style={{fontFamily:'Poppins-SemiBold',margin:10,color:'white'}}>{category.category}</Text> */}
                    </LinearGradient>
            </View>
            <View>
                <CategoryProductList category={category} />    
            </View>
        </Layout>
    )
}
