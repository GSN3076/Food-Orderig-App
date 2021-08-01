import React, { useEffect, useState } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import Header from "../../../components/Header"
import { API_URL, RAZORPAY_KEY_ID, sendPushNotification } from '../../../config/config'
import {calculateSubscriptionTotalPrice, calculateTotalPrice} from "../../../components/utils/shopUtils"
import FloatingButton from '../../../components/FloatingButton'
import { ApolloClient, gql, InMemoryCache, useQuery } from '@apollo/client'
import { useSelector } from 'react-redux'
import RazorpayCheckout from 'react-native-razorpay';
import PaymentSuccess from './PaymentSuccess'
import PaymentFailed from './PaymentFailed'
import message from "@react-native-firebase/messaging"
import moment from 'moment'


export default function SubscrptionCheckout(props) {

    const [mealsArrayObject, setmealsArrayObject] = useState(props.route.params.mealsArray);
    const userReducer = useSelector(state => state.userReducer)
    const {user} = userReducer
    const plan = props.route.params.plan
    const meals = props.route.params.cart
    
    console.log("meals",meals.length);

    const tempArr = mealsArrayObject.filter(itm => itm != undefined || null) 
    const mealsArr = meals.filter(itm => itm != undefined || null) 
    
    const struc = mealsArr.map((itm,i) => ({
        price:itm.price,
        quantity:mealsArrayObject.length == 0 ? 1 : tempArr[i].quantity,
    }));
    
    const [total, settotal] = useState(plan.subscriptionType == "days" ? calculateSubscriptionTotalPrice(struc,false,plan.discount)  : (calculateSubscriptionTotalPrice(struc,false,plan.discount) * plan.duration));
    const [paymentStatusModal, setpaymentStatusModal] = useState(false);
    const [paymentStatus, setpaymentStatus] = useState("");
    
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
    const {data,loading,error} =  useQuery(GET_ADDRESS,{pollInterval:100})

    const [selectedAddress, setselectedAddress] = useState(loading ? [] : data.shippingAddresses[0]);
    

    const client = new ApolloClient({
        uri: `${API_URL}/graphql`,
        cache: new InMemoryCache(),
        headers:{
          "Authorization":`Bearer ${user.token}`,
        },
    });

    const onSubmit =async () =>{
      if(!selectedAddress){
          Alert.alert("Please select any Address");
          return
      }
        const mealsArray = meals.map((item) =>{
            return parseInt(item.id) 
        }) 
       const mealsFilterArray = mealsArray.filter(i => i != undefined )
        let tempArr = mealsArrayObject.filter(itm => itm != null) 

       let temp = JSON.stringify(tempArr)
       let parsed = temp.replace(/"(\w+)"\s*:/g, '$1:');

  const CHECKOUT_QUERY = gql`
  mutation {
    createSubscription(input:{
      data:{
        name:"${plan.name}"
        user:${user.id}
        mealsPerDay:${plan.mealsPerDay}
        plan:${plan.id}
        products:[${mealsFilterArray}]
        shipping_address:${selectedAddress.id}
        totalAmount:${total}
        status:"UNPAID"
        order_status:Order_Placed
        meals:${parsed}
      }
    }){
    subscription{
      id
      shipping_address{
        id
        user{
          username
        }
      }
      name
      mealsPerDay
      plan{
        duration
      }
    }
  }  
}
`
  const { data, error,loading } = await client.mutate({
            mutation:CHECKOUT_QUERY
        });
        console.log(data)
        if(data){
            onPayment(data,)
        }
    }

    const onPayment = (orderData,orderCredential) => {
      console.log((calculateSubscriptionTotalPrice(meals,false,plan.discount)*plan.duration))  
      var options = {
          description: 'Healthy food at Door',
          image: require("../../../../assets/images/logo.png"),
          currency: 'INR',
          key: RAZORPAY_KEY_ID, // Your api key
          amount: (total) * 100,
          name: `Meal For U | Healthy Food`,
          prefill: {
            email: selectedAddress.Email,
            contact: selectedAddress.Contact,
            name: selectedAddress.FullName
          },
          theme: {color: '#FFD700'}
        }
        RazorpayCheckout.open(options).then((data) => {
          console.log(data)
          updatePaymentToSuccess(orderData)
          const pushData= {
            title:"Your Subscription is Confirmed.",
            data:`${user.username} Thankyou for Ordering. 🤩 `
          }
          message().getToken().then(token =>{
            sendPushNotification(pushData,token)
          })
          setpaymentStatus("Successful")
          setpaymentStatusModal(true);
        }).catch((error) => {
          setpaymentStatus("Failed")
          setpaymentStatusModal(true);
          Alert.alert(`Error: ${error.code} | ${error.description}`);
        });
      }

      const updatePaymentToSuccess = async (orderData) =>{
        const QUERY = gql`
        mutation {
            updateSubscription(
                input:{
                where:{
                    id:${orderData.createSubscription.subscription.id}
                }
                data:{
                    status:"PAID"
                }
                }
            ){
                subscription{
                    id
                }
            }
            }
        `
        const {data,error,loading} = await client.mutate({mutation:QUERY})
        console.log(data)
      }

  
    
    // useEffect(() =>{   
    //     //  settotal((calculateSubscriptionTotalPrice(meals)*plan.duration) - ((calculateSubscriptionTotalPrice(meals)*plan.duration) * plan.discount/100))
    // },[])


    return loading ? null :(
        <View style={{flex:1,backgroundColor:'white'}}>
                <Header title="Checkout" onPress={() => props.navigation.goBack()} />    
                <ScrollView style={{marginBottom:100}}>
                <View style={{flexDirection:'row',margin:10}} >
                    <Image source={{uri : `${plan.image.url}`}} style={{width:100,height:100,borderRadius:8}} />
                    <View style={{marginHorizontal:10}}>
                        <Text style={{fontFamily:'Poppins-SemiBold',fontSize:19,}}>{plan.name}</Text>
                            <Text style={{fontFamily:'Poppins-SemiBold',fontSize:13,}}>Duration : {plan.duration} Days</Text> 
                        <Text style={{fontFamily:'Poppins-Regular',fontSize:12,width:210,marginTop:10}}>{plan.description}</Text>
                    </View>
                </View> 
                <View style={{marginTop:20}}>
                    <Text style={{fontFamily:"Poppins-Bold",margin:10,fontSize:heightPercentageToDP(2)}}>Meals for Each Day</Text>
                    {
                        meals.filter(itm => itm != null || undefined).map((item,index) =>{
                          console.log()
                            return item ?  (
                                <View style={{flexDirection:'row',margin:10,justifyContent:'space-between'}} >
                                  <View style={{flexDirection:'row'}}>
                                    {item.images.length != 0  ?  <Image source={{uri:`${item.images[0].url}`}} style={{width:50,height:50,borderRadius:5}} /> : <Image source={require("../../../../assets/images/placeholder.jpg")} style={{width:50,height:50,borderRadius:5}} />}
                                    <View style={{margin:5}}>
                                        <Text style={{fontSize:14,fontFamily:'Poppins-SemiBold'}} >{item.name}</Text>
                                        <Text style={{fontSize:12,fontFamily:'Helvetica'}} ><Text style={{textDecorationLine:'line-through'}}>₹{item.price}</Text>  ₹{(item.price - plan.discount) + "x" +`${struc[index].quantity}` } (Flat {plan.discount}₹ OFF) </Text>
                                    </View>
                                    </View>
                                    <View style={{}}>
                                      <View style={{backgroundColor:'gold',backgroundColor:'gold',padding:6,borderRadius:10,height:30,alignItems:'center'}}>
                                        <Text style={{fontFamily:'Poppins-Bold'}}>{mealsArrayObject[index].time.title}</Text>                                    
                                      </View>
                                      <Text style={{fontFamily:'Poppins-SemiBold',fontSize:10}}>{moment(mealsArrayObject[index].time.start,"h:mm a").format("h:mm a")} - {moment(mealsArrayObject[index].time.end,"h:mm a").format("h:mm a")}</Text>                                    
                                  </View>
                                </View>
                            ):null
                        })
                    }
                    <Text style={{fontFamily:"Poppins-Bold",fontSize:heightPercentageToDP(2.8),marginTop:20,marginHorizontal:10}}>Shipping Address</Text>
                    {data.shippingAddresses.length == 0  ? <View style={{justifyContent:'center',alignItems:'center'}} >
            <Text>You don't have any Shipping Address</Text>
                <TouchableOpacity style={{backgroundColor:'gold',padding:10,borderRadius:5}} onPress={() => props.navigation.navigate("CheckoutForm")}>
                  <Text>Add Shipping Address</Text>
                </TouchableOpacity>
            </View>
             :
            <View  >
              <FlatList
                data={data.shippingAddresses}
                renderItem={({ item, index }) => {
                  return (<TouchableOpacity onPress={() => setselectedAddress(item)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", borderWidth: .5, borderColor: 'black', borderRadius: 10, padding: 10, marginVertical: 5,marginHorizontal:10 }} >
                    <View>
                      <Text style={{ fontSize: 12, fontFamily: 'Poppins-SemiBold' }}>{item.Address}</Text>
                      <Text style={{ fontSize: 12 }}>Email- {item.Email}</Text>
                      <Text style={{ fontSize: 12 }}>Contact- {item.Contact}</Text>
                    </View>
                    {selectedAddress && selectedAddress.id == item.id ? <View style={{ width: 15, height: 15, borderRadius: 20, backgroundColor: "gold", borderColor: 'black', borderWidth: 1 }} /> : null}
                  </TouchableOpacity>)
                }}
              />
               <TouchableOpacity style={{backgroundColor:'gold',padding:10,borderRadius:5,marginHorizontal:10}} onPress={() => props.navigation.navigate("CheckoutForm")}>
                  <Text>Add Shipping Address</Text>
                </TouchableOpacity>
            </View>}
                    
                    <Text style={{fontFamily:"Poppins-Bold",fontSize:heightPercentageToDP(2.8),marginTop:20,marginHorizontal:10}}>Total Payable</Text>
                    <View style={{marginTop:10,marginHorizontal:10,flexDirection:'row',justifyContent:'space-between'}}>
                            <View>
                                <Text style={{fontFamily:"Poppins-SemiBold",fontSize:heightPercentageToDP(2)}}>Discount</Text>
                                <Text>{plan.discount}₹ discount </Text>
                            </View>
                            <View>
                                <Text style={{fontFamily:"Poppins-SemiBold",fontSize:heightPercentageToDP(2)}}>Total Amount</Text>
                                <Text style={{textDecorationLine:'line-through'}}>₹{calculateSubscriptionTotalPrice(struc)*plan.duration}.00</Text>
                                <Text style={{}}>₹{ total}.00</Text>
                            </View>
                    </View>
                </View>
                </ScrollView>
                <FloatingButton onPress={onSubmit} icon="arrow-circle-right-outline" title="Payment" />
                <Modal visible={paymentStatusModal}  onRequestClose={() =>{
                      props.navigation.pop()
                      props.navigation.push("Home");
                      setpaymentStatusModal(false);
                    }}
                    onDismiss={() =>{
                      props.navigation.pop()
                      props.navigation.push("Home");
                      setpaymentStatusModal(false);
                    }}
                    statusBarTranslucent>
                        {
                            paymentStatus == "Successful" ? <PaymentSuccess title="Payment Successful" description={"Your Subscription is Activated"} /> : <PaymentFailed title="Payment Failed" description={"Please try Again"} />
                        }
                    </Modal>
        </View>
    )
}
