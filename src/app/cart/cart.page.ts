import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Product } from '../model/product';
import { RemoveFromCart, IncrementProductCount, DecrementProductCount } from '../store/actions';
import { AlertController } from '@ionic/angular';
import { ToastService } from '../services/toast.service';
import { State, selectProducts } from '../model/state';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  /**
   * Array to store the products
   */
  cart: Array<Product> = [];
  /**
   * Variable to store the total cart price
   */
  totalPrice = 0;

  // tslint:disable-next-line:max-line-length
  constructor(private store: Store<{ state: State }>, private events: EventsService, private toastService: ToastService, private alertController: AlertController) {}

  ngOnInit() {
    this.getCartItems();
  }

  /**
   * @description Update total price of cart
   * @param price Price of item
   * @param status increment/decrement
   * @returns void
   */
  updateTotalPrice(price: number, status: string): void {
    status === 'increment' ? (this.totalPrice += price) : (this.totalPrice -= price);
  }

  /**
   * @description Gets cart items and calculate the total price
   * @returns void
   */
  getCartItems(): void {
    this.store.pipe(select(selectProducts)).subscribe((data) => {
      this.cart = data['cart'];
      this.totalPrice = 0;
      this.cart.map((item) => (this.totalPrice += item.price));
    });
  }

  /**
   * @description Removes the product from cart
   * @param item Product details
   * @returns void
   */
  removeFromCart(item: Product): void {
    this.store.dispatch(RemoveFromCart({ payload: item }));
    this.events.publishRefresh();
    this.toastService.presentToast('Product removed from cart.');
  }

  /**
   * @description Increments product count in cart
   * @param item Product details
   * @returns void
   */
  incrementCartItem(item: Product): void {
    this.updateTotalPrice(item.actualPrice, 'increment');
    this.store.dispatch(IncrementProductCount({ payload: item }));
  }

  /**
   * @description Decrements the product count in cart and if it reaches to one and
   *  then delete the cart item
   * @param item Product details
   * @returns void
   */
  decrementCartItem(item: Product, index: number): void {
    /**
     * If the product quantity count is 1
     * then prompts the user to remove the product from cart
     * else decrement the product quantity and update the total cart price
     */
    if (item.count === 1) {
      this.presentConfirm('Cart', 'Are you sure you want to remove the item from cart?', index, item);
    } else {
      this.updateTotalPrice(item.actualPrice, 'decrement');
      this.store.dispatch(DecrementProductCount({ payload: item }));
    }
  }

  /**
   * @description Prompts the user while removing the cart item from cart
   * @param header Header message for alert
   * @param message Message for alert
   * @param item Product details
   * @returns Promise<void>
   */
  async presentConfirm(header: string, message: string, index: number, item?: Product): Promise<void> {
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
            this.cart.slice(index, 1);
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
