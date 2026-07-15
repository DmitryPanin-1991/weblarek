import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
import { CDN_URL } from "../../utils/constants";
import { categoryMap } from "../../utils/constants";

export class Card extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._title = container.querySelector(".card__title");
    this._image = container.querySelector(".card__image");
    this._price = container.querySelector(".card__price");
    this._category = container.querySelector(".card__category");

    this.events = events;
  }

  set title(value: string) {
    if (!this._title) {
      return;
    }
    this._title.textContent = value;
  }

  set image(value: string) {
    if (!this._image) {
      return;
    }
    this.setImage(this._image, CDN_URL + value, this._title.textContent);
  }

  set price(value: number | null) {
    if (!this._price) {
      return;
    }

    if (value === null) {
      this._price.textContent = "Бесценно";
    } else {
      this._price.textContent = `${value} синапсов`;
    }
  }

  set category(value: string) {
    if (!this._category) {
      return;
    }

    this._category.textContent = value;
    this._category.className = `card__category ${categoryMap[value]}`;
  }
}
