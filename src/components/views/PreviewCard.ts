import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";
import { categoryMap } from "../../utils/constants";

type PreviewCardAction = {
  onClick: () => void;
};

export class PreviewCard extends Card {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, action?: PreviewCardAction) {
    super(container);

    this._image = ensureElement<HTMLImageElement>(".card__image", container);

    this._category = ensureElement<HTMLElement>(".card__category", container);

    this._description = ensureElement<HTMLElement>(".card__text", container);

    this._button = ensureElement<HTMLButtonElement>(".card__button", container);

    if (action) {
      this._button.addEventListener("click", () => {
        action.onClick();
      });
    }
  }

  set image(value: string) {
    this.setImage(this._image, CDN_URL + value);
  }

  set category(value: string) {
    this._category.textContent = value;
    this._category.className = `card__category ${categoryMap[value]}`;
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
