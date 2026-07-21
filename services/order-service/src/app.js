const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { writeOrderAudit } = require("./audit-store");

const orders = [];
const allowedProducts = new Set([
  "laptop-001",
  "headphones-001",
  "monitor-001"
]);

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json({ limit: "100kb" }));

app.get("/health", (_request, response) => {
  response.status(200).json({
    service: "order-service",
    status: "ok"
  });
});

app.get("/orders", (_request, response) => {
  response.status(200).json(orders);
});

app.post("/orders", async (request, response) => {
  const customerName =
    typeof request.body.customerName === "string"
      ? request.body.customerName.trim()
      : "";
  const productId =
    typeof request.body.productId === "string"
      ? request.body.productId.trim()
      : "";
  const quantity = Number(request.body.quantity);

  if (customerName.length < 2 || customerName.length > 80) {
    response.status(400).json({
      error: "customerName must contain between 2 and 80 characters"
    });
    return;
  }

  if (!allowedProducts.has(productId)) {
    response.status(400).json({
      error: "productId is not valid"
    });
    return;
  }

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    response.status(400).json({
      error: "quantity must be an integer between 1 and 10"
    });
    return;
  }

  const order = {
    id: crypto.randomUUID(),
    customerName,
    productId,
    quantity,
    status: "created",
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  try {
    const audit = await writeOrderAudit(order);
    response.status(201).json({ order, audit });
  } catch (error) {
    console.error("Unable to write order audit record:", error.message);
    response.status(201).json({
      order,
      audit: {
        stored: false,
        reason: "Audit storage is temporarily unavailable"
      }
    });
  }
});

app.use((_request, response) => {
  response.status(404).json({ error: "Route not found" });
});

module.exports = app;
