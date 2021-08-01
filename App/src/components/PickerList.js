import { Divider, Icon } from '@ui-kitten/components'
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Modal, FlatList, Pressable, Image } from 'react-native'
import { API_URL } from '../config/config';
import * as Animatable from "react-native-animatable"
import { ApolloClient, gql, InMemoryCache, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import moment from "moment"
import { widthPercentageToDP } from 'react-native-responsive-screen';

export default function PickerList(props) {
    
    const [visible, setvisible] = useState(false);
    const [selectedItem, setselectedItem] = useState();
    const [quantity, setquantity] = useState(1);
    const [mealTime, setmealTime] = useState();
    const [loading, setloading] = useState(true);
    const [timeSlot, settimeSlot] = useState([]);
    const [deliveryType, setdeliveryType] = useState("");

    const userReducer = useSelector(state => state.userReducer) 
    const {user} = userReducer
    
    const client = new ApolloClient({
      uri: `${API_URL}/graphql`,
      cache: new InMemoryCache(),
      headers:{
        "Authorization":`Bearer ${user ?  user.token : ""}`
      }
    });
    
  

   const getTimeSlot = async () =>{
    const GET_TIME = gql`
    query{
        timeslot{
            TimeSlot{
                id
                start
                end
                title
            }
        }
    }`

    const {data,loading } = await client.query({query:GET_TIME})
    settimeSlot(data.timeslot.TimeSlot)
    setloading(false)
    // setmealTime(data.timeSlot.TimeSlot[0]);
    console.log(timeSlot);
   }

    useEffect(() =>{
        props.onChange(selectedItem,quantity,mealTime)
    },[selectedItem,quantity,mealTime]);

    useEffect(() =>{
        getTimeSlot()
    },[])

    
    const renderItem = ({item,index}) =>{
        return loading ? null : (
                <Pressable onPress={() => {setselectedItem(item)}}>
                <View style={{flexDirection:'row',margin:10,opacity: 1,}} >
                    {item.images.length == 0 ? null : <Image source={{uri:`${item.images[0].url}`}} style={{width:50,height:50,borderRadius:5,}} /> }
                    <View style={{margin:10}}>
                            <Text style={{fontSize:16,}}>{item.name}</Text>
                            <Text style={{fontSize:12,}}>₹{item.price}</Text>
                    </View>
                  {selectedItem && selectedItem.id == item.id ?  <View style={{width:20,height:20,borderRadius:30,backgroundColor:'gold',borderColor:"black",borderWidth:2,position:'absolute',right:10,top:10}} /> : null}
                
                </View>
                {selectedItem ? (selectedItem.id == item.id  ?  
                <Animatable.View animation={{
                    from:{
                        opacity:0,
                        transform:[
                            {
                                translateY:-20
                            }
                        ]
                    },
                    to:{
                        opacity:1,
                        transform:[
                            {
                                translateY:1
                            }
                        ]
                    }
                }}  style={{backgroundColor:'#ececec',margin:10,borderRadius:10,padding:10}}>
                    <View style={{justifyContent:'space-between',alignItems:'center',marginHorizontal:20}}>
                        {/* <Text style={{fontFamily:'Poppins-Bold',fontSize:20}}>Meal Time :</Text> */}

                       <View style={{flexDirection:"row",width:widthPercentageToDP(80),justifyContent:'center'}}>
                                    <TouchableOpacity onPress={() =>{
                                        setdeliveryType("Delivery")    
                                    }} style={{margin: 10,backgroundColor:deliveryType === "Delivery" ?  "gold" :"white",paddingHorizontal:20,paddingVertical:5,borderRadius:20}}>
                                            <Text style={{fontFamily:'Poppins-Bold',fontSize:20}}>Home Delivery</Text>
                                    </TouchableOpacity> 
                                    <TouchableOpacity onPress={() =>{
                                        setdeliveryType("Takeaway")
                                        setmealTime(timeSlot[2])    
                                    }} style={{margin: 10,backgroundColor:deliveryType === "Takeaway" ?  "gold" :"white",paddingHorizontal:20,paddingVertical:5,borderRadius:20}}>
                                            <Text style={{fontFamily:'Poppins-Bold',fontSize:20}}>Takeaway</Text>
                                    </TouchableOpacity> 
                        </View> 
                      {deliveryType == "Delivery" ?  
                      <View style={{flexDirection:"row",width:widthPercentageToDP(70),justifyContent:'center'}}>
                            <View>
                                    <TouchableOpacity onPress={() =>{
                                            setmealTime(timeSlot[0])
                                        }} style={{margin: 10,backgroundColor:mealTime ? (mealTime.title === "Lunch" ? "gold" :"white") : "white" ,paddingHorizontal:20,paddingVertical:5,borderRadius:20}}>
                                            <Text style={{fontFamily:'Poppins-Bold',fontSize:20}}>Lunch</Text>
                                    </TouchableOpacity> 
                                    <Text style={{textAlign:'center',fontFamily:'Poppins-SemiBold',fontSize:12}}>{moment(timeSlot[0].start,"h:mm a").format("h:mm a")} - {moment(timeSlot[0].end,"h:mm a").format("h:mm a")} </Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() =>{
                                            setmealTime(timeSlot[1])
                                }} style={{margin: 10,backgroundColor:mealTime ? (mealTime.title === "Dinner" ? "gold" :"white") : "white" ,paddingHorizontal:20,paddingVertical:5,borderRadius:20}}>
                                                <Text style={{fontFamily:'Poppins-Bold',fontSize:20}}>Dinner</Text>
                                </TouchableOpacity>      
                                <Text style={{textAlign:'center',fontFamily:'Poppins-SemiBold',fontSize:12}}>{moment(timeSlot[1].start,"h:mm a").format("h:mm a")} - {moment(timeSlot[1].end,"h:mm a").format("h:mm a")} </Text>
                            </View>
                        </View> : null}

                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginHorizontal:20,marginVertical:10}}>
                            <Text style={{fontFamily:'Poppins-Bold',fontSize:20}}>Quantity :</Text>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',width:widthPercentageToDP(70),}}>
                                    
                                    <TouchableOpacity onPress={() =>{setquantity(quantity == 1  ? 1 : quantity-1)}} style={{margin: 10,}}>
                                        <Icon name="minus-circle" fill="black" style={{height:30,width:30}} />
                                    </TouchableOpacity>
                                    <Text style={{fontFamily:'Poppins-Bold',fontSize:20}}>{quantity}</Text>

                                    <TouchableOpacity onPress={() =>{setquantity(quantity+1)}} style={{margin: 10,}}>
                                        <Icon name="plus-circle" fill="black" style={{height:30,width:30}} />
                                    </TouchableOpacity>
                        </View>
                    </View>
                     
                </Animatable.View>
                : null) : null}
                
                <Divider />
        </Pressable>)
    }
    
    return (
        <>
            <View style={{margin:10,marginVertical:20}}>
                {selectedItem ? 
                    <TouchableOpacity onPress={() =>setvisible(true)} style={{flexDirection:'row'}}>
                            {selectedItem.images.length == 0 ? null : <Image source={{uri:`${selectedItem.images[0].url}`}} style={{width:50,height:50,borderRadius:4}} />}
                            <View style={{margin: 10,marginTop:0}}>
                                <Text style={{fontFamily:'Poppins-SemiBold',fontSize:15,}}>Meal no.{props.index}</Text>
                                <Text style={{fontFamily:'Poppins-SemiBold',fontSize:12,}}>{selectedItem.name}</Text>
                                <Text style={{fontFamily:'Poppins-SemiBold',fontSize:12,}}>₹{selectedItem.price}</Text>
                            </View>
                    </TouchableOpacity> : <TouchableOpacity onPress={() =>setvisible(true)} style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:'black',padding:10,borderRadius:10}}>
                    <Text style={{fontFamily:'Poppins-SemiBold',fontSize:15}}>{props.title}</Text>
                    <Icon name="arrow-circle-right-outline" fill="black" style={{width:20,height:20}} />
                </TouchableOpacity>}
            </View>
        <Modal animationType="fade" visible={visible} statusBarTranslucent onRequestClose={() => setvisible(false)} onDismiss={() => setvisible(false)} >
                <View style={{flex:1,marginTop:50}}>
                <View style={{flexDirection:'row',margin:10,justifyContent:'space-between'}}>
                    <Text style={{fontFamily:'Poppins-SemiBold',fontSize:22}}>Select a Meal</Text>
                    <TouchableOpacity onPress={() => setvisible(false)}>
                          <Icon name="close-circle-outline" fill="black" style={{width:30,height:30}} />
                    </TouchableOpacity>
                </View>
                    <FlatList
                        data={props.data}
                        renderItem={renderItem}
                    />
                </View>
                <View style={{position:'absolute',bottom:10,left:0,right: 0,justifyContent:'center'}}>
                       {mealTime ?  <TouchableOpacity onPress={() =>setvisible(false)} style={{backgroundColor:'gold',padding:20,margin: 10,borderRadius:10}}>
                            <Text style={{fontFamily:'Poppins-Bold',textAlign:'center'}}>DONE</Text>
                        </TouchableOpacity> : null}
                </View>
        </Modal>
        </>
    )
}


