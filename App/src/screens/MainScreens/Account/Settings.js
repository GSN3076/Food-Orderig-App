import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { Icon, Input, Layout, ListItem } from '@ui-kitten/components'
import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../../../components/Header'
import { API_URL } from '../../../config/config'
import { loginUser } from '../../../reduxStore/actions'

export default function Settings(props) {


    const [edit, setedit] = useState(false);
    

    const userReducer = useSelector(state => state.userReducer)
    const {user} = userReducer 
    const [email, setemail] = useState(user.email);
    const [username, setusername] = useState(user.username);
    const [password, setpassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState("");;
    const dispatch = useDispatch()
    const client = new ApolloClient({
        uri: `${API_URL}/graphql`,
        cache: new InMemoryCache(),
        headers:{
          "Authorization":`Bearer ${user.token}`,
        },
    });



    const updateUser =async () =>{
        if(password != confirmPassword ){
            Alert.alert("Password Confirmation is Incorrect")
            return
        }
        const UPDATE_QUERY  = gql`  
        mutation updateUser {
        updateUser(
            input:{
            data:{
                username:"${username}"
                email:"${email}"
            }
            where:{
                id:${user.id}
            }
        }){
            user{
                    id
                    created_at
                    updated_at
                    provider
                    confirmed
                    username
                    email
                }
            }
        }`
    
        const {data,loading,error } = await client.mutate({
            mutation:UPDATE_QUERY
        });
        const token = user.token
        setedit(false)
        Alert.alert("Update Successfuly")    
        dispatch(loginUser({token:token,...data.updateUser.user,}))
    }


    return (
        <Layout style={{flex:1}}>
            <Header title="Settings" onPress={() => props.navigation.goBack()} />
            <TouchableOpacity onPress={() =>  setedit(!edit)}  style={{alignSelf:'flex-end',marginTop:20,marginHorizontal:20,flexDirection:'row'}}>
                {edit ?  <>
                <Text style={{fontFamily:'Poppins-SemiBold'}}>DONE</Text>
                    {/* <Icon name="edit-2-outline" fill="black" style={{width:20,height:20}} /> */}
                </>
                 : 
                 <>
                    <Text style={{fontFamily:'Poppins-SemiBold'}}>Edit User</Text>
                    <Icon name="edit-2-outline" fill="black" style={{width:20,height:20}} />
                </>
                }
            </TouchableOpacity>
            <View style={{marginTop:20}}>
                    <Text style={{fontFamily:'Poppins-SemiBold',marginHorizontal:20,marginVertical:10}}>Username</Text>
                    <TextInput 
                        autoFocus={edit}
                        style={styles.input}
                        placeholder=""
                        editable={edit}
                        onChangeText={(e) => setusername(e)}
                        defaultValue={user.username}
                    /> 
                    <Text style={{fontFamily:'Poppins-SemiBold',marginHorizontal:20,marginVertical:10}}>Email</Text>
                    <TextInput 
                        editable={edit}
                        style={styles.input}
                        placeholder=""
                        onChangeText={(e) => setemail(e)}
                        defaultValue={user.email}
                    />
                    <Text style={{fontFamily:'Poppins-SemiBold',marginHorizontal:20,marginVertical:10}}>Password</Text>
                    <TextInput 
                        editable={edit}
                        style={styles.input}
                        secureTextEntry
                        placeholder="************"
                        onChangeText={(e) => setpassword(e)}
                        defaultValue={password}
                    />
                    <Text style={{fontFamily:'Poppins-SemiBold',marginHorizontal:20,marginVertical:10}}>Confirm Password</Text>
                    <TextInput 
                        editable={edit}
                        style={styles.input}
                        secureTextEntry
                        placeholder="************"
                        onChangeText={(e) => setconfirmPassword(e)}
                        defaultValue={confirmPassword}
                    />

            {edit ? <TouchableOpacity onPress={() =>{updateUser()}} style={{backgroundColor:"gold",padding:10,width:150,borderRadius:10,alignItems:'center',alignSelf:'center',}}>
                        <Text style={{fontFamily:"Poppins-Bold",color:'black'}}>SUBMIT</Text>
            </TouchableOpacity> : null}

            </View>


            {/* <ListItem
                title={"Reset Password"}
                style={{marginTop:20}}
                onPress={() => props.navigation.navigate("ResetPasswrod")}
                description={"Change Your Password"}
                // accessoryLeft={() => <Icon name="eye-outline" fill="grey" style={{width:20,height:20}}  />}
                accessoryRight={() => <Icon name="eye-outline" fill="grey" style={{width:20,height:20}}  />}
          />
            </View> */}
                    
        </Layout>
    )
}


const styles  = StyleSheet.create({
    input:{
        width:widthPercentageToDP(90),
        alignSelf:'center',
        borderWidth:0
    },

})