import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { ActionTypes } from './actions';
import { ProductsService } from '../services/products.service';
import { map, exhaustMap } from 'rxjs/operators';

@Injectable()
export class ShopEffects {
  constructor(private actions$: Actions, private productService: ProductsService) {}

  /**
   * @description loadProducts effect to load the product from API if the products are not loaded
   * in the store
   * @returns Observable
   */
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.LoadItems),
      exhaustMap(() =>
        this.productService.getProducts().pipe(
          map(products => {
            return {
              type: ActionTypes.LoadSuccess,
              payload: products,
            };
          })
        )
      )
    )
  );
}
