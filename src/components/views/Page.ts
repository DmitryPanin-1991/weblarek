import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

type TPage = {
  counter: number;
  gallery: HTMLElement[];
};

export class Page extends Component<TPage> {
  protected _counter: HTMLElement;
  protected _gallery: HTMLElement;
  protected _basketButton: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._counter = container.querySelector(".header__basket-counter");
    this._gallery = container.querySelector(".gallery");
    this._basketButton = container.querySelector(".header__basket");

    this.events = events;

    this._basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this._counter.textContent = String(value);
  }

  set gallery(items: HTMLElement[]) {
    this._gallery.replaceChildren(...items);
  }
}
