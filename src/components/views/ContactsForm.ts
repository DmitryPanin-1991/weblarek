import { Form } from "./Form";
import { IEvents } from "../base/Events";

type TContactsForm = {
  email: string;
  phone: string;
};

export class ContactsForm extends Form<TContactsForm> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

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
}
