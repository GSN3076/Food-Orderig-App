

import { WISHLIST } from "./variables";

const initialState = [];

export default function wishlistReducer(state = initialState, action) {
  const wishlistItem = state.find((item) => item.id === action.productId);
  const wishlistItemIndex = wishlistItem && state.indexOf(wishlistItem);
  switch (action.type) {
    case WISHLIST.ADD_TO_WISHLIST:
      const addedWishlistItem = state.find(
        (item) => item.id === action.product.id
      );
      const addedWishlistItemIndex =
        addedWishlistItem && state.indexOf(addedWishlistItem);
      if (!addedWishlistItem) {
        return [
          ...state,
          {
            ...action.product,
          },
        ];
      } else {
        return [
          ...state.slice(0, addedWishlistItemIndex),
          ...state.slice(addedWishlistItemIndex + 1),
        ];
      }
    case WISHLIST.REMOVE_FROM_WISHLIST:
      return [
        ...state.slice(0, wishlistItemIndex),
        ...state.slice(wishlistItemIndex + 1),
      ];
    default:
      return state;
  }
}
