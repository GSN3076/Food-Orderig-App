import { Divider, Layout } from '@ui-kitten/components'
import React, { useState } from 'react'
import { View, Text, Image, ScrollView, Modal, Pressable, TouchableOpacity } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import Header from '../../../components/Header'
import { API_URL } from '../../../config/config'
import { Picker } from '@react-native-picker/picker';
import { gql, useQuery } from '@apollo/client'
import PickerList from '../../../components/PickerList'
import FloatingButton from '../../../components/FloatingButton'
import { useEffect } from 'react'

export default function PlanDetails(props) {
    const plan = props.route.params.item

    const [mealsPerDay, setmealsPerDay] = useState(plan.mealsPerDay);
    const [selectedItems, setselectedItems] = useState([]);
    const [mealsList, setmealsList] = useState([]);
    const [mealsArray, setmealsArray] = useState([]);
    const PRODUCTS_QUERY = gql`
    query{
        products{
            name
            id
            quantity
            price
            vendor{
                name
            }
            thumbImage{
                url
            }
            images{
                url
            }
            rate
            brand
            }
        }`
    const {data,loading,error}  = useQuery(PRODUCTS_QUERY)

    const datePicker = () => {
        var numberOfDays = []
        for (let i = 1; i <= plan.mealsPerDay; i++) {
            numberOfDays.push(<Picker.Item  value={i} key={i} label={`${i} Meals`} />)
        }
        return (
            <Picker
                selectedValue={mealsPerDay}
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) =>
                    setmealsPerDay(itemValue)
                }>
                    <Picker.Item value={null} label="Select Meals" />
                {numberOfDays}
            </Picker>
        )
    }

    const changeMeals = (meal,i,quantity,mealTime) =>{
        let list = mealsList;
        list[i]= meal ;
        setmealsList(list.filter(itm => itm != undefined || null ))
        // console.log(list)
        let mealarray = mealsArray;
        if(meal && mealTime ){
           let mealid = meal ? meal.id : null
            mealarray[i] = {
                meal: mealid,
                quantity:quantity,
                time:{
                    start:mealTime.start,
                    end:mealTime.end,
                    title:mealTime.title
                  }
            };

            setmealsArray(mealarray.filter(itm => itm !== undefined || null))
            console.log("mealarray",mealarray.length);
            console.log("list",mealsList.length);
        }
    }

    

    const Meals = () => {
        var meals = []
        for (let i = 0; i < mealsPerDay; i++) { 
            meals.push(<PickerList data={data.products} index={i} onChange={(e,quantity,mealTime) => changeMeals(e,i,quantity,mealTime)} title={`Meal No.${i+1}`} />)
        }
        return (
            <View>
                {meals}
            </View>   
        )
    }

    return (
        <Layout style={{ flex: 1 }}>
            <Header onPress={() => props.navigation.goBack()} title={plan.name} />
            <ScrollView style={{marginBottom:heightPercentageToDP(10)}}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={{ uri: `${plan.image.url}` }} style={{ width: widthPercentageToDP(95), height: 200, borderRadius: 10 }} />
                </View>
                <View>
                    <Text style={{ marginHorizontal: 10, marginTop: 10, fontFamily: 'Poppins-Bold', fontSize: 20 }}>{plan.name}</Text>
                    <Text style={{ marginHorizontal: 10 }}>{plan.description}</Text>
                </View>
                <Divider style={{ marginVertical: 10 }} />
                <View style={{ margin: 10 }}>
                    {/* <Text style={{ fontFamily: 'Poppins-SemiBold',fontSize:20 }}>Customize Your Plan</Text> */}

                    <View style={{marginTop:20}} >
                        {/* <Text style={{fontFamily:'Poppins-SemiBold',}}>Meals Per Day</Text> */}
                        {/* <View >
                        {datePicker()}
                    </View> */}
                    </View>
                    <View style={{marginTop:20}} >
                       <Text style={{fontFamily:'Poppins-SemiBold',fontSize:heightPercentageToDP(3),marginHorizontal:10,}}>Select Meals</Text>
                       {
                            plan.products.length != 0 ? plan.products.map((item,index) =>{
                               return (<Pressable onPress={() => {}}>
                                <View style={{flexDirection:'row',margin:10,}} >
                                        {item.images.length == 0 ? null : <Image source={{uri:`${item.images[0].url}`}} style={{width:50,height:50,borderRadius:5,}} /> }
                                    <View style={{margin:10}}>
                                            <Text style={{fontSize:16,}}>{item.name}</Text>
                                            <Text style={{fontSize:12,}}>₹{item.price}</Text>
                                    </View>
                                </View>
                            </Pressable>
                            )
                            })  : Meals()
                       }
                    </View>
                </View>
                <View>
                </View>
            </ScrollView>
                   { mealsList.length != 0  || plan.products.length != 0  ? <FloatingButton onPress={() => props.navigation.navigate("SubscriptionCheckout",{cart: plan.products.length != 0 ? plan.products :  mealsList ,plan:plan,mealsArray:mealsArray})} title="Subscribe to the plan" icon="shopping-bag" /> : null}
        </Layout>
    )
}

