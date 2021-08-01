import { gql, useQuery,useMutation } from '@apollo/client'
import { Icon } from '@ui-kitten/components'
import React, { useState } from 'react'
import { useReducer } from 'react'
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { useSelector } from 'react-redux'
import { API_URL } from '../config/config'
import Header from './Header'
import Loader from './Loader'

export default function ServiceReview(props) {

    const [reviewText,setReviewText] = useState("")
    const [rate, setrate] = useState(1);
    const userReducer = useSelector(state => state.userReducer)
    const {user} = userReducer 
    const GET_REVIEW_QUERY =gql`
        query{
            reviews(where:{service:${props.service.id}}){
                id
                review
                rate
                user{
                    username
                    avatar{
                        url
                    }
                }
                created_at
            }
        }`

    const {data,loading} = useQuery(GET_REVIEW_QUERY)
    // const [reviews, setreviews] = useState(loading ? []:data.reviews);
    // const [, forceUpdate] = useReducer(x => x + 1, 0);

    const getRatings = (rate) =>{
            var ratings = []
            for(let i=0;i<=rate; i++){
                ratings.push(<Icon name="star" fill="gold" style={{width:17,height:17}} />)
                i++;
            }
        return <Text style={{flexDirection:'row',margin:3}}>
            {ratings}
        </Text>
    } 

    const  addQuery = gql`
    mutation postReview{
      createReview(    
          input:{
            data:{
              service:${props.service.id}
              review:"${reviewText}"
              rate:${rate}
              user:${user.id}
            }
          }
        )
        {
        review{
          id
          review
          created_at
          user{
            username
          }
        }
      }
    }`


    const [addReview,response] = useMutation(addQuery);
    // console.log(response.data)
    const renderReviews = ({item,index}) =>{
        return (
            <View style={{padding:heightPercentageToDP(2),flexDirection:'row'}}>
                        <View>
                            {!item.user.avatar ? <Image source={{uri:`https://www.xovi.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png`}} style={{width:30,height:30,borderRadius:heightPercentageToDP(20),backgroundColor:'lightgrey'}} />
                            :<Image source={{uri:`${API_URL}${item.user.avatar.url}`}} style={{width:30,height:30,borderRadius:heightPercentageToDP(20),backgroundColor:'lightgrey'}} />}
                        </View>
                        <View style={{marginHorizontal:5}}>
                            <Text style={{color:'grey'}} >{item.user.username} {getRatings(item.rate)}</Text>
                            <Text >{item.review}</Text>
                        </View>
                        <View>
                        </View>
            </View>
        )
    }

    const sendReview = () =>{    
        addReview();
        setReviewText("");
        setrate(0);
        ToastAndroid.show("Review Added",2000)
    }

    return loading ? <Loader />: (
        <View style={{flex:1}} >
                <Text style={{fontSize:heightPercentageToDP(3),margin:heightPercentageToDP(2)}}>Reviews</Text>
                <FlatList
                    renderItem={renderReviews}
                    data={data.reviews}
                    extraData={data.reviews}
                />
                <View>
                    <View style={{flexDirection:'row',marginHorizontal:heightPercentageToDP(2),justifyContent:'flex-end'}}>
                        {[1,2,3,4,5].map((r,i) =>{
                            return (<TouchableOpacity  onPress={() => setrate(r)}>
                                    <Icon name={r <= rate ? "star": "star-outline"} fill={r <= rate ? "gold": "grey"} style={{width:25,height:25}} />
                            </TouchableOpacity>)
                        })}
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginHorizontal:heightPercentageToDP(2),}}>
                    <TextInput

                        onChangeText={(e) => setReviewText(e)}
                        multiline
                        style={{fontSize:heightPercentageToDP(2),width:widthPercentageToDP(80)}}
                        placeholder="Write Something about this product"
                    />
                    {response.loading ? <ActivityIndicator size="small"  />:<TouchableOpacity onPress={sendReview}>
                        <Icon name="paper-plane" fill="grey" style={{width:30,height:30}} />
                    </TouchableOpacity>}
                </View>
                </View>
                
        </View>
    )
}
