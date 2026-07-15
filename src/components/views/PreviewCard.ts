import { Card } from "./Card";
import { IEvents } from "../base/Events";

type PreviewCardAction = {
  onClick: () => void;
};

export class PreviewCard extends Card {
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    events: IEvents,
    action?: PreviewCardAction,
  ) {
    super(container, events);

    this._description = container.querySelector(".card__text");
    this._button = container.querySelector(".card__button");

    if (action) {
      this._button.addEventListener("click", () => {
        action.onClick();
      });
    }
  }
  set description(value: string) {
    this._description.textContent = value;
  }

  set button(value: string) {
    this._button.textContent = value;
  }

  set disabled(value: boolean) {
    this._button.disabled = value;
  }
}
