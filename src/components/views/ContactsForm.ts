import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

type TContactsForm = {
  email: string;
  phone: string;
};

export class ContactsForm extends Form<TContactsForm> {
  protected _email: HTMLInputElement;
  protected _phone: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._email = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container,
    );

    this._phone = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container,
    );

    this.container.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      if (target.name === "email") {
        this.events.emit("contacts.email:change", {
          email: target.value,
        });
      }
      if (target.name === "phone") {
        this.events.emit("contacts.phone:change", {
          phone: target.value,
        });
      }
    });
  }

  set email(value: string) {
    this._email.value = value;
  }

  set phone(value: string) {
    this._phone.value = value;
  }
}
