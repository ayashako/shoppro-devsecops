const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const products = [
  {
    id: "laptop-001",
    name: "ShopPro Laptop",
    description: "A lightweight laptop for work and study.",
    price: 899.99
  },
  {
    id: "headphones-001",
    name: "Wireless Headphones",
    description: "Noise-isolating headphones with a charging case.",
    price: 129.99
  },
  {
    id: "monitor-001",
    name: "27-inch Monitor",
    description: "A high-resolution monitor for home or office use.",
    price: 249.99
  }
];

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json({ limit: "100kb" }));

app.get("/health", (_request, response) => {
  response.status(200).json({
    service: "product-service",
    status: "ok"
  });
});

app.get("/products", (_request, response) => {
  response.status(200).json(products);
});

app.get("/products/:id", (request, response) => {
  const product = products.find((item) => item.id === request.params.id);

  if (!product) {
    response.status(404).json({ error: "Product not found" });
    return;
  }

  response.status(200).json(product);
});

app.use((_request, response) => {
  response.status(404).json({ error: "Route not found" });
});

module.exports = app;
