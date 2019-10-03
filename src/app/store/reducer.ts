import { ActionTypes } from './actions';
import { Product } from '..//model/product';
import { State } from '../model/state';

/**
 * Initial state of the store
 */
export const initialState: State = {
  items: [],
  cart: [],
};

export function ShopReducer(
  /**
   * Initializing the state
   */
  state: State = initialState,
  action: any
) {
  switch (action.type) {
    /**
     * Add the product in the cart received in the payload and
     * returns the updated state
     */
    case ActionTypes.Add:
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };

    /**
     * Remove the product from the cart based on product name received in the payload
     * and returns the updated state
     */
    case ActionTypes.Remove:
      return {
        ...state,
        cart: [...state.cart.filter(item => item.name !== action.payload.name)],
      };

    /**
     * Increments the product quantity and returns the updated state
     */
    case ActionTypes.Increment:
      return incrementProduct(state, action.payload);

    /**
     * Decrements the product quantity and returns the updated state
     */
    case ActionTypes.Decrement:
      return decrementProduct(state, action.payload);

    /**
     * Returns the product list received in the payload on action 'LoadSuccess'
     */
    case ActionTypes.LoadSuccess:
      return {
        ...state,
        items: [...action.payload],
      };

    default:
      return state;
  }
}

/**
 * @description Map the payload item with cart items and increment item count and
 * update the price accordingly
 * @param state Object of items and cart items
 * @param payload Payload item
 * @returns State
 */
function incrementProduct(state: State, payload: Product): State {
  state.cart.map((item: Product) => {
    if (item.id === payload.id) {
      item.count++;
      item.price = item.actualPrice * item.count;
    }
  });
  return state;
}

/**
 * @description Map the payload item with cart items and decrement item
 * count and update the price accordingly
 * @param state Object of items and cart items
 * @param payload Payload item
 * @returns State
 */
function decrementProduct(state: State, payload: Product): State {
  state.cart.map((item: Product) => {
    if (item.id === payload.id) {
      item.count--;
      item.price -= item.actualPrice;
    }
  });

  return state;
}
