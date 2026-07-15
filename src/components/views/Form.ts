import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Form<T> extends Component<T> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);

    this._submit = container.querySelector('button[type="submit"]');
    this._errors = container.querySelector(".form__errors");

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

  render(state: Partial<T> & { valid: boolean; errors: string }): HTMLElement {
    super.render(state);

    return this.container;
  }

  reset(): void {
    this.container.reset();
  }
}
