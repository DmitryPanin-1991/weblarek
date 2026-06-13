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
    const newItems: IProduct[] = [];
    for (const item of this.items) {
      if (item.id !== id) {
        newItems.push(item);
      }
    }
    this.items = newItems;
  }

  clear(): void {
    this.items = [];
  }

  getTotalPrice(): number {
    let total = 0;
    for (const item of this.items) {
      if (item.price !== null) {
        total += item.price;
      }
    }
    return total;
  }

  getCount(): number {
    return this.items.length;
  }

  hasProduct(id: string): boolean {
    for (const item of this.items) {
      if (item.id === id) {
        return true;
      }
    }
    return false;
  }
}