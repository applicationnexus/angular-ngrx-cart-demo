import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private httpClient: HttpClient) {}

  /**
   * @description Http call to get the products fro the products.json file
   * @returns Observable<Product[]>
   */
  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>('../../assets/data/products.json');
  }
}
