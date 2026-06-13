import { IProduct } from "../../types";

export class BasketModel {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addProduct(product: IProduct): void {
    if (this.hasProduct(product.id)) {
      return;
    }
    this.items.push(product);
  }

  removeProduct(id: string): void {
    this.items = this.items.filter(function (item) {
      return item.id !== id;
    });
  }

  clear(): void {
    this.items = [];
  }

  getTotalPrice(): number {
    return this.items.reduce(function (sum, item) {
      if (item.price !== null) {
        return sum + item.price;
      }
      return sum;
    }, 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasProduct(id: string): boolean {
    return this.items.some(function (item) {
      return item.id === id;
    });
  }
}