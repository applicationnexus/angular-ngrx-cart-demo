import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  /**
   * @description Present toast message
   * @param message Message for toast
   * @returns Promise<void>
   */
  async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 1000,
    });
    toast.present();
  }
}
