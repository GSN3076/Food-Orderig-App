import { ApolloClient, gql, InMemoryCache, useLazyQuery, useQuery } from '@apollo/client';
import { Divider, Icon, Layout } from '@ui-kitten/components';
import React, { Component, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, Alert, Modal, Image } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import CartList from '../../../components/CartList';
import CheckoutList from '../../../components/CheckoutList';
import FloatingButton from '../../../components/FloatingButton';
import Header from '../../../components/Header';
import Loader from '../../../components/Loader';
import { calculateTotalPrice } from '../../../components/utils/shopUtils';
import { API_URL, RAZORPAY_KEY_ID,sendPushNotification } from '../../../config/config';
import RazorpayCheckout from 'react-native-razorpay';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailed from './PaymentFailed';
import message from "@react-native-firebase/messaging";
import { removeAllFromCart } from '../../../reduxStore/actions';

import * as Animatable from "react-native-animatable"
import moment from "moment"
import { formatCurrency } from '../../../components/utils/utils';


export default function Checkout(props) {

  const [paymentStatusModal, setpaymentStatusModal] = useState(false);
  const [paymentStatus, setpaymentStatus] = useState("");
  const catrtListData = useSelector((state) => state.cartReducer);
  const dispatch = useDispatch()
  const [selectedAddress, setselectedAddress] = useState();
  const [timeSlot, settimeSlot] = useState('');
  const [mealTime, setmealTime] = useState();
  const [loading, setloading] = useState(true);
  const [shippingAddresses, setshippingAddresses] = useState([]);
  const [timeModal, settimeModal] = useState(true);
  const [deliveryType, setdeliveryType] = useState("Delivery");
  const total = calculateTotalPrice(catrtListData,false)




  const userReducer = useSelector(state => state.userReducer)
  const { user } = userReducer
  const client = new ApolloClient({
    uri: `${API_URL}/graphql`,
    cache: new InMemoryCache(),
    headers:{
      "Authorization":`Bearer ${user.token}`,
    },
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
  const {data,loading} = await client.query({query:GET_TIME})
  settimeSlot(data.timeslot.TimeSlot)
  setmealTime(data.timeslot.TimeSlot[0]);
  setloading(false);
  console.log(timeSlot);
 }

 useEffect(() =>{
  setTimeout(() =>{
    getShippingAddress()
  },1000)

  getTimeSlot()
 },[])

 const getShippingAddress = async () =>{
   
const GET_ADDRESS = gql`
query getShippingAddress{
        shippingAddresses(
            where:{
             user:${user.id}
            }
        ){
            id
            Contact
            FullName
            Country
            State
            Address
            ZipCode
            Email
            City
        }
      }`
const  {  error ,data} = await client.query({query:GET_ADDRESS})
console.log(data)
setshippingAddresses(data.shippingAddresses)
 }

  const onSubmit = async () => {
    if(!selectedAddress){
      Alert.alert("Please select address")
      return
    }

  const productsIds = catrtListData.map((item, index) => parseInt(item.id))
  const totalAm = total >= 400 ? total  : total + 20
  
  const CHECKOUT_QUERY = gql`
  mutation createOrder{
    createOrder(input:{
      data:{
        total:${totalAm}
        products:[${productsIds}]
        user:${user.id}
        status:unpaid
        shipping_address:${selectedAddress.id}
        mealsTime:{
          start:"${mealTime.start}"
          end:"${mealTime.end}"
          title:"${mealTime.title}"
        }
      }
    })
    {
      order{
        id
        total
      }
    }   
  }`

    const { data, error, loading } = await client.mutate({
      mutation: CHECKOUT_QUERY
    });
    console.log(error)
    if (data) {
      onPayment(data)
    } else {
      Alert.alert("Something went wrong", "Please try again later!")
    }
  }

  const onPayment = (orderData) => {
    var options = {
      description: 'Healthy Food Tasty',
      image: require("../../../../assets/images/logo.png"),
      currency: 'INR',
      key: RAZORPAY_KEY_ID, // Your api key
      amount: (total >= 400 ? total  : total + 20 ) * 100 ,
      name: `Food Order`,
      prefill: {
        email: selectedAddress.Email,
        contact: selectedAddress.Contact,
        name: selectedAddress.FullName
      },
      theme: { color: '#FFD700' }
    }
    RazorpayCheckout.open(options).then((data) => {
      updatePaymentToSuccess(orderData)
      const pushData = {
        title: "Your Order is Confirmed,",
        body: `${user.username} Thankyou for Ordering. 🤩`,
      }
      message().getToken().then(token => {
        sendPushNotification(pushData,token).then((res) =>{
          console.log(res);
        })  
      })
      setpaymentStatus("Successful")

      setpaymentStatusModal(true);
      // alert(`Success: ${data.razorpay_payment_id}`);
    }).catch((error) => {
      setpaymentStatus("Failed")
      setpaymentStatusModal(true);
      // handle failure
      Alert.alert(`Error: ${error.code} | ${error.description}`);
    });
  }

  const updatePaymentToSuccess = async (orderData) => {
  dispatch(removeAllFromCart());
  const QUERY = gql`
  mutation {
        updateOrder(
            input:{
              where:{
                  id:${orderData.createOrder.order.id}
              }
              data:{
                  status:paid
                  order_status:Order_Placed
              }
            }
        ){
           order{
             id
           }
        }
      }`

    const {data,error,loading} = await client.mutate({mutation:QUERY})
      console.log(data)
    }


  return loading ? <Loader /> : (
    <Layout style={{ flex: 1 }} >
      <Header title="Checkout" onPress={() => props.navigation.goBack()} />
      <ScrollView style={{ flex: 1, marginBottom: 100 }}>
        <CheckoutList navigation={props.navigation} />
        <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', height: heightPercentageToDP(2), }}>
          
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <View style={{ marginHorizontal: 8 }}>
              <Text style={{ fontSize: heightPercentageToDP(1.8) }}>Delivery Charge</Text>
            </View>
            <Text style={{ marginHorizontal: 8,fontWeight:'bold' }}>{total >= 400 ? "Free" : `₹${20}` }</Text>
          </View>
          

          <View style={{ flexDirection: 'row', alignItems: 'flex-end', }}>
            <View style={{ marginHorizontal: 8 }}>
              <Text style={{ fontSize: heightPercentageToDP(1.8) }}>SubTotal</Text>
            </View>
            <Text style={{ marginHorizontal: 8 ,fontWeight:"bold"}}>{calculateTotalPrice(catrtListData, true)}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', }}>
            <View style={{ marginHorizontal: 8 }}>
              <Text style={{ fontSize: heightPercentageToDP(2.5), fontFamily: 'Poppins-SemiBold' }}>Total</Text>
            </View>
            <Text style={{ marginHorizontal: 8, fontSize: heightPercentageToDP(2.6), fontWeight:'bold' }}>{total >= 400 ? formatCurrency(total,true) : formatCurrency(total + 20,true) }</Text>
          </View>
        </View>
        <Divider  style={{marginVertical:10}}/>
        
                    {<View style={{flexDirection:"row",justifyContent:"flex-end",alignItems:'center'}}>
                            <View>
                                  <TouchableOpacity onPress={() =>{
                                        settimeModal(true)
                                      }} style={{margin: 10,backgroundColor:"gold",paddingHorizontal:20,paddingVertical:5,borderRadius:20}}>
                                          <Text style={{fontFamily:'Poppins-Bold',fontSize:20}}>{mealTime.title}</Text>
                                  </TouchableOpacity> 
                                    <Text style={{textAlign:'center',fontFamily:'Poppins-SemiBold',fontSize:12}}>{moment(mealTime.start,"h:mm a").format("h:mm a")} - {moment(mealTime.end,"h:mm a").format("h:mm a")} </Text>
                            </View>
                        </View>}

        <View style={{ margin: 10, }}>
          { shippingAddresses.length == 0 ? null :  <Text style={{ fontFamily: 'Poppins-SemiBold', margin: 10 }}>Shipping Address</Text> }
          
          {shippingAddresses.length == 0  ? <View style={{justifyContent:'center',alignItems:'center'}} >
            <Text>You don't have any Shipping Address</Text>
                <TouchableOpacity style={{backgroundColor:'gold',padding:10,borderRadius:5}} onPress={() => props.navigation.navigate("CheckoutForm")}>
                  <Text>Add Shipping Address</Text>
                </TouchableOpacity>
            </View>
             :
            <View  >
              <FlatList
                data={shippingAddresses}
                renderItem={({ item, index }) => {
                  return (<TouchableOpacity onPress={() => setselectedAddress(item)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", borderWidth: .5, borderColor: 'black', borderRadius: 10, padding: 10, marginVertical: 5 }} >
                    <View>
                      <Text style={{ fontSize: 12, fontFamily: 'Poppins-SemiBold' }}>{item.Address}</Text>
                      <Text style={{ fontSize: 12 }}>Email- {item.Email}</Text>
                      <Text style={{ fontSize: 12 }}>Contact- {item.Contact}</Text>
                    </View>
                    {selectedAddress && selectedAddress.id == item.id ? <View style={{ width: 15, height: 15, borderRadius: 20, backgroundColor: "gold", borderColor: 'black', borderWidth: 1 }} /> : null}
                  </TouchableOpacity>)
                }}
              />
                <TouchableOpacity style={{backgroundColor:'gold',padding:10,borderRadius:5}} onPress={() => props.navigation.navigate("CheckoutForm")}>
                  <Text>Add Shipping Address +</Text>
                </TouchableOpacity>
            </View>}
        </View>
      </ScrollView>
      <FloatingButton title={"Payment"} onPress={onSubmit} icon="credit-card-outline" />
                    <Modal visible={paymentStatusModal}  onRequestClose={() =>{
                                    props.navigation.pop()
                                    // props.navigation.push("Home");
                                    setpaymentStatusModal(false);
                                  }}
                                  onDismiss={() =>{
                                    props.navigation.pop()
                                    // props.navigation.push("Home");
                                    setpaymentStatusModal(false);
                                  }}
                                  statusBarTranslucent>
                        {
                          paymentStatus == "Successful" ? <PaymentSuccess title="Your Order is Succesful" description="We will deliver your food soon." /> : <PaymentFailed  title="Your Order is failed" description="Please try Again" />
                        }
                    </Modal>
                    <Modal transparent visible={timeModal} animationType="fade"  onRequestClose={() => {
                        settimeModal(false)
                        props.navigation.goBack()
                      }} onDismiss={() => {
                        settimeModal(false)
                        props.navigation.goBack()
                      }} >
                          <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.8)',justifyContent:"center",alignItems:'center',}}>
                          <View style={{flexDirection:'row',padding:20,justifyContent:'space-between',backgroundColor:"white",width:widthPercentageToDP(90),borderRadius:10,marginVertical:10}}>
                                <Text style={{fontFamily:"Poppins-Bold",fontSize:20}}>Select your Delivery type.</Text>
                                <TouchableOpacity>
                                  {/* <Icon name="close-circle" fill="black" style={{height:30,width:30}} /> */}
                                </TouchableOpacity>
                              </View>
                              <View style={{backgroundColor:'white',width:widthPercentageToDP(90),flexDirection:'row',alignItems:'center',padding:20,justifyContent:'space-around',borderRadius:10,elevation:5,paddingVertical:30}}>
                                  <TouchableOpacity onPress={() => setdeliveryType("Delivery")} style={{backgroundColor:deliveryType == "Delivery" ? "gold" :"white",height:heightPercentageToDP(12),width:heightPercentageToDP(12),justifyContent:'center',alignItems:'center',padding:10,borderRadius:100,elevation:3}}>
                                      <Image source={require("../../../../assets/images/delivery.png")} style={{width:heightPercentageToDP(5),height:heightPercentageToDP(5),}} />
                                      <Text style={{fontFamily:'Poppins-Bold',fontSize:11,color:'black'}}>Home Delivery</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={() => {
                                          setmealTime(timeSlot[2])
                                      setdeliveryType("Takeaway")
                                    }} style={{backgroundColor:deliveryType == "Takeaway" ? "gold" :"white",height:heightPercentageToDP(12),width:heightPercentageToDP(12),justifyContent:'center',alignItems:'center',padding:10,borderRadius:100,elevation:3}}>
                                      <Image source={require("../../../../assets/images/take-away.png")} style={{width:heightPercentageToDP(5),height:heightPercentageToDP(5),}} />
                                      <Text style={{fontFamily:'Poppins-Bold',fontSize:11,color:'black'}}>Takeaway</Text>
                                  </TouchableOpacity>
                              </View>
                             {deliveryType === "Delivery" ? <Animatable.View animation="slideInDown" duration={400} style={{flexDirection:"row",justifyContent:"center",alignItems:'center',backgroundColor:"white",width:widthPercentageToDP(90),borderRadius:10,marginVertical:10,paddingVertical:10}}>
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
                        </Animatable.View> : null}
                                     <TouchableOpacity onPress={() =>{settimeModal(false) }} style={{margin: 10,backgroundColor: mealTime == undefined ? "grey" : "gold" ,justifyContent:'center',paddingHorizontal:20,paddingVertical:5,borderRadius:20,width:widthPercentageToDP(90),height:heightPercentageToDP(7)}}>
                                                    <Text style={{fontFamily:'Poppins-Bold',fontSize:20,textAlign:'center'}}>Submit</Text>
                                    </TouchableOpacity>      
                          </View>
                    </Modal>
    </Layout>
  );

}
