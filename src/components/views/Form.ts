import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class Form<T> extends Component<T> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);

    this._submit = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container,
    );
    this._errors = ensureElement<HTMLElement>(".form__errors", container);

    this.events = events;

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });
  }

  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  set errors(value: string) {
    this._errors.textContent = value;
  }
}
