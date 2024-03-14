const { Router } = require("express");

const CartManager = require(`${__dirname}/../cartManager`);

const cartManager = new CartManager(`${__dirname}/../../assets/carts.json`);

const router = Router();

router.get(`/:cId`, async (req, res) => {
  try {
    const id = +req.params.cId;
    const cart = await cartManager.getCartById(id);
    res.status(200).json({ cart });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.post(`/`, async (req, res) => {
  try {
    const cart = await cartManager.addCart();
    res.status(200).send({ "Carrito creado": cart });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post(`/:cId/product/:pId`, async (req, res) => {
  try {
    const cartId = +req.params.cId;
    const prodId = +req.params.pId;
    const addedProduct = await cartManager.addProductToCart(cartId, prodId);
    res.status(200).send({ "Producto agregado": addedProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put(`/:cId`, async (req, res) => {
  try {
    const id = +req.params.cId;
    const cleanedCart = await cartManager.cleanCart(id);
    res.status(200).send({ cleanedCart });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.delete(`/:cId`, async (req, res) => {
  try {
    const id = +req.params.cId;
    await cartManager.deleteCart(id);
    res.status(200).send("Carrito eliminado exitosamente");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.get(`/`, async (_, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.status(200).send({ carts });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = [router, cartManager];
