import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Input, Layout } from '@ui-kitten/components'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import {Formik}  from "formik";
import * as Yup from "yup";
import Header from '../../../components/Header';

export default function SellerHome(props) {

    const submitForm = () =>{

    }
    
    const validationSchema = Yup.object().shape({
        email: Yup.string()
          .required()
          .email("Email is required"),
        company: Yup.string()
          .required()
          .min(2, "Store name is required"),
        phone: Yup.string()
          .min(2, "Phone number is required"),
        country: Yup.string()
          .min(2, "country is required"),
        state: Yup.string()
          .min(2, "State is required"),
        address: Yup.string()
          .min(2, "Address is required"),
        zip: Yup.string()
          .min(2, "Pincode is required"),
      });


    return (
        <Layout style={{flex:1,backgroundColor:'white',padding:0}}>
            <Header onPress={() => props.navigation.goBack()} title="SignUp" />
                <View style={{}}>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                        <Text style={{margin:20,fontSize:30,fontFamily:'Poppins-Bold'}}>Sign Up</Text>
                    </View>
                        <Formik
                            validationSchema={validationSchema}
                            render={({values,handleChange,handleSubmit}) =>{
                                return (
                                <>
                                    <Input  style={styles.input} placeholder="Store Name" keyboardType="email-address" onChangeText={handleChange("company")}  />
                                    <Input style={styles.input} placeholder="Email" keyboardType="email-address" onChangeText={handleChange("email")}  />
                                    <Input style={styles.input} placeholder="Address" keyboardType="default" onChangeText={handleChange("address")}  />
                                    <Input style={styles.input} placeholder="Phone" keyboardType="default" onChangeText={handleChange("phone")}  />
                                    <Input style={styles.input} placeholder="City" keyboardType="default" onChangeText={handleChange("city")}  />
                                    <Input style={styles.input} placeholder="pincode" keyboardType="default" onChangeText={handleChange("zip")}  />
                                    <Input style={styles.input} placeholder="State" keyboardType="default" onChangeText={handleChange("state")}  />
                                </>
                            )
                        }}    
                    />
                </View>
        </Layout>
    )
}


const styles = StyleSheet.create({
    input:{
        margin:10,
        marginHorizontal:20
    }
})