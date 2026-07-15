import { Component } from "../base/Component";

type SuccessAction = {
  onClick: () => void;
};

export class Success extends Component<{ total: number }> {
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions: SuccessAction) {
    super(container);

    this._description = container.querySelector(".order-success__description");
    this._button = container.querySelector(".order-success__close");

    this._button.addEventListener("click", () => {
      actions.onClick();
    });
  }

  set total(value: number) {
    this._description.textContent = `Списано ${value} синапсов`;
  }
}
