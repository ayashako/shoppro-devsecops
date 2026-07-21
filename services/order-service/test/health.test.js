const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../src/app");

test("GET /health returns a successful response", async (t) => {
  const server = app.listen(0);
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.service, "order-service");
  assert.equal(body.status, "ok");
});

test("POST /orders validates the request body", async (t) => {
  const server = app.listen(0);
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      customerName: "",
      productId: "invalid-product",
      quantity: 0
    })
  });

  assert.equal(response.status, 400);
});
