/**
 * APEX MOTORS - Main Application Controller
 * Handles Navigation, Header Controls, Badges, Search Redirection,
 * Toasts, Modals, Wishlist Drawer, Newsletter, and Global UI
 */

const Main = {
  currentUser: null,

  init() {
    this.initUserSession();
    this.updateBadges();
    this.initStickyHeader();
    this.initMobileMenu();
    this.initGlobalSearch();
    this.initWishlistModal();
    this.initNewsletter();
    this.initScrollTop();
    this.initActiveNav();
    this.initLanguageSelector();
    this.initLoginModal();
    this.initContactPage();

    // Listen to reactive shopping events
    window.addEventListener("apex:cartUpdated", () => this.updateBadges());
    window.addEventListener("apex:wishlistUpdated", () => this.updateBadges());
  },

  /**
   * Mock User Session state
   */
  initUserSession() {
    try {
      const stored = localStorage.getItem("apex_user_session");
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch (e) {
      this.currentUser = null;
    }
    this.updateUserUI();
  },

  updateUserUI() {
    const userBtn = document.getElementById("header-user-btn");
    if (!userBtn) return;

    if (this.currentUser) {
      userBtn.innerHTML = `
        <i class="fa-solid fa-user-check"></i>
        <span>${this.currentUser.name}</span>
        <button type="button" class="user-logout-btn" id="logout-trigger" title="Sign Out">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      `;
      const logoutBtn = document.getElementById("logout-trigger");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.logoutUser();
        });
      }
    } else {
      userBtn.innerHTML = `<i class="fa-regular fa-user"></i> <span>Client Portal</span>`;
    }
  },

  loginUser(name, email) {
    this.currentUser = { name, email, loggedInAt: Date.now() };
    localStorage.setItem("apex_user_session", JSON.stringify(this.currentUser));
    this.updateUserUI();
    this.showToast(`Welcome back, ${name}. Private showroom access granted.`, "success");
  },

  logoutUser() {
    this.currentUser = null;
    localStorage.removeItem("apex_user_session");
    this.updateUserUI();
    this.showToast("Signed out of private showroom portal.", "info");
  },

  /**
   * Update header counter badges and price totals
   */
  updateBadges() {
    const totals = Cart.getTotals();
    const wishlistItems = Wishlist.getItems();

    // Cart counters
    const cartCountEls = document.querySelectorAll(".header-cart-count");
    cartCountEls.forEach(el => {
      el.textContent = totals.itemsCount;
      el.style.display = totals.itemsCount > 0 ? "inline-flex" : "none";
    });

    // Cart price display
    const cartPriceEls = document.querySelectorAll(".header-cart-total-price");
    cartPriceEls.forEach(el => {
      el.textContent = Products.formatPrice(totals.total);
    });

    // Wishlist counters
    const wishlistCountEls = document.querySelectorAll(".header-wishlist-count");
    wishlistCountEls.forEach(el => {
      el.textContent = wishlistItems.length;
      el.style.display = wishlistItems.length > 0 ? "inline-flex" : "none";
    });
  },

  /**
   * Sticky header effect on scroll
   */
  initStickyHeader() {
    const header = document.querySelector(".header-main");
    if (!header) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        header.classList.add("is-sticky");
      } else {
        header.classList.remove("is-sticky");
      }
    }, { passive: true });
  },

  /**
   * Mobile menu toggling
   */
  initMobileMenu() {
    const toggleBtn = document.querySelector(".mobile-menu-toggle");
    const mobileMenu = document.querySelector(".mobile-nav-drawer");
    const overlay = document.querySelector(".mobile-nav-overlay");
    const closeBtn = document.querySelector(".mobile-nav-close");

    if (!toggleBtn || !mobileMenu) return;

    const openMenu = () => {
      mobileMenu.classList.add("is-open");
      if (overlay) overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };

    const closeMenu = () => {
      mobileMenu.classList.remove("is-open");
      if (overlay) overlay.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    toggleBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (overlay) overlay.addEventListener("click", closeMenu);
  },

  /**
   * Active navigation item matching
   */
  initActiveNav() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".main-nav a, .mobile-nav a");

    navLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (href && (href === currentPath || (currentPath === "" && href === "index.html"))) {
        link.classList.add("active");
        const parentDropdown = link.closest(".nav-item-has-children");
        if (parentDropdown) {
          const parentTrigger = parentDropdown.querySelector(".nav-link-parent");
          if (parentTrigger) parentTrigger.classList.add("active");
        }
      }
    });
  },

  /**
   * Top bar search form wiring
   */
  initGlobalSearch() {
    const searchForms = document.querySelectorAll(".hero-search-form, .header-search-form");

    searchForms.forEach(form => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const brandSelect = form.querySelector('select[name="brand"]');
        const input = form.querySelector('input[name="search"]');

        const brand = brandSelect ? brandSelect.value.trim() : "";
        const query = input ? input.value.trim() : "";

        let targetUrl = "shop-grid.html?";
        const params = [];
        if (brand && brand !== "all") params.push(`brand=${encodeURIComponent(brand)}`);
        if (query) params.push(`search=${encodeURIComponent(query)}`);

        targetUrl += params.join("&");
        window.location.href = targetUrl;
      });
    });
  },

  /**
   * Toast notification system
   * @param {string} message 
   * @param {'info'|'success'|'warning'|'error'} type 
   * @param {number} duration 
   */
  showToast(message, type = "info", duration = 3500) {
    let container = document.getElementById("apex-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "apex-toast-container";
      container.className = "toast-container";
      container.setAttribute("role", "region");
      container.setAttribute("aria-live", "polite");
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconClass = "fa-solid fa-circle-info";
    if (type === "success") iconClass = "fa-solid fa-circle-check";
    if (type === "warning") iconClass = "fa-solid fa-triangle-exclamation";
    if (type === "error") iconClass = "fa-solid fa-circle-xmark";

    toast.innerHTML = `
      <span class="toast-icon"><i class="${iconClass}"></i></span>
      <span class="toast-message">${message}</span>
      <button type="button" class="toast-close" aria-label="Close notification">&times;</button>
    `;

    const removeToast = () => {
      toast.classList.add("toast-leaving");
      setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector(".toast-close").addEventListener("click", removeToast);
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-visible");
    }, 10);

    setTimeout(() => {
      if (document.body.contains(toast)) {
        removeToast();
      }
    }, duration);
  },

  /**
   * Wishlist Quick Drawer / Modal
   */
  initWishlistModal() {
    const triggers = document.querySelectorAll(".trigger-wishlist-modal");
    triggers.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openWishlistModal();
      });
    });
  },

  openWishlistModal() {
    let modal = document.getElementById("wishlist-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "wishlist-modal";
      modal.className = "apex-modal-overlay";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-labelledby", "wishlist-modal-title");
      document.body.appendChild(modal);
    }

    const items = Wishlist.getDetailedItems();
    const isVi = typeof I18N !== "undefined" && I18N.getLang() === "vi";

    let itemsHtml = "";
    if (items.length === 0) {
      const emptyTitle = typeof I18N !== "undefined" ? I18N.t("wishlist_empty_title") : "Your Wishlist is Empty";
      const emptyDesc = typeof I18N !== "undefined" ? I18N.t("wishlist_empty_desc") : "You haven't saved any supercars to your wishlist yet.";
      const browseText = typeof I18N !== "undefined" ? I18N.t("wishlist_browse") : "Browse Collection";

      itemsHtml = `
        <div class="empty-state">
          <i class="fa-regular fa-heart empty-state-icon"></i>
          <h4>${emptyTitle}</h4>
          <p>${emptyDesc}</p>
          <a href="shop-grid.html" class="btn btn-gold modal-close-action">${browseText}</a>
        </div>
      `;
    } else {
      const addCartText = typeof I18N !== "undefined" ? I18N.t("btn_add_to_cart") : "Add to Cart";
      const clearText = typeof I18N !== "undefined" ? I18N.t("wishlist_clear") : "Clear All";
      const continueText = typeof I18N !== "undefined" ? I18N.t("wishlist_continue") : "Continue Browsing";

      itemsHtml = `
        <div class="wishlist-modal-items">
          ${items.map(car => `
            <div class="wishlist-modal-item" data-id="${car.id}">
              <div class="wishlist-item-img">
                ${ImageLoader.createImageSlot({
                  src: car.images[0],
                  alt: car.model,
                  description: "Wishlist Thumb",
                  dimensions: "300x200",
                  aspectRatio: "16/10"
                })}
              </div>
              <div class="wishlist-item-info">
                <span class="wishlist-item-brand">${car.brand}</span>
                <h4 class="wishlist-item-title"><a href="shop-details.html?id=${car.id}">${car.model}</a></h4>
                <div class="wishlist-item-price">${Products.formatPrice(car.price)}</div>
              </div>
              <div class="wishlist-item-actions">
                <button type="button" class="btn btn-sm btn-gold move-to-cart-btn" data-id="${car.id}">
                  <i class="fa-solid fa-bag-shopping"></i> ${addCartText}
                </button>
                <button type="button" class="btn-icon remove-wishlist-btn" data-id="${car.id}" title="${isVi ? 'Xóa' : 'Remove'}">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          `).join("")}
        </div>
        <div class="wishlist-modal-footer">
          <button type="button" class="btn btn-outline-danger clear-wishlist-btn">${clearText}</button>
          <a href="shop-grid.html" class="btn btn-outline modal-close-action">${continueText}</a>
        </div>
      `;
    }

    const modalTitle = typeof I18N !== "undefined" ? I18N.t("wishlist_title") : "Saved Supercars";
    modal.innerHTML = `
      <div class="apex-modal-dialog">
        <div class="apex-modal-header">
          <h3 id="wishlist-modal-title"><i class="fa-regular fa-heart"></i> ${modalTitle} (${items.length})</h3>
          <button type="button" class="modal-close-btn" aria-label="Close dialog">&times;</button>
        </div>
        <div class="apex-modal-body">
          ${itemsHtml}
        </div>
      </div>
    `;

    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";

    // Bind modal actions
    const closeModal = () => {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    modal.querySelectorAll(".modal-close-btn, .modal-close-action").forEach(b => {
      b.addEventListener("click", closeModal);
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // Move to cart
    modal.querySelectorAll(".move-to-cart-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        Cart.addItem(id, 1);
        Wishlist.remove(id);
        this.showToast("Supercar moved to acquisition list.", "success");
        this.openWishlistModal(); // Re-render modal
      });
    });

    // Remove item
    modal.querySelectorAll(".remove-wishlist-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        Wishlist.remove(id);
        this.showToast("Removed from wishlist.", "info");
        this.openWishlistModal(); // Re-render modal
      });
    });

    // Clear all
    const clearBtn = modal.querySelector(".clear-wishlist-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        Wishlist.clear();
        this.showToast("Wishlist cleared.", "info");
        this.openWishlistModal();
      });
    }
  },

  /**
   * VIP Client Login Demo Modal
   */
  initLoginModal() {
    const trigger = document.getElementById("header-user-btn");
    if (!trigger) return;

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.currentUser) return; // Already logged in

      let modal = document.getElementById("login-modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "login-modal";
        modal.className = "apex-modal-overlay";
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("aria-labelledby", "login-modal-title");
        document.body.appendChild(modal);
      }

      const loginTitle = typeof I18N !== "undefined" ? I18N.t("login_title") : "Private Client Portal";
      const loginDesc = typeof I18N !== "undefined" ? I18N.t("login_desc") : "Access exclusive supercar allocations, private showroom viewings, and bespoke vehicle commissioning.";
      const demoHint = typeof I18N !== "undefined" ? I18N.t("login_demo_hint") : "Demo Mode: Enter any client name to simulate login.";
      const nameLabel = typeof I18N !== "undefined" ? I18N.t("login_name_label") : "Client Full Name *";
      const emailLabel = typeof I18N !== "undefined" ? I18N.t("login_email_label") : "Email Address *";
      const submitText = typeof I18N !== "undefined" ? I18N.t("login_submit") : "Enter VIP Portal";

      modal.innerHTML = `
        <div class="apex-modal-dialog login-dialog">
          <div class="apex-modal-header">
            <h3 id="login-modal-title"><i class="fa-solid fa-shield-halved"></i> ${loginTitle}</h3>
            <button type="button" class="modal-close-btn">&times;</button>
          </div>
          <div class="apex-modal-body">
            <p class="login-intro">${loginDesc}</p>
            <div class="demo-credential-pill">
              <i class="fa-solid fa-circle-info"></i> ${demoHint}
            </div>
            <form id="login-demo-form" class="apex-form">
              <div class="form-group">
                <label for="client-name">${nameLabel}</label>
                <input type="text" id="client-name" class="form-input" placeholder="e.g. Lord Harrison Vance" required />
              </div>
              <div class="form-group">
                <label for="client-email">${emailLabel}</label>
                <input type="email" id="client-email" class="form-input" placeholder="client@luxury.estate" required />
              </div>
              <button type="submit" class="btn btn-gold btn-block">${submitText}</button>
            </form>
          </div>
        </div>
      `;

      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";

      const closeLogin = () => {
        modal.classList.remove("is-open");
        document.body.style.overflow = "";
      };

      modal.querySelector(".modal-close-btn").addEventListener("click", closeLogin);
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeLogin();
      });

      const form = modal.querySelector("#login-demo-form");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameInput = form.querySelector("#client-name");
        const emailInput = form.querySelector("#client-email");

        if (nameInput.value.trim() && Validator.isValidEmail(emailInput.value.trim())) {
          this.loginUser(nameInput.value.trim(), emailInput.value.trim());
          closeLogin();
        } else {
          this.showToast("Please provide a valid client name and email.", "warning");
        }
      });
    });
  },

  /**
   * Language selector toggle
   */
  initLanguageSelector() {
    const langSelects = document.querySelectorAll("#header-language-select, .header-lang-select");
    if (langSelects.length === 0) return;

    const current = (typeof I18N !== "undefined") ? I18N.getLang() : (localStorage.getItem("apex_language") || "en");
    langSelects.forEach(sel => {
      sel.value = current;
      sel.addEventListener("change", (e) => {
        const selected = e.target.value;
        if (typeof I18N !== "undefined") {
          I18N.setLang(selected);
        } else {
          localStorage.setItem("apex_language", selected);
          const langName = selected === "vi" ? "Tiếng Việt" : "English";
          this.showToast(`Showroom interface set to ${langName}.`, "info");
        }
      });
    });

    window.addEventListener("apex:languageChanged", () => {
      this.updateUserUI();
      this.updateBadges();
      if (typeof I18N !== "undefined") {
        I18N.applyTranslations();
      }
    });
  },

  /**
   * Footer Newsletter
   */
  initNewsletter() {
    const form = document.querySelector(".footer-newsletter-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input ? input.value.trim() : "";

      if (!Validator.isValidEmail(email)) {
        this.showToast("Please enter a valid email address.", "warning");
        return;
      }

      // Store in localStorage
      try {
        const subscribers = JSON.parse(localStorage.getItem("apex_subscribers") || "[]");
        if (!subscribers.includes(email)) {
          subscribers.push(email);
          localStorage.setItem("apex_subscribers", JSON.stringify(subscribers));
        }
      } catch (e) {
        console.error("Error saving newsletter subscriber", e);
      }

      input.value = "";
      this.showToast("Thank you for subscribing to APEX MOTORS Private Dispatches.", "success");
    });
  },

  /**
   * Scroll to top button
   */
  initScrollTop() {
    let btn = document.getElementById("scroll-top-btn");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "scroll-top-btn";
      btn.className = "scroll-top-btn";
      btn.setAttribute("aria-label", "Scroll to top");
      btn.innerHTML = `<i class="fa-solid fa-chevron-up"></i>`;
      document.body.appendChild(btn);
    }

    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
    }, { passive: true });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  },

  /**
   * Contact Showroom page handler
   */
  initContactPage() {
    const contactForm = document.getElementById("contact-showroom-form");
    if (!contactForm) return;

    // Check if URL has ?car= parameter
    const params = new URLSearchParams(window.location.search);
    const carInterest = params.get("car");
    const subjectInput = contactForm.querySelector("#contact-subject");
    if (carInterest && subjectInput) {
      subjectInput.value = `Acquisition Inquiry: ${decodeURIComponent(carInterest)}`;
    }

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = contactForm.querySelector("#contact-name");
      const email = contactForm.querySelector("#contact-email");
      const phone = contactForm.querySelector("#contact-phone");
      const subject = contactForm.querySelector("#contact-subject");
      const message = contactForm.querySelector("#contact-message");
      const isVi = typeof I18N !== "undefined" && I18N.getLang() === "vi";

      let isValid = true;
      if (!Validator.isNotEmpty(name.value)) {
        Validator.showError(name, isVi ? "Vui lòng nhập họ và tên." : "Full name is required.");
        isValid = false;
      }
      if (!Validator.isValidEmail(email.value)) {
        Validator.showError(email, isVi ? "Vui lòng cung cấp địa chỉ email hợp lệ." : "Please provide a valid email address.");
        isValid = false;
      }
      if (!Validator.isValidPhone(phone.value)) {
        Validator.showError(phone, isVi ? "Vui lòng cung cấp số điện thoại hợp lệ." : "Please provide a valid telephone number.");
        isValid = false;
      }
      if (!Validator.isNotEmpty(subject.value)) {
        Validator.showError(subject, isVi ? "Vui lòng nhập tiêu đề yêu cầu." : "Inquiry subject is required.");
        isValid = false;
      }
      if (!Validator.isNotEmpty(message.value, 5)) {
        Validator.showError(message, isVi ? "Nội dung yêu cầu phải có ít nhất 5 ký tự." : "Message must be at least 5 characters.");
        isValid = false;
      }

      if (!isValid) return;

      const inquiry = {
        name: name.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        subject: subject.value.trim(),
        message: message.value.trim(),
        submittedAt: new Date().toISOString()
      };

      try {
        const list = JSON.parse(localStorage.getItem("apex_contact_inquiries") || "[]");
        list.push(inquiry);
        localStorage.setItem("apex_contact_inquiries", JSON.stringify(list));
      } catch (err) {
        console.error("Error storing inquiry", err);
      }

      contactForm.reset();
      const successMsg = isVi 
        ? "Yêu cầu của quý khách đã được ghi nhận với đội ngũ Concierge APEX. (Mô phỏng thử nghiệm)"
        : "Your inquiry has been logged with the APEX Concierge team. (Demo simulated)";
      this.showToast(successMsg, "success", 5000);
    });
  }
};

// Auto-run on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  Main.init();
});
