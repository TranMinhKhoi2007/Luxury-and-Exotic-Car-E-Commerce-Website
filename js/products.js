/**
 * APEX MOTORS - Product Card Rendering & Card Utilities
 */

const Products = {
  /**
   * Format numeric price to USD string
   * @param {number} amount 
   * @returns {string}
   */
  formatPrice(amount) {
    if (typeof amount !== "number" || isNaN(amount)) return "$0";
    return "$" + amount.toLocaleString("en-US");
  },

  /**
   * Render standard supercar card
   * @param {Object} car 
   * @param {Object} [options={}]
   * @returns {string} HTML string
   */
  renderCard(car, options = {}) {
    if (!car) return "";
    const inWishlist = Wishlist.has(car.id);
    const isVi = typeof I18N !== "undefined" && I18N.getLang() === "vi";
    const mainImage = (car.images && car.images.length > 0) ? car.images[0] : `images/cars/${car.id}-main.jpg`;

    const imageSlotHtml = ImageLoader.createImageSlot({
      src: mainImage,
      alt: `${car.brand} ${car.model}`,
      description: `Primary Showcase &bull; ${car.color}`,
      dimensions: "1200x800",
      aspectRatio: "16/10",
      className: "car-card-image-slot",
      icon: "fa-solid fa-car"
    });

    const badgeLabel = (typeof I18N !== "undefined") ? I18N.getCarBadge(car.badge) : car.badge;
    const badgeHtml = car.badge ? `<span class="car-badge badge-${car.badge.toLowerCase().replace(/[\s\-]+/g, '-')}">${badgeLabel}</span>` : "";
    
    const priceDisplay = car.originalPrice 
      ? `<div class="car-card-price-group">
           <span class="price-current">${this.formatPrice(car.price)}</span>
           <span class="price-original">${this.formatPrice(car.originalPrice)}</span>
         </div>`
      : `<div class="car-card-price-group">
           <span class="price-current">${this.formatPrice(car.price)}</span>
         </div>`;

    const detailsText = typeof I18N !== "undefined" ? I18N.t("btn_details") : "Details";
    const addToCartText = typeof I18N !== "undefined" ? I18N.t("btn_add_to_cart") : "Add to Cart";
    const acquireText = typeof I18N !== "undefined" ? I18N.t("btn_acquire") : "Acquire";
    const categoryText = typeof I18N !== "undefined" ? I18N.getCategory(car.category) : car.category;

    const wishlistAria = isVi 
      ? (inWishlist ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích') 
      : (inWishlist ? 'Remove from wishlist' : 'Add to wishlist');
    const wishlistTitle = isVi 
      ? (inWishlist ? 'Đã lưu trong Yêu thích' : 'Thêm vào Yêu thích') 
      : (inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist');

    return `
      <article class="car-card" data-id="${car.id}" data-brand="${car.brand}" data-category="${car.category}">
        <div class="car-card-header">
          ${badgeHtml}
          <button 
            type="button" 
            class="card-action-btn btn-wishlist ${inWishlist ? 'is-active' : ''}" 
            data-action="wishlist" 
            data-id="${car.id}" 
            aria-label="${wishlistAria}"
            title="${wishlistTitle}"
          >
            <i class="${inWishlist ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          
          <a href="shop-details.html?id=${car.id}" class="car-card-image-link" tabindex="-1" aria-hidden="true">
            ${imageSlotHtml}
          </a>

          <div class="car-card-overlay-actions">
            <a href="shop-details.html?id=${car.id}" class="overlay-btn btn-details" title="${detailsText}">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> ${detailsText}
            </a>
            <button type="button" class="overlay-btn btn-cart" data-action="cart" data-id="${car.id}" title="${addToCartText}">
              <i class="fa-solid fa-bag-shopping"></i> ${addToCartText}
            </button>
          </div>
        </div>

        <div class="car-card-body">
          <div class="car-card-meta">
            <span class="car-brand">${car.brand}</span>
            <span class="car-category-pill">${categoryText}</span>
          </div>

          <h3 class="car-card-title">
            <a href="shop-details.html?id=${car.id}">${car.model}</a>
          </h3>

          <div class="car-card-specs">
            <span class="spec-item"><i class="fa-regular fa-calendar"></i> ${car.year}</span>
            <span class="spec-divider">&bull;</span>
            <span class="spec-item"><i class="fa-solid fa-bolt"></i> ${car.horsepower} HP</span>
            <span class="spec-divider">&bull;</span>
            <span class="spec-item"><i class="fa-solid fa-gauge-high"></i> ${car.topSpeed} km/h</span>
          </div>

          <div class="car-card-footer">
            ${priceDisplay}
            <button 
              type="button" 
              class="car-btn-acquire" 
              data-action="cart" 
              data-id="${car.id}"
              aria-label="${isVi ? 'Đặt mua' : 'Acquire'} ${car.model}"
            >
              <i class="fa-solid fa-bag-shopping"></i>
              <span>${acquireText}</span>
            </button>
          </div>
        </div>
      </article>
    `.trim();
  },

  /**
   * Render mini car card (for 3-column homepage widgets & sidebars)
   * @param {Object} car 
   * @returns {string}
   */
  renderMiniCard(car) {
    if (!car) return "";
    const mainImage = (car.images && car.images.length > 0) ? car.images[0] : `images/cars/${car.id}-main.jpg`;
    const imageSlot = ImageLoader.createImageSlot({
      src: mainImage,
      alt: car.model,
      description: "Mini Visual",
      dimensions: "400x260",
      aspectRatio: "16/10",
      className: "mini-car-slot"
    });

    return `
      <div class="mini-car-item" data-id="${car.id}">
        <a href="shop-details.html?id=${car.id}" class="mini-car-pic">
          ${imageSlot}
        </a>
        <div class="mini-car-text">
          <span class="mini-car-brand">${car.brand}</span>
          <h4 class="mini-car-title">
            <a href="shop-details.html?id=${car.id}">${car.model}</a>
          </h4>
          <div class="mini-car-price">${this.formatPrice(car.price)}</div>
        </div>
      </div>
    `.trim();
  },

  /**
   * Bind event delegation on a container for car cards
   * @param {HTMLElement} container 
   */
  bindCardEvents(container) {
    if (!container) return;

    container.addEventListener("click", e => {
      // Wishlist toggle button
      const wishlistBtn = e.target.closest('[data-action="wishlist"]');
      if (wishlistBtn) {
        e.preventDefault();
        e.stopPropagation();
        const carId = wishlistBtn.getAttribute("data-id");
        const res = Wishlist.toggle(carId);

        // Update icon state
        const icon = wishlistBtn.querySelector("i");
        if (res.added) {
          wishlistBtn.classList.add("is-active");
          if (icon) {
            icon.className = "fa-solid fa-heart";
          }
          Main.showToast(res.message, "success");
        } else {
          wishlistBtn.classList.remove("is-active");
          if (icon) {
            icon.className = "fa-regular fa-heart";
          }
          Main.showToast(res.message, "info");
        }
        return;
      }

      // Add to cart button
      const cartBtn = e.target.closest('[data-action="cart"]');
      if (cartBtn) {
        e.preventDefault();
        e.stopPropagation();
        const carId = cartBtn.getAttribute("data-id");
        const res = Cart.addItem(carId, 1);
        if (res.success) {
          Main.showToast(res.message, "success");
        } else {
          Main.showToast(res.message, "warning");
        }
        return;
      }
    });
  }
};
