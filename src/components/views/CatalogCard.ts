import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";
import { categoryMap } from "../../utils/constants";

type CatalogCardAction = {
  onClick: () => void;
};

export class CatalogCard extends Card {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  constructor(container: HTMLElement, action?: CatalogCardAction) {
    super(container);

    this._image = ensureElement<HTMLImageElement>(".card__image", container);

    this._category = ensureElement<HTMLElement>(".card__category", container);

    if (action) {
      container.addEventListener("click", () => {
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
}
