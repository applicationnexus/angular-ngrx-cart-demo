import { Product } from './product';
import { createSelector } from '@ngrx/store';
export interface State {
  items: Product[];
  cart: Product[];
}

export const products = (state: State) => state.items;
export const cart = (state: State) => state.cart;

// tslint:disable-next-line:no-shadowed-variable
export const selectProducts = createSelector(products, cart, (products: Product[], cart: Product[]) => {
  return products;
});
