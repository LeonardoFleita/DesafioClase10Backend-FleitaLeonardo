const { Router } = require("express");
const { ProductManager } = require(`${__dirname}/../productManager`);

const router = Router();

const productManager = new ProductManager(
  `${__dirname}/../../assets/products.json`
);

router.get(`/`, async (_, res) => {
  const products = await productManager.getProducts();
  res.render(`index`, {
    title: "Productos",
    products,
    ws: true,
    scripts: ["index.js"],
    css: ["styles.css"],
    endPoint: "Home",
  });
});

router.get(`/realtimeproducts`, async (_, res) => {
  try {
    const products = await productManager.getProducts();
    res.render(`realTimeProducts`, {
      title: "Productos",
      products,
      ws: true,
      scripts: ["realTimeProducts.js"],
      css: ["styles.css"],
      endPoint: "Realtime products",
    });
  } catch (err) {
    throw new Error(err);
  }
});

router.post(`/realtimeproducts`, async (req, res) => {
  try {
    const product = req.body;
    await productManager.addProduct(
      product.title,
      product.description,
      product.price,
      product.thumbnail,
      product.code,
      product.stock,
      product.category,
      product.status
    );
    const products = await productManager.getProducts();
    const addedProduct = products[products.length - 1];
    req.app.get(`ws`).emit(`newProduct`, addedProduct);
    res.status(200).send({ "Producto agregado": addedProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete(`/realtimeproducts/:pId`, async (req, res) => {
  try {
    const pId = +req.params.pId;
    await productManager.deleteProduct(pId);
    req.app.get(`ws`).emit(`deleteProduct`, pId);
    res.status(200).send("Producto eliminado exitosamente");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.post(`/realtimeproducts/delete`, async (req, res) => {
  try {
    let { id } = req.body;
    id = +id;
    await productManager.deleteProduct(id);
    req.app.get(`ws`).emit(`deleteProduct`, id);
    res.status(200).send("Producto eliminado exitosamente");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = [router, productManager];
