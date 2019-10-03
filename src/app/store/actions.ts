import { Action, createAction, props } from '@ngrx/store';
import { Product } from '../model/product';

/**
 * enum of the actions to be performed in the store
 */
export enum ActionTypes {
  Add = '[Product] Add to cart',
  Increment = '[Product] Increment product count',
  Decrement = '[Product] Decrement product count',
  Remove = '[Product] Remove from cart',
  LoadItems = '[Products] Load items from json file',
  LoadSuccess = '[Products] Load success',
}

/**
 * Action type 'Add' to add the product in the cart
 */
export const AddToCart = createAction(ActionTypes.Add, props<{ payload: Product }>());

/**
 * Action type 'Remove' to remove the product from cart
 */
export const RemoveFromCart = createAction(ActionTypes.Remove, props<{ payload: Product }>());

/**
 * Action type 'Increment' to increment the product quantity in the cart
 */
export const IncrementProductCount = createAction(
  ActionTypes.Increment,
  props<{ payload: Product }>()
);

/**
 * Action type 'Decrement' to decrement the product quantity in the cart
 */
export const DecrementProductCount = createAction(
  ActionTypes.Decrement,
  props<{ payload: Product }>()
);

/**
 * Action type 'LoadSuccess' to indicate the product load success in the store
 */
export const LoadItems = createAction(ActionTypes.LoadSuccess, props<{ payload: Product }>());

/**
 * Action type 'LoadItems' to the load the products in the store
 */
export const GetItems = createAction(ActionTypes.LoadItems);
