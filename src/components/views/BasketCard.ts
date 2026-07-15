import { Card } from "./Card";
import { IEvents } from "../base/Events";

type BasketCardAction = {
  onClick: () => void;
};

export class BasketCard extends Card {
  protected _index: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    events: IEvents,
    action?: BasketCardAction,
  ) {
    super(container, events);

    this._index = container.querySelector(".basket__item-index");
    this._button = container.querySelector(".basket__item-delete");

    if (action) {
      this._button.addEventListener("click", () => {
        action.onClick();
      });
    }
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }
}
