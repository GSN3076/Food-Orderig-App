import { gql, useQuery } from '@apollo/client';
import { createStackNavigator } from '@react-navigation/stack'
import { Divider, Icon, Layout } from '@ui-kitten/components';
import React, { useState } from 'react'
import { View, Text, ScrollView, Image, FlatList, TouchableOpacity ,Linking, Alert} from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Header from '../../../components/Header';
import Loader from '../../../components/Loader';
import { API_URL } from '../../../config/config';
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import AntDesign from "react-native-vector-icons/AntDesign"
import HeadingText from '../../../components/HeadingText';
import VendorProducts from '../../../components/VendorProducts';
import Carousel from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient';
import { formatCurrency } from '../../../components/utils/utils';
import Review from '../../../components/Review';
import BottomSheet from 'reanimated-bottom-sheet';

import ServiceReview from '../../../components/ServiceReview';
import FloatingButton from '../../../components/FloatingButton';

function Vendor(props) {
    const sheetRef = React.useRef(null);
    const GET_VENDOR = gql`
    query{
        vendor(id:${props.route.params.item.id}){
            name
            id
            address
            city
            email
            instagram_url
            facebook_url
            twitter_url
            linkedin_url
            joinedAt
            images{
                url
            }
            user{
                username
                id
                email
            }
            services{
                name
                description
                id
                available
                email
            image{
                url
            }
            price
            }
            Avatar{
                url
            }
        }
        }
    `


const  openLink = async (url) => {
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#453AA4',
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: '#6200EE',
          secondaryToolbarColor: 'black',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right'
          },
          headers: {
            // 'my-custom-header': 'my custom header value'
          }
        })
        // Alert.alert(JSON.stringify(result))
      }
      else Linking.openURL(url)
    } catch (error) {
    //   Alert.alert(error.message)
    }
  }

  const renderContent = () => (
    <View
      style={{
          height:heightPercentageToDP(100),
          backgroundColor: "white",
          borderRadius:10,
          elevation:10
      }}>
        <View style={{alignItems:'center',padding:5}}>
            <View style={{height:4,width:100,borderRadius:10,backgroundColor:'grey',margin:5}} />
        </View>
        <View>
            {currentServiceDisplay ?  
                  <ScrollView>
                        <View style={{borderRadius:5,overflow:'hidden',justifyContent:"flex-end",width:widthPercentageToDP(100),justifyContent:'center',alignItems:'center'}}>
                        <Image source={{uri:`${currentServiceDisplay.image.url}`}} style={{width:widthPercentageToDP(90),height:heightPercentageToDP(40),borderRadius:10,marginTop:10}} />
                    </View>
                    <View style={{margin:20}}>
                            <Text style={{fontFamily:'Poppins-Bold',fontSize:18,color:'black',width:widthPercentageToDP(50)}} numberOfLines={2}>{currentServiceDisplay.name}</Text>
                            <Text style={{fontFamily:'Poppins-Bold',fontSize:22,color:'black',}}>{formatCurrency(currentServiceDisplay.price,true)}</Text>
                        </View>
                        <View style={{margin:20}}>
                            <HeadingText text="Description" />   
                            <Text style={{fontSize:15,margin:10}}>{currentServiceDisplay.description}</Text>
                        </View>
                    </ScrollView>
                    :null
            }
        </View>
        <View style={{position: "absolute",bottom:10,left:0,right:0,}}>
                    <FloatingButton title="Buy Service" icon={"credit-card-outline"} />
            </View>
    </View>
  );


    const {data,loading} = useQuery(GET_VENDOR)
    const [currentServiceDisplay, setcurrentServiceDisplay] = useState();
    const renderCards =({item,index}) =>{
        return (
            <TouchableOpacity onPress={() =>{
                setcurrentServiceDisplay(item)
                sheetRef.current.snapTo(1)
            }}>
                    <View style={{borderRadius:5,overflow:'hidden',justifyContent:"flex-end",width:widthPercentageToDP(60),}}>
                        <Image source={{uri:`${item.image.url}`}} style={{width:widthPercentageToDP(60),height:heightPercentageToDP(40)}} />
                         <LinearGradient style={{position:'absolute',top:0,left:0,bottom:0,right: 0,}} colors={["transparent","rgba(0,0,0,.6)"]} />
                        <View style={{position: "absolute",bottom:10,left:10,}}>
                            <Text style={{fontFamily:'Poppins-Bold',fontSize:18,color:'white',width:widthPercentageToDP(50)}} numberOfLines={2}>{item.name}</Text>
                            <Text style={{fontFamily:'Poppins-Bold',fontSize:22,color:'white',}}>{formatCurrency(item.price,true)}</Text>
                        </View>    
                    </View>
            </TouchableOpacity>
        )
    } 


    return loading ? <Loader />: (
        <Layout style={{flex:1}}>
                {/* <Header title={data.vendor.name} /> */}
                <TouchableOpacity style={{justifyContent:'center',alignItems:'center',padding:5,borderRadius:20,position:'absolute',top:10,left:20,backgroundColor:'rgba(0,0,0,.3)'}} >
                        <Icon name="arrow-ios-back-outline" fill={"white"} style={{width:30,height:30}}  />
                    </TouchableOpacity>
                <ScrollView style={{marginTop:80}} >
                    <View style={{height:heightPercentageToDP(32)}}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        data={data.vendor.images}
                        horizontal
                        renderItem={({item,index}) =>{
                            return (
                                <View style={{width:widthPercentageToDP(100),height:heightPercentageToDP(390),alignItems:'center'}}>
                                    <Image style={{width:widthPercentageToDP(90),height:heightPercentageToDP(30),borderRadius:10}} source={{uri:`${item.url}`}} />
                                </View>
                            )
                        }}
                    />
                    </View>
                    <View style={{flexDirection:'row',margin:20,}}>
                        <View>
                            <Image style={{height:75,width:75,borderRadius:10,}} source={{uri:`${data.vendor.Avatar.url}`}} />
                        </View>
                    {/* <Divider style={{marginVertical:20}} /> */}

                        <View style={{marginHorizontal:10}}  >
                            <Text style={{color:'black',fontFamily:'Poppins-Bold',fontSize:25}}>
                                    {data.vendor.name}
                            </Text>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Icon name="email-outline" fill="grey"  style={{width:15,height:15,}} />
                                <Text style={{color:'grey',fontSize:15,marginLeft:4}}>
                                        {data.vendor.email}
                                </Text>
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Icon name="globe-outline" fill="grey"  style={{width:15,height:15,}} />
                                    <Text style={{color:'grey',fontSize:15,marginLeft:4}}>
                                            {data.vendor.city}
                                    </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:20}}>
                        {data.vendor.facebook_url ? <TouchableOpacity onPress={() => openLink(data.vendor.facebook_url)}>
                            <AntDesign name="facebook-square" color="grey"  size={20} style={{margin:5}} />
                        </TouchableOpacity>:null}
                        {data.vendor.instagram_url ?<TouchableOpacity onPress={() => openLink(data.vendor.instagram_url)}>
                            <AntDesign name="instagram" color="grey"  size={20} style={{margin:5}} />
                        </TouchableOpacity>:null}
                        {data.vendor.twitter_url ? <TouchableOpacity onPress={() => openLink(data.vendor.twitter_url)}>
                            <AntDesign name="twitter" color="grey"  size={20} style={{margin:5}} />
                        </TouchableOpacity>:null}
                        {data.vendor.linkedin_url ? <TouchableOpacity onPress={() => openLink(data.vendor.linkedin_url)}>
                            <AntDesign name="linkedin-square" color="grey"  size={20} style={{margin:5}} />
                        </TouchableOpacity>:null}
                    </View>
                    <Divider style={{marginVertical:20}} />
                        <Text style={{marginHorizontal:20,marginTop:20,fontFamily:'Poppins-Bold',fontSize:20}}>Services by {data.vendor.name}</Text>
                        <View style={{marginTop:20}}>
                            <Carousel
                                // loop
                                firstItem={2}
                                initialScrollIndex={1}
                                initialNumToRender={1}
                                data={data.vendor.services}
                                itemWidth={widthPercentageToDP(60)}
                                itemHeight={heightPercentageToDP(30)}
                                sliderHeight={heightPercentageToDP(30)}
                                sliderWidth={widthPercentageToDP(100)}
                                renderItem={renderCards}
                            />
                        </View>
                        <Divider style={{marginTop:20}} />
                        <ServiceReview service={data.vendor.services[0]} />
                        <Divider style={{marginTop:20}}/>
                        <Text style={{marginHorizontal:20,marginTop:20,fontFamily:'Poppins-Bold',fontSize:20}}>Products by {data.vendor.name}</Text>
                        <VendorProducts navigation={props.navigation}  vendor={data.vendor}/>
                </ScrollView>
                <BottomSheet
                    ref={sheetRef}
                    snapPoints={[0,450,heightPercentageToDP(100)]}
                    borderRadius={10}
                    renderContent={renderContent}
                />
        </Layout>
    )
}


export default function (props){
    const VendorStack = createStackNavigator();
    return (
        <VendorStack.Navigator headerMode="none">
            <VendorStack.Screen name="Vendor"  >
                {screenProps => <Vendor {...screenProps} {...props}   />}
            </VendorStack.Screen>
        </VendorStack.Navigator>    
    )
} 

