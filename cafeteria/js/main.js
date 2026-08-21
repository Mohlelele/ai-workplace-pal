const STORAGE_KEYS = {
  cart: "lunchlinx_cart",
  user: "lunchlinx_user",
  orders: "lunchlinx_orders",
};

const MENU_ITEMS = [
  { id: 1, name: "Beef Burger", desc: "Juicy beef patty with lettuce, tomato, and cheese.", price: 55, category: "meals", emoji: "🍔" },
  { id: 2, name: "Grilled Chicken Wrap", desc: "Chicken strips, fresh veggies, and ranch dressing.", price: 48, category: "meals", emoji: "🌯" },
  { id: 3, name: "Veggie Pasta", desc: "Creamy Alfredo pasta with seasonal vegetables.", price: 42, category: "meals", emoji: "🍝" },
  { id: 4, name: "Hot Chips", desc: "Crispy golden fries served with ketchup.", price: 22, category: "snacks", emoji: "🍟" },
  { id: 5, name: "Chicken Wings", desc: "Spicy buffalo wings with dipping sauce.", price: 35, category: "snacks", emoji: "🍗" },
  { id: 6, name: "Garden Salad", desc: "Mixed greens, cucumber, tomato, and vinaigrette.", price: 28, category: "snacks", emoji: "🥗" },
  { id: 7, name: "Soft Drink", desc: "Choice of Coke, Fanta, or Sprite.", price: 18, category: "drinks", emoji: "🥤" },
  { id: 8, name: "Bottled Water", desc: "Still mineral water.", price: 12, category: "drinks", emoji: "💧" },
  { id: 9, name: "Fresh Juice", desc: "Orange or apple juice, freshly squeezed.", price: 25, category: "drinks", emoji: "🧃" },
];

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.cart)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  updateCartBadge();
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.user));
  } catch {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.orders)) || [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
}

function addToCart(itemId) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    const item = MENU_ITEMS.find((m) => m.id === itemId);
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
  showToast("Added to cart");
}

function removeFromCart(itemId) {
  let cart = getCart();
  cart = cart.filter((i) => i.id !== itemId);
  saveCart(cart);
  renderCart();
}

function updateQty(itemId, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === itemId);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    saveCart(cart);
    renderCart();
  }
}

function cartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

function updateCartBadge() {
  const badge = document.querySelector(".cart-badge");
  if (badge) {
    const count = getCart().reduce((sum, i) => sum + i.qty, 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-block" : "none";
  }
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

function renderMenu(category = "all") {
  const grid = document.getElementById("menu-grid");
  if (!grid) return;

  const items = category === "all" ? MENU_ITEMS : MENU_ITEMS.filter((m) => m.category === category);

  grid.innerHTML = items
    .map(
      (item) => `
      <div class="menu-item">
        <div class="menu-item-image">${item.emoji}</div>
        <div class="menu-item-body">
          <div class="menu-item-title">${item.name}</div>
          <div class="menu-item-desc">${item.desc}</div>
          <div class="menu-item-footer">
            <span class="price">R${item.price}</span>
            <button class="btn btn-primary" onclick="addToCart(${item.id})">Add</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!container) return;

  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🛒</div>
        <p>Your cart is empty. <a href="menu.html">Browse the menu</a> to add items.</p>
      </div>
    `;
    if (totalEl) totalEl.textContent = "R0";
    return;
  }

  container.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <div>
          <strong>${item.emoji} ${item.name}</strong>
          <div>R${item.price} each</div>
        </div>
        <div style="display:flex;align-items:center;gap:0.6rem">
          <button class="btn btn-outline" style="padding:0.4rem 0.7rem" onclick="updateQty(${item.id}, -1)">−</button>
          <span style="font-weight:700">${item.qty}</span>
          <button class="btn btn-outline" style="padding:0.4rem 0.7rem" onclick="updateQty(${item.id}, 1)">+</button>
          <button class="btn btn-outline" style="padding:0.4rem 0.7rem;margin-left:0.5rem" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `
    )
    .join("");

  if (totalEl) totalEl.textContent = `R${cartTotal()}`;
}

function placeOrder(event) {
  event.preventDefault();
  const cart = getCart();
  if (cart.length === 0) {
    showToast("Your cart is empty");
    return;
  }

  const user = getUser();
  if (!user) {
    showToast("Please log in first");
    setTimeout(() => (window.location.href = "login.html"), 1000);
    return;
  }

  const pickup = document.getElementById("pickup-time").value;
  if (!pickup) {
    showToast("Please select a pickup time");
    return;
  }

  const order = {
    id: "LL" + Math.floor(1000 + Math.random() * 9000),
    items: cart,
    total: cartTotal(),
    pickup,
    status: "Received",
    createdAt: new Date().toISOString(),
  };

  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);
  saveCart([]);

  window.location.href = `track.html?order=${order.id}`;
}

function renderTrack() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("order");
  const input = document.getElementById("order-id");
  const result = document.getElementById("track-result");

  if (input && orderId) {
    input.value = orderId;
  }

  if (!orderId || !result) return;

  const orders = getOrders();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    result.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <p>Order <strong>${orderId}</strong> not found. Try a valid order number.</p>
      </div>
    `;
    return;
  }

  const statuses = ["Received", "Preparing", "Ready for Pickup", "Completed"];
  const currentIndex = statuses.indexOf(order.status);

  const stepsHtml = statuses
    .map((status, idx) => {
      const state = idx < currentIndex ? "completed" : idx === currentIndex ? "active" : "";
      return `
        <div class="step ${state}">
          <div class="step-dot">${idx + 1}</div>
          <span>${status}</span>
        </div>
      `;
    })
    .join("");

  const itemsHtml = order.items
    .map((item) => `<li>${item.emoji} ${item.name} x${item.qty} — R${item.price * item.qty}</li>`)
    .join("");

  result.innerHTML = `
    <div style="margin-bottom:1.5rem">
      <h3 style="color:var(--brand-blue)">Order ${order.id}</h3>
      <p style="color:var(--muted)">Pickup time: ${order.pickup}</p>
      <p style="color:var(--muted)">Total: <strong style="color:var(--brand-red)">R${order.total}</strong></p>
      <ul style="margin-top:0.75rem;padding-left:1.2rem;color:var(--muted)">${itemsHtml}</ul>
    </div>
    <div class="status-steps">${stepsHtml}</div>
  `;
}

function handleLogin(event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const role = document.getElementById("role").value;

  if (!name || !email) {
    showToast("Please fill in all fields");
    return;
  }

  saveUser({ name, email, role });
  showToast(`Welcome, ${name}!`);
  setTimeout(() => (window.location.href = "menu.html"), 1000);
}

function updateUserGreeting() {
  const user = getUser();
  const el = document.getElementById("user-greeting");
  if (el && user) {
    el.textContent = `Hi, ${user.name} (${user.role})`;
  }
}

function seedDemoOrder() {
  if (getOrders().length === 0) {
    saveOrders([
      {
        id: "LL1001",
        items: [{ id: 1, name: "Beef Burger", price: 55, qty: 1, emoji: "🍔" }],
        total: 55,
        pickup: "12:30",
        status: "Preparing",
        createdAt: new Date().toISOString(),
      },
    ]);
  }
}

function initCategoryTabs() {
  const tabs = document.querySelectorAll(".category-tabs .tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderMenu(tab.dataset.category);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  updateUserGreeting();
  seedDemoOrder();

  if (document.getElementById("menu-grid")) {
    renderMenu();
    initCategoryTabs();
  }

  if (document.get"ElementById("cart-items")) {
    renderCart();
  }

  const orderForm = document.getElementById("order-form");
  if (orderForm) {
    orderForm.addEventListener("submit", placeOrder);
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  const trackBtn = document.getElementById("track-btn");
  if (trackBtn) {
    trackBtn.addEventListener("click", () => {
      const id = document.getElementById("order-id").value.trim();
      if (id) {
        window.location.search = `?order=${encodeURIComponent(id)}`;
      }
    });
  }

  if (document.getElementById("track-result")) {
    renderTrack();
  }
});
