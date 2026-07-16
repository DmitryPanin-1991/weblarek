import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { ensureAllElements } from "../../utils/utils";
import { TPayment } from "../../types";

type TOrderForm = {
  payment: TPayment | null;
  address: string;
};

export class OrderForm extends Form<TOrderForm> {
  protected _paymentButtons: HTMLButtonElement[];
  protected _address: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._paymentButtons = ensureAllElements<HTMLButtonElement>(
      ".button_alt",
      container,
    );

    this._address = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container,
    );

    this._paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
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

  set address(value: string) {
    this._address.value = value;
  }

  set payment(value: TPayment | null) {
    this._paymentButtons.forEach((button) => {
      button.classList.toggle("button_alt-active", button.name === value);
    });
  }
}
