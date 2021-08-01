import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { Layout } from '@ui-kitten/components';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import Checkout from '../Checkout/Checkout';
import CheckoutForm from '../Checkout/CheckoutForm';
import PaymentSuccess from '../Checkout/PaymentSuccess';
import SubscrptionCheckout from '../Checkout/SubscrptionCheckout';
import Vendor from '../Vendor/Vendor';
import Cart from './Cart';
import Category from './Category';
import HomeDashboard from './HomeDashboard';
import PlanDetails from './PlanDetails';
import ProductDetail from './ProductDetail';

const HomeStack = createStackNavigator();


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    
    };
  }

  render() {
    return (
      <HomeStack.Navigator headerMode="none"  >
          <HomeStack.Screen name="Dahboard"  >
            {props =><HomeDashboard   {...props} />}
            </HomeStack.Screen>
            <HomeStack.Screen name="ProductDetail"    >
              {props => <ProductDetail  {...props}  />}
            </HomeStack.Screen>
            <HomeStack.Screen name="Cart"    >
              {props => <Cart  {...props}  />}
            </HomeStack.Screen>
            <HomeStack.Screen name="Checkout"    >
              {props => <Checkout  {...props}  />}
            </HomeStack.Screen>
            <HomeStack.Screen name="PlanDetails"    >
              {props => <PlanDetails  {...props}  />}
            </HomeStack.Screen>
            <HomeStack.Screen name="Category"    >
              {props => <Category  {...props}  />}
            </HomeStack.Screen>
            <HomeStack.Screen name="CheckoutForm"    >
              {props => <CheckoutForm  {...props}  />}
            </HomeStack.Screen>
            <HomeStack.Screen name="SubscriptionCheckout"    >
              {props => <SubscrptionCheckout  {...props}  />}
            </HomeStack.Screen>
     </HomeStack.Navigator>
    );
  }
}
