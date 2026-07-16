import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class Modal extends Component<{ content: HTMLElement }> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container,
    );

    this._content = ensureElement<HTMLElement>(".modal__content", container);

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
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this._content.replaceChildren();
  }

  render(data: { content: HTMLElement }): HTMLElement {
    this._content.replaceChildren(data.content);
    this.open();

    return this.container;
  }
}
