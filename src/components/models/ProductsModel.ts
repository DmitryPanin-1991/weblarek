import { IProduct } from "../../types";

export class ProductsModel {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this.items = items;
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
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}