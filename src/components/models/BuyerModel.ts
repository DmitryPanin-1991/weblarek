import { IBuyer } from "../../types";

export class BuyerModel {
  private data: IBuyer = {
    payment: null,
    address: "",
    email: "",
    phone: "",
  };

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.data.payment = data.payment;
    }

    if (data.address !== undefined) {
      this.data.address = data.address;
    }

    if (data.email !== undefined) {
      this.data.email = data.email;
    }

    if (data.phone !== undefined) {
      this.data.phone = data.phone;
    }
  }

  getData(): IBuyer {
    return this.data;
  }

  validate(): TValidateErrors {
    const errors: TValidateErrors = {};

    if (!this.data.payment) {
      errors.payment = "Выберите способ оплаты";
    }

    if (!this.data.address) {
      errors.address = "Введите адрес";
    }

    if (!this.data.email) {
      errors.email = "Введите email";
    }

    if (!this.data.phone) {
      errors.phone = "Введите телефон";
    }

    return errors;
  }
}