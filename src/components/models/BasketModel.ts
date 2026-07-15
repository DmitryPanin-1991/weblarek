import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketModel {
  private items: IProduct[] = [];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addProduct(product: IProduct): void {
    if (this.hasProduct(product.id)) {
      return;
    }
    this.items.push(product);
    this.events.emit("basket:changed");
  }

  removeProduct(id: string): void {
    this.items = this.items.filter(function (item) {
      return item.id !== id;
    });
    this.events.emit("basket:changed");
  }

  clear(): void {
    this.items = [];
    this.events.emit("basket:changed");
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
