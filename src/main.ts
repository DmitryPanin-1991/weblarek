import "./scss/styles.scss";

import { IProduct } from "./types";
import { IOrder } from "./types";

import { ProductsModel } from "./components/models/ProductsModel";
import { BasketModel } from "./components/models/BasketModel";
import { BuyerModel } from "./components/models/BuyerModel";

import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
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
import { ensureElement } from "./utils/utils";
import { cloneTemplate } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";

const events = new EventEmitter();

const productsModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);
const header = new Header(ensureElement<HTMLElement>(".header"), events);
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const modalContainer = ensureElement<HTMLElement>("#modal-container");
const modal = new Modal(modalContainer);
const basket = new Basket(cloneTemplate<HTMLElement>("#basket"), events);
const orderForm = new OrderForm(
  cloneTemplate<HTMLFormElement>("#order"),
  events,
);
const contactsForm = new ContactsForm(
  cloneTemplate<HTMLFormElement>("#contacts"),
  events,
);
const preview = new PreviewCard(cloneTemplate<HTMLElement>("#card-preview"), {
  onClick: () => {
    events.emit("preview:button");
  },
});
const success = new Success(cloneTemplate<HTMLElement>("#success"), {
  onClick: () => {
    modal.close();
  },
});

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
  header.counter = basketModel.getCount();
  updateBasket();
});

function updateBasket() {
  const cards = basketModel.getItems().map((item, index) => {
    const card = new BasketCard(cloneTemplate<HTMLElement>("#card-basket"), {
      onClick: () => {
        events.emit("basket:remove", item);
      },
    });

    card.index = index + 1;

    return card.render(item);
  });

  basket.items = cards;
  basket.total = basketModel.getTotalPrice();
  basket.disabled = basketModel.getCount() === 0;
}

function updateForms() {
  const buyer = buyerModel.getData();
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
  orderForm.render({
    payment: buyer.payment,
    address: buyer.address,
  });

  const contactsErrors: string[] = [];

  if (errors.email) {
    contactsErrors.push(errors.email);
  }

  if (errors.phone) {
    contactsErrors.push(errors.phone);
  }

  contactsForm.valid = contactsErrors.length === 0;
  contactsForm.errors = contactsErrors.join("; ");
  contactsForm.render({
    email: buyer.email,
    phone: buyer.phone,
  });
}

events.on("basket:open", () => {
  modal.render({
    content: basket.render(),
  });
});

events.on("basket:order", () => {
  modal.render({
    content: orderForm.render(),
  });
});

events.on<IProduct>("basket:remove", (product) => {
  basketModel.removeProduct(product.id);
});

events.on("products:changed", () => {
  const cards = productsModel.getItems().map((item) => {
    const card = new CatalogCard(cloneTemplate<HTMLElement>("#card-catalog"), {
      onClick: () => {
        events.emit("card:select", item);
      },
    });
    return card.render(item);
  });
  gallery.items = cards;
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
  updateForms();
});

updateForms();

events.on("preview:button", () => {
  const product = productsModel.getPreview();
  if (!product) {
    return;
  }
  if (basketModel.hasProduct(product.id)) {
    events.emit("basket:remove", product);
  } else {
    events.emit("basket:add", product);
  }
  modal.close();
});

events.on("preview:changed", () => {
  const product = productsModel.getPreview();

  if (!product) {
    return;
  }

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
    content: contactsForm.render(),
  });
});

events.on("contacts:submit", () => {
  const buyer = buyerModel.getData();

  if (!buyer.payment) {
    return;
  }

  const order: IOrder = {
    payment: buyer.payment,
    address: buyer.address,
    email: buyer.email,
    phone: buyer.phone,
    items: basketModel.getItems().map((item) => item.id),
    total: basketModel.getTotalPrice(),
  };

  webLApi
    .createOrder(order)
    .then((result) => {
      success.total = result.total;
      modal.render({
        content: success.render(),
      });
      basketModel.clear();
      buyerModel.clear();
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
