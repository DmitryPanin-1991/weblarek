import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductsModel {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit("products:changed");
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getProduct(id: string): IProduct | undefined {
    return this.items.find(function (item) {
      return item.id === id;
    });
  }

  setPreview(product: IProduct): void {
    this.preview = product;
    this.events.emit("preview:changed");
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}
