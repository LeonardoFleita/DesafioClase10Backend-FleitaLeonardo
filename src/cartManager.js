const fs = require("fs");

class CartManager {
  static #lastCartId = 0;

  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  async initialize() {
    try {
      const fileCarts = await this.getCarts();
      this.carts = fileCarts;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getCarts() {
    try {
      const fileCarts = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(fileCarts);
    } catch (err) {
      return [];
    }
  }

  async getNewId() {
    try {
      const quantity = this.carts.length;
      if (quantity < 1) {
        CartManager.#lastCartId = 0;
      } else {
        const lastId = this.carts[quantity - 1].id;
        CartManager.#lastCartId = lastId;
      }
      CartManager.#lastCartId++;
      const id = CartManager.#lastCartId;
      return id;
    } catch (err) {
      throw new Error(err);
    }
  }

  async addCart() {
    try {
      const cart = {
        id: await this.getNewId(),
        products: [],
      };
      this.carts.push(cart);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, "\t"),
        "utf-8"
      );
      return cart;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getCartById(cartId) {
    try {
      const findedCart = this.carts.find((c) => c.id === cartId);
      if (!findedCart) {
        throw new Error("No existe un carrito con ese id");
      }
      return findedCart;
    } catch (err) {
      throw Error(err);
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      let findedCart = this.carts.find((c) => c.id === cartId);
      let fileProducts = await fs.promises.readFile(
        `${__dirname}/../assets/products.json`,
        "utf-8"
      );
      let prods = JSON.parse(fileProducts);
      let findedProduct = prods.find((p) => p.id === productId);
      if (!findedCart) {
        throw new Error("No existe ningún carrito con ese Id");
      }
      if (!findedProduct) {
        throw new Error("No existe ningún producto con ese Id");
      }
      let productsInCart = findedCart.products;
      let previousProduct = productsInCart.find((p) => p.id === productId);
      if (!previousProduct) {
        productsInCart.push({ id: productId, quantity: 1 });
      } else {
        let previousQuantity = +previousProduct.quantity;
        let idx = productsInCart.findIndex((p) => p.id === productId);
        productsInCart[idx] = { id: productId, quantity: previousQuantity + 1 };
      }
      const idx = productsInCart.findIndex((p) => p.id === productId);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, "\t"),
        "utf-8"
      );
      return productsInCart[idx];
    } catch (err) {
      throw Error(err);
    }
  }

  async cleanCart(cartId) {
    try {
      const cartIdx = this.carts.findIndex((c) => c.id === cartId);
      if (cartIdx < 0) {
        throw new Error(`No existe ningún carrito con ese id`);
      }
      this.carts[cartIdx] = { id: cartId, products: [] };
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, "\t"),
        "utf-8"
      );
      return this.carts[cartIdx];
    } catch (err) {
      throw Error(err);
    }
  }

  async deleteCart(cartId) {
    try {
      const cartIdx = this.carts.findIndex((c) => c.id === cartId);
      if (cartIdx < 0) {
        throw new Error("No existe ningún carrito con ese id");
      }
      this.carts.splice(cartIdx, 1);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, "\t")
      );
      console.log("Carrito eliminado exitosamente!");
    } catch (err) {
      throw Error(err);
    }
  }
}

module.exports = CartManager;

//Ejecucion

// const execute = async () => {
//   const cartManager = new CartManager(`${__dirname}/../assets/carts.json`);
//   await cartManager.initialize();
//   await cartManager.getCartById(6);
// };

// execute();
