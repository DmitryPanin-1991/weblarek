import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { TPayment } from "../../types";

type TOrderForm = {
  payment: TPayment | null;
  address: string;
};

export class OrderForm extends Form<TOrderForm> {
  protected _paymentButtons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._paymentButtons = Array.from(
      container.querySelectorAll(".button_alt"),
    );

    this._paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this._paymentButtons.forEach((item) => {
          item.classList.remove("button_alt-active");
        });

        button.classList.add("button_alt-active");

        this.events.emit("order.payment:change", {
          payment: button.name,
        });
      });
    });

    this.container.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit("order.address:change", {
        address: target.value,
      });
    });
  }

  reset(): void {
    this._paymentButtons.forEach((button) => {
      button.classList.remove("button_alt-active");
    });
    super.reset();
  }
}
