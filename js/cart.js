/**
 * APEX MOTORS - Shopping Cart Engine
 * Manages cart state with client-side localStorage persistence
 */

const Cart = {
  STORAGE_KEY: "apex_motors_cart",
  COUPON_STORAGE_KEY: "apex_motors_coupon",

  /**
   * Get raw cart items from localStorage
   * @returns {Array<{carId: string, quantity: number, addedAt: number}>}
   */
  getItems() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading cart from localStorage", e);
      return [];
    }
  },

  /**
   * Save items array to localStorage and dispatch update event
   * @param {Array} items 
   */
  saveItems(items) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent("apex:cartUpdated", { detail: { cart: items } }));
    } catch (e) {
      console.error("Error saving cart to localStorage", e);
    }
  },

  /**
   * Add a car to cart
   * @param {string} carId 
   * @param {number} quantity 
   * @returns {{success: boolean, item: Object, message: string}}
   */
  addItem(carId, quantity = 1) {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const car = APEX_DATA.cars.find(c => c.id === carId);

    if (!car) {
      return { success: false, message: "Supercar not found in catalog." };
    }

    const items = this.getItems();
    const existingIndex = items.findIndex(item => item.carId === carId);

    if (existingIndex > -1) {
      items[existingIndex].quantity += qty;
    } else {
      items.push({
        carId,
        quantity: qty,
        addedAt: Date.now()
      });
    }

    this.saveItems(items);
    return {
      success: true,
      car,
      message: `${car.brand} ${car.model} added to your acquisition list.`
    };
  },

  /**
   * Update item quantity
   * @param {string} carId 
   * @param {number} quantity 
   */
  updateQuantity(carId, quantity) {
    const qty = parseInt(quantity, 10);
    let items = this.getItems();

    if (qty <= 0) {
      items = items.filter(i => i.carId !== carId);
    } else {
      const target = items.find(i => i.carId === carId);
      if (target) {
        target.quantity = qty;
      }
    }

    this.saveItems(items);
  },

  /**
   * Remove item from cart
   * @param {string} carId 
   */
  removeItem(carId) {
    const items = this.getItems().filter(i => i.carId !== carId);
    this.saveItems(items);
  },

  /**
   * Clear all items in cart
   */
  clearCart() {
    this.saveItems([]);
    this.removeCoupon();
  },

  /**
   * Get detailed cart items populated with car details
   * @returns {Array<Object>}
   */
  getDetailedItems() {
    const items = this.getItems();
    return items.map(item => {
      const car = APEX_DATA.cars.find(c => c.id === item.carId) || {
        id: item.carId,
        brand: "Supercar",
        model: "Vehicle Model",
        price: 0,
        images: ["images/cars/placeholder.jpg"]
      };
      return {
        ...item,
        car,
        lineTotal: car.price * item.quantity
      };
    });
  },

  /**
   * Apply discount coupon code
   * @param {string} code 
   * @returns {{success: boolean, message: string}}
   */
  applyCoupon(code) {
    if (!code) {
      return { success: false, message: "Please enter a valid promotional code." };
    }
    const cleanCode = code.trim().toUpperCase();
    const couponConfig = APEX_DATA.coupons[cleanCode];

    if (couponConfig) {
      localStorage.setItem(this.COUPON_STORAGE_KEY, JSON.stringify({
        code: cleanCode,
        ...couponConfig
      }));
      window.dispatchEvent(new CustomEvent("apex:cartUpdated"));
      return {
        success: true,
        message: `Promotion "${cleanCode}" applied! ${couponConfig.description}.`
      };
    } else {
      return {
        success: false,
        message: `Invalid code "${cleanCode}". Try using code "APEX10".`
      };
    }
  },

  /**
   * Remove currently applied coupon
   */
  removeCoupon() {
    localStorage.removeItem(this.COUPON_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("apex:cartUpdated"));
  },

  /**
   * Get applied coupon object
   */
  getCoupon() {
    try {
      const data = localStorage.getItem(this.COUPON_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Calculate financial totals
   * @returns {{itemsCount: number, subtotal: number, discount: number, total: number, coupon: Object|null}}
   */
  getTotals() {
    const detailed = this.getDetailedItems();
    const itemsCount = detailed.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = detailed.reduce((acc, item) => acc + item.lineTotal, 0);

    const coupon = this.getCoupon();
    let discount = 0;

    if (coupon && subtotal > 0) {
      discount = Math.round(subtotal * (coupon.discountPercent / 100));
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }

    const total = Math.max(0, subtotal - discount);

    return {
      itemsCount,
      subtotal,
      discount,
      total,
      coupon
    };
  },

  /**
   * Initialize Shopping Cart Page (shoping-cart.html)
   */
  initPage() {
    const tableBody = document.getElementById("cart-table-body");
    if (!tableBody) return;

    this.renderPage();

    // Listen to updates
    window.addEventListener("apex:cartUpdated", () => {
      this.renderPage();
    });

    // Coupon form binding
    const couponForm = document.getElementById("cart-coupon-form");
    if (couponForm) {
      couponForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = couponForm.querySelector('input[name="coupon"]');
        const code = input ? input.value.trim() : "";
        const res = this.applyCoupon(code);
        if (res.success) {
          Main.showToast(res.message, "success");
        } else {
          Main.showToast(res.message, "warning");
        }
      });
    }

    // Clear cart button
    const clearBtn = document.getElementById("cart-clear-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear your supercar acquisition list?")) {
          this.clearCart();
          Main.showToast("Acquisition list cleared.", "info");
        }
      });
    }
  },

  /**
   * Render Cart Page table and financial summaries
   */
  renderPage() {
    const tableBody = document.getElementById("cart-table-body");
    const emptyState = document.getElementById("cart-empty-state");
    const contentWrapper = document.getElementById("cart-content-wrapper");
    const subtotalEl = document.getElementById("cart-subtotal");
    const discountRow = document.getElementById("cart-discount-row");
    const discountEl = document.getElementById("cart-discount");
    const totalEl = document.getElementById("cart-grand-total");
    const couponInput = document.getElementById("coupon-input-field");

    if (!tableBody) return;

    const items = this.getDetailedItems();
    const totals = this.getTotals();

    if (items.length === 0) {
      if (contentWrapper) contentWrapper.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (contentWrapper) contentWrapper.style.display = "grid";
    if (emptyState) emptyState.style.display = "none";

    // Populate rows
    tableBody.innerHTML = items.map(item => {
      const mainImage = (item.car.images && item.car.images.length > 0) ? item.car.images[0] : `images/cars/${item.car.id}-main.jpg`;
      const imgSlot = ImageLoader.createImageSlot({
        src: mainImage,
        alt: item.car.model,
        description: "Cart Thumbnail",
        dimensions: "260x160",
        aspectRatio: "16/10",
        className: "cart-thumb-slot"
      });

      return `
        <tr data-id="${item.car.id}">
          <td class="cart-col-product">
            <div class="cart-product-info">
              <a href="shop-details.html?id=${item.car.id}" class="cart-product-thumb">
                ${imgSlot}
              </a>
              <div class="cart-product-meta">
                <span class="cart-product-brand">${item.car.brand}</span>
                <h4 class="cart-product-title">
                  <a href="shop-details.html?id=${item.car.id}">${item.car.model}</a>
                </h4>
                <span class="cart-product-spec">${item.car.year} &bull; ${item.car.color}</span>
              </div>
            </div>
          </td>
          <td class="cart-col-price">
            <span class="col-label">Price:</span>
            <span class="cart-price-val">${Products.formatPrice(item.car.price)}</span>
          </td>
          <td class="cart-col-qty">
            <span class="col-label">Qty:</span>
            <div class="cart-qty-control">
              <button type="button" class="cart-qty-btn cart-qty-minus" data-id="${item.car.id}"><i class="fa-solid fa-minus"></i></button>
              <input type="number" class="cart-qty-input" value="${item.quantity}" min="1" max="10" data-id="${item.car.id}" />
              <button type="button" class="cart-qty-btn cart-qty-plus" data-id="${item.car.id}"><i class="fa-solid fa-plus"></i></button>
            </div>
          </td>
          <td class="cart-col-total">
            <span class="col-label">Total:</span>
            <span class="cart-line-total">${Products.formatPrice(item.lineTotal)}</span>
          </td>
          <td class="cart-col-remove">
            <button type="button" class="cart-remove-btn" data-id="${item.car.id}" title="Remove vehicle" aria-label="Remove vehicle">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </td>
        </tr>
      `;
    }).join("");

    // Bind quantity and remove buttons
    tableBody.querySelectorAll(".cart-qty-minus").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const item = items.find(i => i.carId === id);
        if (item && item.quantity > 1) {
          this.updateQuantity(id, item.quantity - 1);
        }
      });
    });

    tableBody.querySelectorAll(".cart-qty-plus").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const item = items.find(i => i.carId === id);
        if (item) {
          this.updateQuantity(id, item.quantity + 1);
        }
      });
    });

    tableBody.querySelectorAll(".cart-qty-input").forEach(input => {
      input.addEventListener("change", () => {
        const id = input.getAttribute("data-id");
        let val = parseInt(input.value, 10) || 1;
        if (val < 1) val = 1;
        this.updateQuantity(id, val);
      });
    });

    tableBody.querySelectorAll(".cart-remove-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const item = items.find(i => i.carId === id);
        this.removeItem(id);
        Main.showToast(`${item ? item.car.model : "Vehicle"} removed from cart.`, "info");
      });
    });

    // Update Totals Display
    if (subtotalEl) subtotalEl.textContent = Products.formatPrice(totals.subtotal);

    if (discountRow && discountEl) {
      if (totals.discount > 0) {
        discountRow.style.display = "flex";
        discountEl.textContent = `-${Products.formatPrice(totals.discount)} (${totals.coupon ? totals.coupon.code : ''})`;
      } else {
        discountRow.style.display = "none";
      }
    }

    if (totalEl) totalEl.textContent = Products.formatPrice(totals.total);

    if (couponInput && totals.coupon) {
      couponInput.value = totals.coupon.code;
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cart-table-body")) {
    Cart.initPage();
  }
});
