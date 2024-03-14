const express = require("express");
const handlebars = require("express-handlebars");
const [productsRouter, productManager] = require(`./routes/productsRouter`);
const [cartsRouter, cartManager] = require(`./routes/cartsRouter`);
const { Server } = require("socket.io");
const [
  viewsRouter,
  viewsProductManager,
] = require(`${__dirname}/routes/viewsRouter`);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/../public`));

app.engine(`handlebars`, handlebars.engine());
app.set(`views`, `${__dirname}/views`);
app.set(`view engine`, `handlebars`);

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use(`/`, viewsRouter);

const httpServer = app.listen(8080, () => {
  console.log("Servidor listo");
});

const wsServer = new Server(httpServer);

app.set(`ws`, wsServer);

const execute = async () => {
  try {
    await productManager.initialize();
    await cartManager.initialize();
    await viewsProductManager.initialize();
    wsServer.on(`connection`, (socket) => {
      console.log(`Nuevo usuario conectado, id: `, socket.id);
    });
  } catch (err) {
    console.error(err);
  }
};

execute();
