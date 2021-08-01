export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';

import { WISHLIST } from "./variables";

import { CART } from "./variables";

export const addToCart = (product, quantity, color) => ({
  type: CART.ADD_TO_CART,
  product,
  quantity,
  color,
});

export const removeFromCart = (cartId) => ({
  type: CART.REMOVE_FROM_CART,
  cartId,
});

export const removeAllFromCart = () => ({
  type: CART.REMOVE_ALL_FROM_CART,
});

export const decreaseQuantityCart = (cartId) => ({
  type: CART.DECREASE_QUANTITY_CART,
  cartId,
});

export const increaseQuantityCart = (cartId) => ({
  type: CART.INCREASE_QUANTITY_CART,
  cartId,
});


export const addToWishlist = (product) => ({
  type: WISHLIST.ADD_TO_WISHLIST,
  product,
});

export const removeFromWishlist = (productId) => ({
  type: WISHLIST.REMOVE_FROM_WISHLIST,
  productId,
});


export const loginUser = (data) => ({
    type: USER_LOGIN,
    payload:data
});

export const logoutUser = (data) => ({
    type: USER_LOGOUT,
    payload:data
});






