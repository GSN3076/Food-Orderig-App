import { Alert } from "react-native";
import { formatCurrency } from "./utils";

export const checkProductInCart = (cartArr, pid, color) => {
  if (cartArr || cartArr.length > 0) {
    if (color && color !== "") {
      return cartArr.find(
        (item) =>
          item.id === pid && item.selectedColor && item.selectedColor === color
      );
    }
    return cartArr.find((item) => item.id === pid);
  }
};

export const getAvaiableQuantityInCart = (cartArr, pid, quantity) => {
  let arr = cartArr.filter((item) => item.id === pid);
  if (cartArr || cartArr.length > 0) {
    if (arr.length > 0) {
      let result =
        arr.length > 0 &&
        arr.reduce((total, num) => total + num.cartQuantity, 0);
      return result && quantity - result;
    } else {
      return quantity;
    }
  }
  return quantity;
};

export const checkProductInWishList = (wishlistArr, productId) => {
  return wishlistArr.find((item) => item.id === productId);
};

export const calculateTotalPrice = (cartArr, isformatCurrency) => {
  let total = 0;

  cartArr.forEach((item) => (total += ( item.discount ? (( item.price - (item.price * item.discount /100) )  * item.cartQuantity) : (item.price * item.cartQuantity))));

  return isformatCurrency ? formatCurrency(total) : total;

};
export const calculateSubscriptionTotalPrice = (cart, isformatCurrency,discount) => {
  let total = 0;
  if(discount){
    cart.forEach((item) => (total += ((item.price - discount) * item.quantity)))
  }else{
    cart.forEach((item) => (total += item.price *item.quantity));
  }
  return isformatCurrency ? formatCurrency(total) : total;
};

