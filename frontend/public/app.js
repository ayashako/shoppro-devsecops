const config = window.SHOPPRO_CONFIG;
const productsElement = document.getElementById("products");
const productSelect = document.getElementById("product-id");
const statusElement = document.getElementById("status");
const orderForm = document.getElementById("order-form");
const orderResult = document.getElementById("order-result");

async function loadProducts() {
  try {
    const response = await fetch(`${config.productApiUrl}/products`);

    if (!response.ok) {
      throw new Error(`Product service returned ${response.status}`);
    }

    const products = await response.json();

    productsElement.replaceChildren();
    productSelect.replaceChildren();

    for (const product of products) {
      const card = document.createElement("article");
      card.className = "product-card";

      const title = document.createElement("h3");
      title.textContent = product.name;

      const description = document.createElement("p");
      description.textContent = product.description;

      const price = document.createElement("p");
      price.className = "price";
      price.textContent = `€${product.price.toFixed(2)}`;

      card.append(title, description, price);
      productsElement.append(card);

      const option = document.createElement("option");
      option.value = product.id;
      option.textContent = `${product.name} — €${product.price.toFixed(2)}`;
      productSelect.append(option);
    }

    statusElement.textContent = "Services available";
  } catch (error) {
    statusElement.textContent = "Unable to reach product service";
    productsElement.textContent = error.message;
  }
}

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  orderResult.textContent = "Submitting order…";

  const payload = {
    customerName: document.getElementById("customer-name").value.trim(),
    productId: productSelect.value,
    quantity: Number(document.getElementById("quantity").value)
  };

  try {
    const response = await fetch(`${config.orderApiUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `Order service returned ${response.status}`);
    }

    orderResult.textContent = JSON.stringify(result, null, 2);
    orderForm.reset();
  } catch (error) {
    orderResult.textContent = error.message;
  }
});

loadProducts();
