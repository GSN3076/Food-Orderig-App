import { ApolloClient, gql, InMemoryCache, useMutation } from '@apollo/client'
import { Input, Layout } from '@ui-kitten/components';
import React from 'react'
import { View, Text, StyleSheet, ScrollView, Alert, Modal } from 'react-native'
import { useSelector } from 'react-redux';
import Header from '../../../components/Header';
import { API_URL, RAZORPAY_KEY_ID, RAZORPAY_SECRET_KEY } from '../../../config/config';
import {Formik}  from "formik";

import * as Yup from "yup";
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import FloatingButton from '../../../components/FloatingButton';
import { calculateTotalPrice } from '../../../components/utils/shopUtils';

import RazorpayCheckout from 'react-native-razorpay';
import PaymentSuccess from './PaymentSuccess';
import { useState } from 'react';
import PaymentFailed from './PaymentFailed';

export default function CheckoutForm(props) {
    const [paymentStatusModal, setpaymentStatusModal] = useState(false);
    const [paymentStatus, setpaymentStatus] = useState("");
    const userReducer = useSelector(state => state.userReducer);
    const {user} = userReducer
    const cartState = useSelector((state) => state.cartReducer);
    const JSON_CART = JSON.stringify(cartState)
    const productsIds = cartState.map((item,index) => item.id)
   
    const client = new ApolloClient({
      uri: `${API_URL}/graphql`,
      cache: new InMemoryCache(),
      headers:{
        "Authorization":`Bearer ${user.token}`,
      },
  });

    
    const onSubmit = async (item) =>{
        const ADD_ADDRESSES = gql`
        mutation createAddress{
        createShippingAddress(
          input:{
            data:{
              Country:"${item.country}"
              State:"${item.state}"
              Address:"${item.address}"
              ZipCode:"${item.zip}"
              Contact:"${item.contact}"
              Email:"${item.email}"
              City:"${item.city}"
              FullName:"${item.firstname}"
              user:${user.id}
            }
          }
        ){
          shippingAddress{
            id
          }
        }
      }
        ` 
  
        const { data, error,loading } = await client.mutate({
            mutation:ADD_ADDRESSES
        });
        if(data){
          props.navigation.pop()
          props.navigation.navigate("Checkout")
        }else{
          Alert.alert("Something went wrong","Please try again later!")
        }
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string()
          .required()
          .email("Email is required"),
        firstname: Yup.string()
          .required()
          .min(2, "Firstname is required"),
        lastname: Yup.string()
          .required()
          .min(2, "Lastname is required"),
        appointment: Yup.string()
          .min(2, "appointment is required"),
        contact: Yup.string()
          .min(2, "contact is required"),
        country: Yup.string()
          .min(2, "country is required"),
        city: Yup.string()
          .min(2, "City is required"),
        state: Yup.string()
          .min(2, "State is required"),
        address: Yup.string()
          .min(2, "Address is required"),
        zip: Yup.string()
          .min(2, "Pincode is required"),
      });

  
    return  (
        <Layout style={{flex:1}}>
            <Header onPress={() => props.navigation.goBack()} title="Address Information"  />
            <ScrollView style={{flex:1,}}>
                <Formik
                    // onSubmit={(values) =>console.log(values)}
                    validationSchema={validationSchema}
                    render={({values,handleChange,handleSubmit}) =>{
                        return(
                            <View style={{flex:1,height:heightPercentageToDP(90)}}>
                           <View style={{}}>
                                <Input
                                    style={styles.inputField}
                                    placeholder="Full Name"
                                    paddingVertical={10}
                                    // width={widthPercentageToDP(40)}
                                    onChangeText={handleChange("firstname")}
                                />
                           </View>
                            <View style={{}}>
                                <Input
                                    style={styles.inputField}
                                    placeholder="Email"
                                    paddingVertical={10}
                                    keyboardType="email-address"
                                    onChangeText={handleChange("email")}
                                />
                            </View>
                            <View style={{}}>
                                <Input
                                    style={styles.inputField}
                                    placeholder="Contact"
                                    paddingVertical={10}
                                    keyboardType="number-pad"
                                    onChangeText={handleChange("contact")}
                                />
                            </View>
                            <View style={{}}>
                                <Input
                                    style={styles.inputField}
                                    placeholder="Country"
                                    paddingVertical={10}
                                    onChangeText={handleChange("country")}
                                />
                            </View>
                            <View style={{}}>
                                <Input
                                    style={styles.inputField}
                                    placeholder="State"
                                    paddingVertical={10}
                                    onChangeText={handleChange("state")}
                                />
                            </View>
                            <View style={{}}>
                                <Input
                                    style={styles.inputField}
                                    placeholder="City"
                                    paddingVertical={10}
                                    onChangeText={handleChange("city")}
                                />
                            </View>
                            <View style={{}}>
                                <Input
                                    style={styles.inputField}
                                    placeholder="Pincode"
                                    paddingVertical={10}
                                    onChangeText={handleChange("zip")}
                                />
                            </View>
                            <View style={{}}>
                                <Input
                                    style={styles.inputField}
                                    placeholder="Address"
                                    paddingVertical={10}
                                    onChangeText={handleChange("address")}
                                />
                            </View>
                            <View style={{position:'absolute',bottom:40,left:0,right:0,justifyContent:'center',alignItems:"center"}}>
                              <FloatingButton onPress={() => onSubmit(values)} icon="checkmark-circle-outline" title="SUBMIT" />
                            </View>
                        </View>
                        )
                    }}
                />
            </ScrollView>
                    
        </Layout>
    )
}

const styles = StyleSheet.create({
    inputField:{
        marginHorizontal:5,
        marginVertical:10,
        fontSize:30,
        height:50 
    }
})
