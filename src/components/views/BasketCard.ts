import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";

type BasketCardAction = {
  onClick: () => void;
};

export class BasketCard extends Card {
  protected _index: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, action?: BasketCardAction) {
    super(container);

    this._index = ensureElement<HTMLElement>(".basket__item-index", container);
    this._button = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );

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
