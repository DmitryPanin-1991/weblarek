import { Card } from "./Card";
import { IEvents } from "../base/Events";

type CatalogCardAction = {
  onClick: () => void;
};

export class CatalogCard extends Card {
  constructor(
    container: HTMLElement,
    events: IEvents,
    action?: CatalogCardAction,
  ) {
    super(container, events);

    if (action) {
      container.addEventListener("click", () => {
        action.onClick();
      });
    }
  }
}
