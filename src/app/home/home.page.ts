import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { GetItems, AddToCart, RemoveFromCart, IncrementProductCount, DecrementProductCount } from '../store/actions';
import { ToastService } from '../services/toast.service';
import { Product } from '../model/product';
import { AlertController } from '@ionic/angular';
import { EventsService } from '../services/events.service';
import { State, selectProducts } from '../model/state';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  /**
   * Array to store the product details
   */
  products: Product[];
  /**
   * Variable to store the cart size
   */
  cartLength: number;

  // tslint:disable-next-line:max-line-length
  constructor(private store: Store<{ state: State }>, private toastService: ToastService, private alertController: AlertController, private eventsService: EventsService) {
    this.getProducts();
    /**
     * Subscribing the event to update cart count dynamically
     */
    this.eventsService.formRefreshSource$.subscribe((data) => {
      console.log('HomePage -> constructor -> data', data);
      this.getCartDataCount();
    });
  }

  ngOnInit() {
    /**
     * Dispatching the GetItem action to load the products into the store
     * from products.json file
     */
    this.store.dispatch(GetItems());

    this.getCartDataCount();
  }

  /**
   * @description Subscribe the shop store and gets the products
   * @returns void
   */
  getProducts(): void {
    // this.store.pipe()
    this.store
      .pipe(
        select('shop'),
        filter((val) => val !== undefined)
      )
      .subscribe((data) => {
        console.log('HomePage -> getProducts -> data', data);
        // this.products = data['items'];
      });
  }

  /**
   * @description Subscribe to the shot store and gets the cart size
   * @returns void
   */
  getCartDataCount(): void {
    // this.store.pipe(select('shop')).subscribe((data) => {
    //   this.cartLength = data.cart.length;
    // });
  }

  /**
   * @description Adds the product in the cart
   * @param item Product
   * @returns void
   */
  addToCart(item: Product): void {
    /**
     * Setting the initial product count
     */
    item.count = 1;
    /**
     * Setting the actual price of the product
     */
    item.actualPrice = item.price;
    /**
     * Dispatch the AddToCart action to add the product in the cart
     */
    this.store.dispatch(AddToCart({ payload: item }));
    this.eventsService.publishRefresh();
    this.toastService.presentToast('Product added to cart.');
  }

  /**
   * @description Removes product from cart
   * @param item Product details
   * @returns void
   */
  removeFromCart(item: Product): void {
    /**
     * Dispatching the RemoveFromCart action to remove the product from the cart
     */
    this.store.dispatch(RemoveFromCart({ payload: item }));
    this.eventsService.publishRefresh();
    this.toastService.presentToast('Product removed from cart.');
  }

  /**
   * @description Increments the product count in cart
   * @param item Product details
   * @returns void
   */
  incrementCartItem(item: Product): void {
    /**
     * Dispatching the IncrementProductCount action to increment the product count in the cart
     */
    this.store.dispatch(IncrementProductCount({ payload: item }));
  }

  /**
   * @description Decrement product count in cart and if it reaches to one then delete the cart item
   * @param item Product details
   * @returns void
   */
  decrementCartItem(item: Product): void {
    /**
     * If the product quantity is 1 then prompt user to delete the product from cart
     * Else dispatches the DecrementProductCount to decrement the product quantity in the cart
     */
    if (item.count === 1) {
      this.presentConfirm('Cart', 'Are you sure you want to remove the item from cart?', item);
    } else {
      this.store.dispatch(DecrementProductCount({ payload: item }));
    }
  }

  /**
   * @description Prompt user while removing the cart item from cart
   * @param header Header message for alert
   * @param message Message for alert
   * @param item Product details
   * @returns Promise<void>
   */
  async presentConfirm(header: string, message: string, item?: Product): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Okay',
          handler: () => {
            this.removeFromCart(item);
            item.count = 0;
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * @description Returns the complete image url with the image name
   * @param imageName image name
   * @returns string
   */
  getImageUrl(imageName: string): string {
    return `../../assets/images/${imageName}`;
  }
}
