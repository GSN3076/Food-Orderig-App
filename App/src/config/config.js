import PushNotification from "react-native-push-notification"
export const API_URL = "http://192.168.250.155:1337"


export const RAZORPAY_KEY_ID = "";
export const RAZORPAY_SECRET_KEY = ""

export const sendPushNotification = async (data,token) =>{
    const FIREBASE_API_KEY = ""
    const message = {
      registration_ids: [token],
      // registration_ids:[],
      notification: {
        title: data.title,
        body: data.body,
        vibrate: 5,
        sound: 10,
        show_in_foreground: true,
        priority: "high",
        importance: "max",
        content_available: true,
      },
      data:{
          "Success":true
      }
    }
    let headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "key=" + FIREBASE_API_KEY,
    })
    let response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers,
      body: JSON.stringify(message),
    })
    response = await response.json()
    return response
  }