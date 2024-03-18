const [_, productManager] = require(`../../src/routes/viewsRouter`);
const socket = io();

const del = async (id) => {
  alert(id);
  await productManager.deleteProduct(id);
};

socket.on(`newProduct`, (product) => {
  const container = document.getElementById("productsContainer");
  container.innerHTML += `
     <div class="productCard" id="productCard${product.id}">
     <h3>${product.title}</h3>
     <img src=${product.thumbnail} alt=${product.title} />
     <p style="font-weight: 600">${product.description}</p>
     <p>Categoría: ${product.category}</p>
     <p>Precio: ${product.price}</p>
     <p>Código: ${product.code}</p>
     <p>Stock: ${product.stock}</p>
     <p>Id: ${product.id}</p>
   </div>`;
});

socket.on(`deleteProduct`, (id) => {
  const element = document.getElementById(`productCard${id}`);
  element.remove();
});
