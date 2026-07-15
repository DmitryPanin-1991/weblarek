import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Modal extends Component<{ content: HTMLElement }> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._closeButton = container.querySelector(".modal__close");
    this._content = container.querySelector(".modal__content");

    this.events = events;

    this._closeButton.addEventListener("click", () => {
      this.close();
    });

    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  open(): void {
    this.container.classList.add("modal_active");
    this.events.emit("modal:open");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this._content.replaceChildren();

    this.events.emit("modal:close");
  }

  render(data: { content: HTMLElement }): HTMLElement {
    this._content.replaceChildren(data.content);
    this.open();

    return this.container;
  }

  get isOpen(): boolean {
    return this.container.classList.contains("modal_active");
  }
}
