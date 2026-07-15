import "./scss/styles.scss";

import { IProduct } from "./types";
import { IOrder } from "./types";

import { ProductsModel } from "./components/Models/ProductsModel";
import { BasketModel } from "./components/Models/BasketModel";
import { BuyerModel } from "./components/Models/BuyerModel";

import { Page } from "./components/views/Page";
import { Modal } from "./components/views/Modal";
import { CatalogCard } from "./components/views/CatalogCard";
import { PreviewCard } from "./components/views/PreviewCard";
import { BasketCard } from "./components/views/BasketCard";
import { Basket } from "./components/views/Basket";
import { OrderForm } from "./components/views/OrderForm";
import { ContactsForm } from "./components/views/ContactsForm";
import { Success } from "./components/views/Success";

import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { WebLApi } from "./components/api/WebLApi";
import { EventEmitter } from "./components/base/Events";

const events = new EventEmitter();

const productsModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);
const page = new Page(document.body, events);
const modalContainer = document.querySelector("#modal-container");

if (!modalContainer) {
  throw new Error("Не найден контейнер модального окна");
}

const modal = new Modal(modalContainer, events);
const catalogTemplate = document.querySelector(
  "#card-catalog",
) as HTMLTemplateElement;
const previewTemplate = document.querySelector(
  "#card-preview",
) as HTMLTemplateElement;
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const basketCardTemplate = document.querySelector(
  "#card-basket",
) as HTMLTemplateElement;
const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
  "#contacts",
) as HTMLTemplateElement;
const basketElement = basketTemplate.content.firstElementChild;
if (!basketElement) {
  throw new Error("Не найден шаблон корзины");
}
const basket = new Basket(basketElement.cloneNode(true) as HTMLElement, events);
const orderElement = orderTemplate.content.firstElementChild;

if (!orderElement) {
  throw new Error("Не найден шаблон формы заказа");
}

const orderForm = new OrderForm(
  orderElement.cloneNode(true) as HTMLFormElement,
  events,
);

const contactsElement = contactsTemplate.content.firstElementChild;

if (!contactsElement) {
  throw new Error("Не найден шаблон формы контактов");
}

const contactsForm = new ContactsForm(
  contactsElement.cloneNode(true) as HTMLFormElement,
  events,
);

let basketOpen = false;

const successTemplate = document.querySelector(
  "#success",
) as HTMLTemplateElement;

const api = new Api(API_URL);
const webLApi = new WebLApi(api);

events.on<IProduct>("card:select", (product) => {
  productsModel.setPreview(product);
});

events.on<IProduct>("basket:add", (product) => {
  basketModel.addProduct(product);
  modal.close();
});

events.on("basket:changed", () => {
  const count = basketModel.getCount();
  page.counter = count;
  if (modal.isOpen && basketOpen) {
    renderBasket();
  }
});

function renderBasket() {
  const template = basketCardTemplate.content.firstElementChild;

  if (!template) {
    return;
  }

  const cards = basketModel.getItems().map((item, index) => {
    const card = new BasketCard(
      template.cloneNode(true) as HTMLElement,
      events,
      {
        onClick: () => {
          events.emit("basket:remove", item);
        },
      },
    );

    card.index = index + 1;

    return card.render(item);
  });

  basket.items = cards;
  basket.total = basketModel.getTotalPrice();
  basket.disabled = basketModel.getCount() === 0;

  modal.render({
    content: basket.render(),
  });
}

events.on("basket:open", () => {
  basketOpen = true;
  renderBasket();
});

events.on("basket:order", () => {
  basketOpen = false;
  modal.render({
    content: orderForm.render({
      valid: false,
      errors: "",
    }),
  });
});

events.on<IProduct>("basket:remove", (product) => {
  basketModel.removeProduct(product.id);
});

events.on("products:changed", () => {
  const template = catalogTemplate.content.firstElementChild;
  if (!template) {
    return;
  }

  const cards = productsModel.getItems().map((item) => {
    const card = new CatalogCard(
      template.cloneNode(true) as HTMLElement,
      events,
      {
        onClick: () => {
          events.emit("card:select", item);
        },
      },
    );
    return card.render(item);
  });
  page.gallery = cards;
});

events.on("order.payment:change", (data) => {
  buyerModel.setData({
    payment: data.payment,
  });
});

events.on("order.address:change", (data) => {
  buyerModel.setData({
    address: data.address,
  });
});

events.on("contacts.email:change", (data) => {
  buyerModel.setData({
    email: data.email,
  });
});

events.on("contacts.phone:change", (data) => {
  buyerModel.setData({
    phone: data.phone,
  });
});

events.on("buyer:changed", () => {
  const errors = buyerModel.validate();
  const orderErrors: string[] = [];
  if (errors.payment) {
    orderErrors.push(errors.payment);
  }
  if (errors.address) {
    orderErrors.push(errors.address);
  }
  orderForm.valid = orderErrors.length === 0;
  orderForm.errors = orderErrors.join("; ");
  const contactsErrors: string[] = [];
  if (errors.email) {
    contactsErrors.push(errors.email);
  }
  if (errors.phone) {
    contactsErrors.push(errors.phone);
  }
  contactsForm.valid = contactsErrors.length === 0;
  contactsForm.errors = contactsErrors.join("; ");
});

events.on("preview:changed", () => {
  const product = productsModel.getPreview();

  if (!product) {
    return;
  }

  const template = previewTemplate.content.firstElementChild;

  if (!template) {
    return;
  }

  const preview = new PreviewCard(
    template.cloneNode(true) as HTMLElement,
    events,
    {
      onClick: () => {
        if (basketModel.hasProduct(product.id)) {
          events.emit("basket:remove", product);
        } else {
          events.emit("basket:add", product);
        }
      },
    },
  );

  const inBasket = basketModel.hasProduct(product.id);
  if (product.price === null) {
    preview.button = "Недоступно";
    preview.disabled = true;
  } else if (inBasket) {
    preview.button = "Удалить из корзины";
    preview.disabled = false;
  } else {
    preview.button = "В корзину";
    preview.disabled = false;
  }

  modal.render({
    content: preview.render(product),
  });
});

events.on("order:submit", () => {
  modal.render({
    content: contactsForm.render({
      valid: false,
      errors: "",
    }),
  });
});

events.on("contacts:submit", () => {
  const order: IOrder = {
    ...buyerModel.getData(),
    items: basketModel.getItems().map((item) => item.id),
    total: basketModel.getTotalPrice(),
  };

  webLApi
    .createOrder(order)
    .then((result) => {
      const successElement = successTemplate.content.firstElementChild;
      if (!successElement) {
        return;
      }
      const success = new Success(
        successElement.cloneNode(true) as HTMLElement,
        {
          onClick: () => {
            modal.close();
          },
        },
      );
      success.total = result.total;
      modal.render({
        content: success.render(),
      });

      basketModel.clear();
      buyerModel.clear();
      orderForm.reset();
      contactsForm.reset();
    })
    .catch((error) => {
      console.error("Ошибка оформления заказа:", error);
    });
});

webLApi
  .getProducts()
  .then((data) => {
    productsModel.setItems(data.items);
  })
  .catch(function (error) {
    console.error("Возникла ошибка при загрузке товаров: ", error);
  });
