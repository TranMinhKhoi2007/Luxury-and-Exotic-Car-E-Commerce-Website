/**
 * APEX MOTORS - Checkout & Order Processing Controller
 * Simulates high-end vehicle acquisition escrow & order creation
 */

const Checkout = {
  init() {
    this.renderOrderSummary();
    this.setupForm();
  },

  /**
   * Render vehicle acquisition list in order summary
   */
  renderOrderSummary() {
    const listContainer = document.getElementById("checkout-order-items");
    const subtotalEl = document.getElementById("checkout-subtotal");
    const discountRow = document.getElementById("checkout-discount-row");
    const discountEl = document.getElementById("checkout-discount");
    const totalEl = document.getElementById("checkout-total");
    const submitBtn = document.getElementById("checkout-submit-btn");
    const emptyNotice = document.getElementById("checkout-empty-notice");

    if (!listContainer) return;

    const items = Cart.getDetailedItems();
    const totals = Cart.getTotals();

    if (items.length === 0) {
      if (emptyNotice) emptyNotice.style.display = "block";
      if (submitBtn) submitBtn.disabled = true;
      listContainer.innerHTML = `
        <div class="empty-checkout-hint">
          <p>Your acquisition list contains no vehicles.</p>
          <a href="shop-grid.html" class="btn btn-sm btn-gold">Select Supercars</a>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = "$0";
      if (totalEl) totalEl.textContent = "$0";
      return;
    }

    if (emptyNotice) emptyNotice.style.display = "none";
    if (submitBtn) submitBtn.disabled = false;

    // Render items list
    listContainer.innerHTML = items.map(item => `
      <div class="checkout-item-row">
        <div class="checkout-item-name">
          <span class="checkout-item-title">${item.car.brand} ${item.car.model}</span>
          <span class="checkout-item-qty">x${item.quantity}</span>
        </div>
        <div class="checkout-item-price">${Products.formatPrice(item.lineTotal)}</div>
      </div>
    `).join("");

    // Totals
    if (subtotalEl) subtotalEl.textContent = Products.formatPrice(totals.subtotal);

    if (discountRow && discountEl) {
      if (totals.discount > 0) {
        discountRow.style.display = "flex";
        discountEl.textContent = `-${Products.formatPrice(totals.discount)} (${totals.coupon.code})`;
      } else {
        discountRow.style.display = "none";
      }
    }

    if (totalEl) totalEl.textContent = Products.formatPrice(totals.total);
  },

  /**
   * Wire validation and order submission
   */
  setupForm() {
    const form = document.getElementById("checkout-billing-form");
    if (!form) return;

    // Real-time error clearing on inputs
    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach(inp => {
      inp.addEventListener("input", () => Validator.clearError(inp));
      inp.addEventListener("change", () => Validator.clearError(inp));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleOrderSubmission(form);
    });
  },

  handleOrderSubmission(form) {
    const items = Cart.getDetailedItems();
    const totals = Cart.getTotals();

    if (items.length === 0) {
      Main.showToast("Cannot place order with an empty acquisition list.", "warning");
      return;
    }

    // Extract fields
    const firstName = form.querySelector("#billing-first-name");
    const lastName = form.querySelector("#billing-last-name");
    const email = form.querySelector("#billing-email");
    const phone = form.querySelector("#billing-phone");
    const country = form.querySelector("#billing-country");
    const city = form.querySelector("#billing-city");
    const address = form.querySelector("#billing-address");
    const postalCode = form.querySelector("#billing-postal");
    const notes = form.querySelector("#billing-notes");
    const paymentRadio = form.querySelector('input[name="payment-method"]:checked');

    let isValid = true;

    if (!Validator.isNotEmpty(firstName.value)) {
      Validator.showError(firstName, "First name is required.");
      isValid = false;
    }

    if (!Validator.isNotEmpty(lastName.value)) {
      Validator.showError(lastName, "Last name is required.");
      isValid = false;
    }

    if (!Validator.isValidEmail(email.value)) {
      Validator.showError(email, "Please provide a valid client email.");
      isValid = false;
    }

    if (!Validator.isValidPhone(phone.value)) {
      Validator.showError(phone, "Please provide a valid phone number.");
      isValid = false;
    }

    if (!Validator.isNotEmpty(country.value)) {
      Validator.showError(country, "Country of residence is required.");
      isValid = false;
    }

    if (!Validator.isNotEmpty(city.value)) {
      Validator.showError(city, "City is required.");
      isValid = false;
    }

    if (!Validator.isNotEmpty(address.value)) {
      Validator.showError(address, "Delivery / Registration address is required.");
      isValid = false;
    }

    if (!Validator.isNotEmpty(postalCode.value)) {
      Validator.showError(postalCode, "Postal code is required.");
      isValid = false;
    }

    if (!isValid) {
      Main.showToast("Please complete all required client information.", "warning");
      const firstError = form.querySelector(".input-error");
      if (firstError) firstError.focus();
      return;
    }

    // Build Demo Order Object
    const orderId = `APX-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderData = {
      orderId,
      createdAt: new Date().toISOString(),
      customer: {
        name: `${firstName.value.trim()} ${lastName.value.trim()}`,
        email: email.value.trim(),
        phone: phone.value.trim(),
        country: country.value.trim(),
        city: city.value.trim(),
        address: address.value.trim(),
        postalCode: postalCode.value.trim(),
        notes: notes ? notes.value.trim() : ""
      },
      paymentMethod: paymentRadio ? paymentRadio.value : "VIP Bank Wire (Demo)",
      items: items.map(i => ({
        id: i.car.id,
        brand: i.car.brand,
        model: i.car.model,
        price: i.car.price,
        quantity: i.quantity,
        lineTotal: i.lineTotal
      })),
      totals: {
        subtotal: totals.subtotal,
        discount: totals.discount,
        couponCode: totals.coupon ? totals.coupon.code : null,
        total: totals.total
      },
      status: "Confirmed (Simulated VIP Reservation)"
    };

    // Save in localStorage
    try {
      const orders = JSON.parse(localStorage.getItem("apex_motors_orders") || "[]");
      orders.push(orderData);
      localStorage.setItem("apex_motors_orders", JSON.stringify(orders));
    } catch (e) {
      console.error("Error storing order", e);
    }

    // Clear Shopping Cart
    Cart.clearCart();

    // Show Confirmation Modal
    this.showConfirmationModal(orderData);
  },

  /**
   * Display Confirmation Receipt Dialog
   * @param {Object} order 
   */
  showConfirmationModal(order) {
    let modal = document.getElementById("order-confirmation-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "order-confirmation-modal";
      modal.className = "apex-modal-overlay";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="apex-modal-dialog order-confirm-dialog">
        <div class="order-confirm-badge">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <div class="order-confirm-header">
          <h3>Supercar Reservation Confirmed</h3>
          <p class="order-subtitle">Reservation Reference: <strong>${order.orderId}</strong></p>
          <div class="demo-disclaimer-box">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>DEMO NOTICE: This is a simulated luxury vehicle order. No real money has been charged or vehicle contract executed.</span>
          </div>
        </div>

        <div class="order-receipt-body">
          <div class="receipt-section">
            <h4>Client Information</h4>
            <div class="receipt-grid">
              <div><strong>Client:</strong> ${order.customer.name}</div>
              <div><strong>Email:</strong> ${order.customer.email}</div>
              <div><strong>Phone:</strong> ${order.customer.phone}</div>
              <div><strong>Destination:</strong> ${order.customer.city}, ${order.customer.country}</div>
            </div>
          </div>

          <div class="receipt-section">
            <h4>Acquired Vehicles</h4>
            <div class="receipt-items-table">
              ${order.items.map(item => `
                <div class="receipt-item-row">
                  <span>${item.brand} ${item.model} (x${item.quantity})</span>
                  <span>${Products.formatPrice(item.lineTotal)}</span>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="receipt-section receipt-total-section">
            <div class="receipt-total-row">
              <span>Subtotal:</span>
              <span>${Products.formatPrice(order.totals.subtotal)}</span>
            </div>
            ${order.totals.discount > 0 ? `
              <div class="receipt-total-row text-gold">
                <span>Incentive (${order.totals.couponCode}):</span>
                <span>-${Products.formatPrice(order.totals.discount)}</span>
              </div>
            ` : ''}
            <div class="receipt-total-row receipt-grand-total">
              <span>Grand Total:</span>
              <span>${Products.formatPrice(order.totals.total)}</span>
            </div>
          </div>
        </div>

        <div class="order-confirm-footer">
          <button type="button" class="btn btn-outline" onclick="window.print()">
            <i class="fa-solid fa-print"></i> Print Dossier
          </button>
          <a href="index.html" class="btn btn-gold">
            Return to Showroom
          </a>
        </div>
      </div>
    `;

    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("checkout-billing-form")) {
    Checkout.init();
  }
});
