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
    for (const item of this.items) {
      if (item.id === id) {
        return item;
      }
    }
    return undefined;
  }

  setPreview(product: IProduct): void {
    this.preview = product;
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}