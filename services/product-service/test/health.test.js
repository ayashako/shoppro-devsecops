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
  assert.equal(body.service, "product-service");
  assert.equal(body.status, "ok");
});
