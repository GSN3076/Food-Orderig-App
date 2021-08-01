import { v4 as uuidv4 } from "uuid";

import { CART } from "./variables";

const initialState = [];

export default function cartReducer(state = initialState, action) {
  const cartItem = state.find((item) => item.cartId === action.cartId);
  const cartItemIndex = cartItem && state.indexOf(cartItem);
  switch (action.type) {
    case CART.ADD_TO_CART:
      if (!action.product.variation || action.product.variation.length === 0) {
        const addedCartItem = state.find(
          (item) => item.id === action.product.id
        );
        const addedCartItemIndex =
          addedCartItem && state.indexOf(addedCartItem);
        if (!addedCartItem) {
          return [
            ...state,
            {
              ...action.product,
              cartQuantity: action.quantity || 1,
              cartId: uuidv4(),
            },
          ];
        } else {
          return [
            ...state.slice(0, addedCartItemIndex),
            {
              ...addedCartItem,
              cartQuantity: action.quantity
                ? addedCartItem.cartQuantity + action.quantity
                : addedCartItem.cartQuantity + 1,
            },
            ...state.slice(addedCartItemIndex + 1),
          ];
        }
      } else {
        if (!action.color || action.color === "") {
          const addedCartItem = state.find(
            (item) => item.id === action.product.id
          );
          const addedCartItemIndex =
            addedCartItem && state.indexOf(addedCartItem);
          if (!addedCartItem) {
            return [
              ...state,
              {
                ...action.product,
                cartQuantity: action.quantity || 1,
                cartId: uuidv4(),
              },
            ];
          } else {
            return [
              ...state.slice(0, addedCartItemIndex),
              {
                ...addedCartItem,
                cartQuantity: action.quantity
                  ? addedCartItem.cartQuantity + action.quantity
                  : addedCartItem.cartQuantity + 1,
              },
              ...state.slice(addedCartItemIndex + 1),
            ];
          }
        } else {
          const addedCartItem = state.find(
            (item) =>
              item.id === action.product.id &&
              item.selectedColor &&
              item.selectedColor === action.color
          );
          const addedCartItemIndex =
            addedCartItem && state.indexOf(addedCartItem);
          if (!addedCartItem) {
            return [
              ...state,
              {
                ...action.product,
                cartQuantity: action.quantity || 1,
                selectedColor: action.color,
                cartId: uuidv4(),
              },
            ];
          } else {
            return [
              ...state.slice(0, addedCartItemIndex),
              {
                ...addedCartItem,
                cartQuantity: action.quantity
                  ? addedCartItem.cartQuantity + action.quantity
                  : addedCartItem.cartQuantity + 1,
              },
              ...state.slice(addedCartItemIndex + 1),
            ];
          }
        }
      }
    case CART.REMOVE_FROM_CART:
      return [
        ...state.slice(0, cartItemIndex),
        ...state.slice(cartItemIndex + 1),
      ];
    case CART.REMOVE_ALL_FROM_CART:
      return [];
    case CART.INCREASE_QUANTITY_CART:
      return [
        ...state.slice(0, cartItemIndex),
        { ...cartItem, cartQuantity: cartItem.cartQuantity + 1 },
        ...state.slice(cartItemIndex + 1),
      ];
    case CART.DECREASE_QUANTITY_CART:
      if (cartItem.cartQuantity < 2) {
        return;
      }
      return [
        ...state.slice(0, cartItemIndex),
        { ...cartItem, cartQuantity: cartItem.cartQuantity - 1 },
        ...state.slice(cartItemIndex + 1),
      ];
    default:
      return state;
  }
}
