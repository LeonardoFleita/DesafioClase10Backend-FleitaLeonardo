const { Router } = require("express");
const { ProductManager } = require(`${__dirname}/../productManager`);

const productManager = new ProductManager(
  `${__dirname}/../../assets/products.json`
);
const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const limit = +req.query.limit;
    if (!limit || limit < 0) {
      res.status(200).json({ products });
      return;
    }
    const limitedProducts = [];
    for (let i = 0; i < limit; i++) {
      limitedProducts.push(products[i]);
    }
    res.status(200).json({ limitedProducts });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:pId", async (req, res) => {
  try {
    const pId = +req.params.pId;
    const product = await productManager.getProductById(pId);
    res.status(200).json({ product });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.post(`/`, async (req, res) => {
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
    res.status(200).send({ "Producto agregado": addedProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put(`/:pId`, async (req, res) => {
  try {
    const pId = +req.params.pId;
    const newData = req.body;
    await productManager.updateProduct({ ...newData, id: pId });
    const updatedProduct = await productManager.getProductById(pId);
    res.status(200).send({ "Producto actualizado": updatedProduct });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.delete(`/:pId`, async (req, res) => {
  try {
    const pId = +req.params.pId;
    await productManager.deleteProduct(pId);
    res.status(200).send("Producto eliminado exitosamente");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = [router, productManager];
