/* cart.js — Team 9 Storefront (Shopping Cart)
   Seeds a product catalog, renders a cart UI, shows JSON, and demos AJAX. */

// ----- Catalog you can replace with your own products -----
const catalog = [
  { id: "001", name: "Mens Jeans",        price: 59.99 },
  { id: "004", name: "Womens T-Shirt",    price: 19.99 },
  { id: "101", name: "USB-C Charger 30W", price: 24.50 },
  { id: "205", name: "Water Bottle 20oz", price: 12.00 },
];

// ----- In-memory cart (id -> {id,name,price,qty,total}) -----
const cart = {};

const $ = window.jQuery; // for the demo ajax

// ----- Helpers -----
const fmt = n => `$${Number(n).toFixed(2)}`;
const cartArray = () => Object.values(cart);
const cartTotal = () => cartArray().reduce((s,i)=> s + i.price*i.qty, 0);

// Render the product dropdown
function renderPicker() {
  const sel = document.getElementById("productPicker");
  sel.innerHTML =
    `<option value="" selected disabled>Choose a product</option>` +
    catalog.map(p => `<option value="${p.id}">${p.name} — ${fmt(p.price)}</option>`).join("");
}

// Render the cart rows and totals
function renderCart() {
  const tbody = document.getElementById("cartBody");
  tbody.innerHTML = cartArray().map(item => `
    <tr data-id="${item.id}">
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td class="text-end">${fmt(item.price)}</td>
      <td class="text-center" style="width:120px">
        <input type="number" min="1" class="form-control form-control-sm qty"
               value="${item.qty}">
      </td>
      <td class="text-end">${fmt(item.price * item.qty)}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-danger remove">Remove</button>
      </td>
    </tr>
  `).join("");

  // total
  document.getElementById("cartGrandTotal").textContent = fmt(cartTotal());

  // JSON preview
  const jsonDoc = cartArray().map(i => ({
    productId: i.id,
    productName: i.name,
    price: i.price,
    quantity: i.qty,
    total: Number((i.price * i.qty).toFixed(2))
  }));
  document.getElementById("jsonOutput").textContent = JSON.stringify(jsonDoc, null, 2);

  // wire qty changes & remove buttons
  tbody.querySelectorAll(".qty").forEach(input => {
    input.addEventListener("input", e => {
      const tr = e.target.closest("tr");
      const id = tr.dataset.id;
      const val = Math.max(1, parseInt(e.target.value || "1", 10));
      cart[id].qty = val;
      renderCart();
    });
  });

  tbody.querySelectorAll(".remove").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.closest("tr").dataset.id;
      delete cart[id];
      renderCart();
    });
  });
}

// Add button
function handleAdd() {
  const sel = document.getElementById("productPicker");
  const qtyEl = document.getElementById("addQty");
  const id = sel.value;
  if (!id) return;

  const prod = catalog.find(p => p.id === id);
  const qty = Math.max(1, parseInt(qtyEl.value || "1", 10));

  if (cart[id]) {
    cart[id].qty += qty;
  } else {
    cart[id] = { id: prod.id, name: prod.name, price: prod.price, qty };
  }
  renderCart();
}

// Checkout demo (AJAX echo like your jsFiddle)
function handleCheckout() {
  const payload = {
    email: "demo@storefront.test",                  // placeholder field
    cart: cartArray().map(i => ({
      productId: i.id, productName: i.name,
      price: i.price, quantity: i.qty, total: +(i.price * i.qty).toFixed(2)
    })),
    grandTotal: +cartTotal().toFixed(2)
  };

  // Show locally
  document.getElementById("jsonOutput").textContent = JSON.stringify(payload, null, 2);

  // Demo transport (your real Node API will replace this later)
  $.ajax({
    url: "/echo/json/",
    type: "POST",
    data: { json: JSON.stringify(payload) },
    success: function (response) {
      // echo result also shown
      document.getElementById("jsonOutput").textContent = JSON.stringify(response, null, 2);
    },
    error: function () {
      console.log("AJAX error (demo endpoint may not exist locally).");
    }
  });
}

// Clear cart
function handleClear() {
  Object.keys(cart).forEach(k => delete cart[k]);
  renderCart();
}

// ----- Init -----
document.addEventListener("DOMContentLoaded", () => {
  renderPicker();
  renderCart();

  document.getElementById("btnAdd").addEventListener("click", handleAdd);
  document.getElementById("btnCheckout").addEventListener("click", handleCheckout);
  document.getElementById("btnClear").addEventListener("click", handleClear);
});
