import { IApi, IProductsResponse, IOrder, IOrderResponse } from "../../types";

export class WebLApi {
  constructor(private api: IApi) {}

  getProducts(): Promise<IProductsResponse> {
    return this.api.get("/product");
  }

  createOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post("/order", order);
  }
}
