import "./scss/styles.scss";

import { ProductsModel } from "./components/Models/ProductsModel";
import { BasketModel } from "./components/Models/BasketModel";
import { BuyerModel } from "./components/Models/BuyerModel";

import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { WebLApi } from "./components/api/WebLApi";

const productsModel = new ProductsModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

const api = new Api(API_URL);
const webLApi = new WebLApi(api);
webLApi
  .getProducts()
  .then(function (data) {
    console.log("Товары, полученные с сервера: ", data);
  })
  .catch(function (error) {
    console.log("Возникла ошибка при загрузке товаров: ", error);
  });

productsModel.setItems(apiProducts.items);
console.log("Массив всех товаров из каталога: ", productsModel.getItems());

const secondProduct = apiProducts.items[1];
console.log(
  "Товар, найденный по идентификатору: ",
  productsModel.getProduct(secondProduct.id),
);
productsModel.setPreview(secondProduct);
console.log("Выбранный товар: ", productsModel.getPreview());

basketModel.addProduct(apiProducts.items[0]);
basketModel.addProduct(apiProducts.items[2]);
console.log("Корзина после добавления двух товаров: ", basketModel.getItems());
console.log("Количество товаров в корзине: ", basketModel.getCount());
console.log("Стоимость всех товаров в корзине: ", basketModel.getTotalPrice());
basketModel.removeProduct(apiProducts.items[0].id);
console.log(
  "Корзина после удаления одного из товаров: ",
  basketModel.getItems(),
);
basketModel.clear();
console.log("Корзина после очистки: ", basketModel.getItems());

buyerModel.setData({
  payment: "cash",
  address: "Moscow",
  email: "support@yandex-team.ru",
  phone: "+7(495)739-70-00",
});
console.log("Данные покупателя: ", buyerModel.getData());
console.log("Валидация: ", buyerModel.validate());
buyerModel.setData({ payment: null });
console.log(
  "Валидация после того, как убрали способ оплаты: ",
  buyerModel.validate(),
);