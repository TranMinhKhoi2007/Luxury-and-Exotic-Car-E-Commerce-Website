/**
 * APEX MOTORS - Product Details Page Controller
 * Handles Dynamic Vehicle Loading, Interactive Image Gallery,
 * Spec Tabs, Add to Cart / Wishlist Actions & Related Supercars
 */

const ProductDetails = {
  car: null,
  currentImageIndex: 0,
  quantity: 1,

  init() {
    this.loadCar();
    if (!this.car) return;

    this.updatePageMeta();
    this.renderGallery();
    this.renderInfo();
    this.renderTabs();
    this.renderRelatedCars();
    this.bindActions();

    // Listen to reactive language changes
    window.addEventListener("apex:languageChanged", () => {
      this.updatePageMeta();
      this.renderInfo();
      this.renderTabs();
      this.renderRelatedCars();
      if (typeof I18N !== "undefined") {
        I18N.applyTranslations();
      }
    });
  },

  /**
   * Resolve car from URL param or default to first entry
   */
  loadCar() {
    const params = new URLSearchParams(window.location.search);
    const carId = params.get("id");

    if (carId) {
      this.car = APEX_DATA.cars.find(c => c.id === carId);
    }

    // Fallback to first vehicle if invalid or missing
    if (!this.car) {
      this.car = APEX_DATA.cars[0];
    }
  },

  /**
   * Update title and breadcrumbs
   */
  updatePageMeta() {
    document.title = `${this.car.brand} ${this.car.model} | APEX MOTORS`;

    const breadcrumbCurrent = document.getElementById("details-breadcrumb-current");
    if (breadcrumbCurrent) {
      breadcrumbCurrent.textContent = `${this.car.brand} ${this.car.model}`;
    }
    const breadcrumbBrand = document.getElementById("details-breadcrumb-brand");
    if (breadcrumbBrand) {
      breadcrumbBrand.textContent = this.car.brand;
      breadcrumbBrand.href = `shop-grid.html?brand=${encodeURIComponent(this.car.brand)}`;
    }
  },

  /**
   * Render Main Showcase & Interactive Thumbnail Gallery
   */
  renderGallery() {
    const mainSlotContainer = document.getElementById("details-gallery-main");
    const thumbContainer = document.getElementById("details-gallery-thumbs");

    if (!mainSlotContainer || !thumbContainer) return;

    const images = (this.car.images && this.car.images.length > 0) 
      ? this.car.images 
      : [`images/cars/${this.car.id}-main.jpg`];

    // Render Main slot
    this.updateMainImage(images[this.currentImageIndex], this.currentImageIndex);

    // Render Thumbnails
    thumbContainer.innerHTML = images.map((imgSrc, idx) => {
      const isSelected = idx === this.currentImageIndex;
      return `
        <button 
          type="button" 
          class="gallery-thumb-btn ${isSelected ? 'is-active' : ''}" 
          data-index="${idx}"
          data-src="${imgSrc}"
          aria-label="View perspective ${idx + 1}"
        >
          ${ImageLoader.createImageSlot({
            src: imgSrc,
            alt: `${this.car.model} view ${idx + 1}`,
            description: `Angle ${idx + 1}`,
            dimensions: "260x160",
            aspectRatio: "16/10",
            className: "thumb-slot"
          })}
        </button>
      `;
    }).join("");

    // Thumbnail click events
    thumbContainer.querySelectorAll(".gallery-thumb-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"), 10);
        this.currentImageIndex = index;
        this.updateMainImage(images[index], index);

        thumbContainer.querySelectorAll(".gallery-thumb-btn").forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
      });
    });

    // Gallery Prev/Next Arrows
    const prevBtn = document.getElementById("gallery-prev-btn");
    const nextBtn = document.getElementById("gallery-next-btn");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        this.currentImageIndex = (this.currentImageIndex - 1 + images.length) % images.length;
        this.syncGalleryState(images);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
        this.syncGalleryState(images);
      });
    }
  },

  syncGalleryState(images) {
    this.updateMainImage(images[this.currentImageIndex], this.currentImageIndex);
    const thumbs = document.querySelectorAll("#details-gallery-thumbs .gallery-thumb-btn");
    thumbs.forEach((thumb, idx) => {
      if (idx === this.currentImageIndex) {
        thumb.classList.add("is-active");
        thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      } else {
        thumb.classList.remove("is-active");
      }
    });
  },

  updateMainImage(src, index) {
    const mainContainer = document.getElementById("details-gallery-main");
    if (!mainContainer) return;

    mainContainer.innerHTML = ImageLoader.createImageSlot({
      src: src,
      alt: `${this.car.brand} ${this.car.model} - Perspective ${index + 1}`,
      description: `Showroom Gallery Asset ${index + 1} of ${this.car.images.length}`,
      dimensions: "1400x900",
      aspectRatio: "16/10",
      className: "gallery-main-slot",
      icon: "fa-solid fa-car-rear"
    });
  },

  /**
   * Render Vehicle Specifications and Info
   */
  renderInfo() {
    const brandEl = document.getElementById("details-brand");
    const titleEl = document.getElementById("details-title");
    const badgeContainer = document.getElementById("details-badge-container");
    const priceCurrent = document.getElementById("details-price-current");
    const priceOriginal = document.getElementById("details-price-original");
    const excerptEl = document.getElementById("details-excerpt");
    const specsGrid = document.getElementById("details-specs-grid");

    const isVi = typeof I18N !== "undefined" && I18N.getLang() === "vi";

    // Strictly preserve original brand and model
    if (brandEl) brandEl.textContent = this.car.brand;
    if (titleEl) titleEl.textContent = this.car.model;

    if (badgeContainer) {
      let badges = [];
      if (this.car.badge) {
        const badgeText = typeof I18N !== "undefined" ? I18N.getCarBadge(this.car.badge) : this.car.badge;
        badges.push(`<span class="car-badge badge-${this.car.badge.toLowerCase().replace(/[\s\-]+/g, '-')}">${badgeText}</span>`);
      }
      const readyText = typeof I18N !== "undefined" ? I18N.t("allocation_ready") : "Allocation Ready";
      badges.push(`<span class="car-badge badge-availability"><i class="fa-solid fa-circle-check"></i> ${readyText}</span>`);
      badgeContainer.innerHTML = badges.join("");
    }

    if (priceCurrent) {
      priceCurrent.textContent = Products.formatPrice(this.car.price);
    }
    if (priceOriginal) {
      if (this.car.originalPrice) {
        priceOriginal.textContent = Products.formatPrice(this.car.originalPrice);
        priceOriginal.style.display = "inline-block";
      } else {
        priceOriginal.style.display = "none";
      }
    }

    const carDesc = typeof I18N !== "undefined" 
      ? I18N.getCarDescription(this.car.id) 
      : { description: this.car.description, overview: this.car.overview };

    if (excerptEl) {
      excerptEl.textContent = carDesc.description;
    }

    if (specsGrid) {
      const colorVal = (isVi && typeof I18N !== "undefined") ? I18N.getColor(this.car.color) : this.car.color;
      const specs = [
        { label: isVi ? "Công suất" : "Horsepower", value: `${this.car.horsepower} HP`, icon: "fa-solid fa-bolt" },
        { label: isVi ? "Tốc độ tối đa" : "Top Speed", value: `${this.car.topSpeed} km/h`, icon: "fa-solid fa-gauge-high" },
        { label: isVi ? "Tăng tốc 0–100 km/h" : "0–100 km/h", value: this.car.acceleration, icon: "fa-solid fa-stopwatch" },
        { label: isVi ? "Mô-men xoắn cực đại" : "Max Torque", value: this.car.torque, icon: "fa-solid fa-gears" },
        { label: isVi ? "Khối động cơ" : "Engine Unit", value: this.car.engine, icon: "fa-solid fa-engine" },
        { label: isVi ? "Hộp số" : "Transmission", value: this.car.transmission, icon: "fa-solid fa-sliders" },
        { label: isVi ? "Hệ dẫn động" : "Drivetrain", value: this.car.drivetrain, icon: "fa-solid fa-arrows-split-up-and-left" },
        { label: isVi ? "Màu ngoại thất" : "Exterior Finish", value: colorVal, icon: "fa-solid fa-palette" }
      ];

      specsGrid.innerHTML = specs.map(s => `
        <div class="spec-card">
          <div class="spec-card-icon"><i class="${s.icon}"></i></div>
          <div class="spec-card-content">
            <span class="spec-card-label">${s.label}</span>
            <span class="spec-card-value">${s.value}</span>
          </div>
        </div>
      `).join("");
    }

    // Action button labels
    const addCartBtn = document.getElementById("details-btn-add-cart");
    if (addCartBtn) {
      addCartBtn.innerHTML = `<i class="fa-solid fa-bag-shopping"></i> ${typeof I18N !== "undefined" ? I18N.t("btn_add_to_cart") : "Add to Cart"}`;
    }
    const wishlistBtn = document.getElementById("details-btn-wishlist");
    if (wishlistBtn) {
      const inWishlist = Wishlist.has(this.car.id);
      const savedText = isVi ? "Đã lưu trong Yêu thích" : "Saved to Wishlist";
      const addText = isVi ? "Thêm vào Yêu thích" : "Add to Wishlist";
      wishlistBtn.innerHTML = `<i class="${inWishlist ? 'fa-solid' : 'fa-regular'} fa-heart"></i> ${inWishlist ? savedText : addText}`;
    }
    const shareBtn = document.getElementById("details-btn-share");
    if (shareBtn) {
      shareBtn.innerHTML = `<i class="fa-solid fa-share-nodes"></i> ${typeof I18N !== "undefined" ? I18N.t("btn_share_product") : "Share Product"}`;
    }
    const contactBtn = document.getElementById("details-btn-contact");
    if (contactBtn) {
      contactBtn.innerHTML = `<i class="fa-solid fa-comment-dots"></i> ${typeof I18N !== "undefined" ? I18N.t("btn_contact_showroom") : "Contact Showroom"}`;
    }
  },

  /**
   * Render Product Description, Tech Specs and Showroom Tabs
   */
  renderTabs() {
    const descTab = document.getElementById("tab-pane-desc");
    const techTab = document.getElementById("tab-pane-tech");
    const warrantyTab = document.getElementById("tab-pane-warranty");
    const isVi = typeof I18N !== "undefined" && I18N.getLang() === "vi";

    // Tab buttons text
    const tabBtns = document.querySelectorAll(".details-tab-btn");
    if (tabBtns.length >= 3) {
      tabBtns[0].textContent = typeof I18N !== "undefined" ? I18N.t("tab_desc") : "Description";
      tabBtns[1].textContent = typeof I18N !== "undefined" ? I18N.t("tab_tech") : "Technical Specifications";
      tabBtns[2].textContent = typeof I18N !== "undefined" ? I18N.t("tab_warranty") : "Concierge Handover & Warranty";
    }

    const carDesc = typeof I18N !== "undefined" 
      ? I18N.getCarDescription(this.car.id) 
      : { description: this.car.description, overview: this.car.overview };

    if (descTab) {
      const archOverview = typeof I18N !== "undefined" ? I18N.t("tab_architectural_overview") : "Architectural Overview";
      const commTitle = typeof I18N !== "undefined" ? I18N.t("tab_commissioning_title") : "Commissioning Details";
      const commDesc = typeof I18N !== "undefined" ? I18N.t("tab_commissioning_desc") : "Every vehicle in the APEX MOTORS inventory has completed our comprehensive 180-point mechanical certification. All factory original delivery documentation, owner provenance dossiers, telemetry keys, and fitted bespoke luggage sets accompany this chassis.";

      descTab.innerHTML = `
        <div class="tab-content-inner">
          <h3>${archOverview}</h3>
          <p>${carDesc.description}</p>
          <div class="highlight-quote">
            <i class="fa-solid fa-quote-left"></i>
            <p>${carDesc.overview}</p>
          </div>
          <h4>${commTitle}</h4>
          <p>${commDesc}</p>
        </div>
      `;
    }

    if (techTab) {
      const ts = typeof I18N !== "undefined" ? I18N.getCarTechSpecs(this.car.id) : (this.car.technicalSpecs || {});
      const specItems = [
        { label: isVi ? "Cấu trúc khung gầm" : "Chassis Construction", val: ts.chassis },
        { label: isVi ? "Hệ thống phanh" : "Braking System", val: ts.brakes },
        { label: isVi ? "Trọng lượng khô" : "Dry Curb Weight", val: ts.dryWeight },
        { label: isVi ? "Dung tích bình nhiên liệu" : "Fuel Capacity", val: ts.fuelTank },
        { label: isVi ? "Tiêu chuẩn khí thải" : "Environmental Homologation", val: ts.emissions },
        { label: isVi ? "Kiến trúc Hybrid / Điện tử" : "Hybrid / Electrical Architecture", val: ts.batteryCapacity || ts.range || (isVi ? "Hệ thống ắc quy phụ trợ 12V tiêu chuẩn" : "Standard 12V Auxiliary") }
      ];

      techTab.innerHTML = `
        <div class="tab-content-inner">
          <h3>${isVi ? "Thông số Kỹ thuật Chi tiết" : "Engineering Specifications"}</h3>
          <table class="specs-table">
            <tbody>
              ${specItems.map(item => `
                <tr>
                  <th>${item.label}</th>
                  <td>${item.val || (isVi ? "Tùy chọn cấu hình Bespoke chính hãng" : "Bespoke Factory Option")}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    if (warrantyTab) {
      warrantyTab.innerHTML = `
        <div class="tab-content-inner">
          <h3>${isVi ? "Bàn giao & Bảo hành Đặc quyền APEX" : "APEX Concierge Delivery & Warranty"}</h3>
          <div class="warranty-features-grid">
            <div class="warranty-feature">
              <i class="fa-solid fa-shield-halved"></i>
              <h4>${typeof I18N !== "undefined" ? I18N.t("warranty_f1_title") : "2-Year Factory Extended Warranty"}</h4>
              <p>${typeof I18N !== "undefined" ? I18N.t("warranty_f1_desc") : "Full bumper-to-bumper powertrain, telemetry, and composite structure coverage honored globally."}</p>
            </div>
            <div class="warranty-feature">
              <i class="fa-solid fa-plane-departure"></i>
              <h4>${typeof I18N !== "undefined" ? I18N.t("warranty_f2_title") : "Enclosed Climate-Controlled Logistics"}</h4>
              <p>${typeof I18N !== "undefined" ? I18N.t("warranty_f2_desc") : "Direct worldwide air freight delivery with white-glove uncrating at your private residence or hangar."}</p>
            </div>
            <div class="warranty-feature">
              <i class="fa-solid fa-flag-checkered"></i>
              <h4>${typeof I18N !== "undefined" ? I18N.t("warranty_f3_title") : "Private Circuit Handover"}</h4>
              <p>${typeof I18N !== "undefined" ? I18N.t("warranty_f3_desc") : "Optional full-day circuit handover with a factory test driver to explore the dynamics of your new machine."}</p>
            </div>
          </div>
        </div>
      `;
    }

    // Tab switcher events
    const tabPanes = document.querySelectorAll(".details-tab-pane");

    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-tab");

        tabBtns.forEach(b => b.classList.remove("is-active"));
        tabPanes.forEach(p => p.classList.remove("is-active"));

        btn.classList.add("is-active");
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add("is-active");
      });
    });
  },

  /**
   * Render Related Supercars
   */
  renderRelatedCars() {
    const container = document.getElementById("details-related-grid");
    if (!container) return;

    // Update Section Headings
    const section = container.closest ? container.closest(".details-related-section") : document.querySelector(".details-related-section");
    if (section && typeof I18N !== "undefined") {
      const tag = section.querySelector(".section-tagline");
      const title = section.querySelector(".section-title");
      const sub = section.querySelector(".section-subtitle");
      if (tag) tag.textContent = I18N.t("related_tag");
      if (title) title.textContent = I18N.t("related_title");
      if (sub) sub.textContent = I18N.t("related_sub");
    }

    // Filter by same brand first, then same category, excluding current car
    let related = APEX_DATA.cars.filter(c => c.id !== this.car.id && c.brand === this.car.brand);
    if (related.length < 4) {
      const more = APEX_DATA.cars.filter(c => c.id !== this.car.id && !related.includes(c) && c.category === this.car.category);
      related = [...related, ...more];
    }
    if (related.length < 4) {
      const remaining = APEX_DATA.cars.filter(c => c.id !== this.car.id && !related.includes(c));
      related = [...related, ...remaining];
    }

    const items = related.slice(0, 4);
    container.innerHTML = items.map(c => Products.renderCard(c)).join("");
    Products.bindCardEvents(container);
  },

  /**
   * Bind buttons and controls
   */
  bindActions() {
    // Quantity controls
    const qtyInput = document.getElementById("details-qty-input");
    const qtyMinus = document.getElementById("details-qty-minus");
    const qtyPlus = document.getElementById("details-qty-plus");

    if (qtyMinus && qtyInput) {
      qtyMinus.addEventListener("click", () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val > 1) {
          val--;
          qtyInput.value = val;
          this.quantity = val;
        }
      });
    }

    if (qtyPlus && qtyInput) {
      qtyPlus.addEventListener("click", () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        val++;
        qtyInput.value = val;
        this.quantity = val;
      });
    }

    if (qtyInput) {
      qtyInput.addEventListener("change", () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val < 1) val = 1;
        qtyInput.value = val;
        this.quantity = val;
      });
    }

    // Add to Cart
    const addCartBtn = document.getElementById("details-btn-add-cart");
    if (addCartBtn) {
      addCartBtn.addEventListener("click", () => {
        const res = Cart.addItem(this.car.id, this.quantity);
        if (res.success) {
          Main.showToast(`${this.quantity}x ${this.car.model} added to your cart.`, "success");
        }
      });
    }

    // Wishlist Toggle
    const wishlistBtn = document.getElementById("details-btn-wishlist");
    if (wishlistBtn) {
      const inWishlist = Wishlist.has(this.car.id);
      if (inWishlist) {
        wishlistBtn.classList.add("is-active");
        wishlistBtn.innerHTML = `<i class="fa-solid fa-heart"></i> Saved to Wishlist`;
      }

      wishlistBtn.addEventListener("click", () => {
        const res = Wishlist.toggle(this.car.id);
        if (res.added) {
          wishlistBtn.classList.add("is-active");
          wishlistBtn.innerHTML = `<i class="fa-solid fa-heart"></i> Saved to Wishlist`;
          Main.showToast(res.message, "success");
        } else {
          wishlistBtn.classList.remove("is-active");
          wishlistBtn.innerHTML = `<i class="fa-regular fa-heart"></i> Add to Wishlist`;
          Main.showToast(res.message, "info");
        }
      });
    }

    // Contact Showroom
    const contactBtn = document.getElementById("details-btn-contact");
    if (contactBtn) {
      contactBtn.addEventListener("click", () => {
        const query = encodeURIComponent(`${this.car.brand} ${this.car.model}`);
        window.location.href = `contact.html?car=${query}`;
      });
    }

    // Share Product
    const shareBtn = document.getElementById("details-btn-share");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        const currentUrl = window.location.href;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(currentUrl).then(() => {
            Main.showToast("Vehicle link copied to clipboard.", "success");
          }).catch(() => {
            Main.showToast("Link: " + currentUrl, "info");
          });
        } else {
          Main.showToast("Link: " + currentUrl, "info");
        }
      });
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("details-gallery-main")) {
    ProductDetails.init();
  }
});
