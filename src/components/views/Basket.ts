import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

type TBasket = {
  items: HTMLElement[];
  total: number;
};

export class Basket extends Component<TBasket> {
  protected _list: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._list = container.querySelector(".basket__list");
    this._price = container.querySelector(".basket__price");
    this._button = container.querySelector(".basket__button");

    this.events = events;

    this._button.addEventListener("click", () => {
      this.events.emit("basket:order");
    });
  }

  set items(items: HTMLElement[]) {
    this._list.replaceChildren(...items);
  }

  set total(value: number) {
    this._price.textContent = `${value} синапсов`;
  }

  set disabled(value: boolean) {
    this._button.disabled = value;
  }
}
