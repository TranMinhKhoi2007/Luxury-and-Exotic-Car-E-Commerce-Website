/**
 * APEX MOTORS - Internationalization (i18n) Engine
 * Multi-language support: English (US) <-> Tiếng Việt (VI)
 * 
 * STRICT POLICY:
 * - Vehicle names (car.model) and marque/brand names (car.brand) REMAIN STRICTLY ORIGINAL.
 * - Only UI copy, navigation links, car descriptions, overviews, technical specification labels,
 *   filter labels, buttons, modals, toasts, and footer texts are translated.
 * - Business logic, calculations, data structure, and styling remain 100% unchanged.
 */

const I18N = {
  currentLang: "en",

  init() {
    const saved = localStorage.getItem("apex_language");
    this.currentLang = (saved === "vi" || saved === "en") ? saved : "en";
    
    // Sync dropdowns
    this.syncSelectDropdowns();

    // Auto-apply on load
    this.applyTranslations();

    // Listen to storage events from other tabs
    window.addEventListener("storage", (e) => {
      if (e.key === "apex_language" && e.newValue && e.newValue !== this.currentLang) {
        this.setLang(e.newValue, false);
      }
    });
  },

  getLang() {
    return this.currentLang;
  },

  setLang(lang, notify = true) {
    if (lang !== "en" && lang !== "vi") return;
    this.currentLang = lang;
    localStorage.setItem("apex_language", lang);

    document.documentElement.lang = lang;
    this.syncSelectDropdowns();
    this.applyTranslations();

    // Dispatch global event for reactive UI updates
    window.dispatchEvent(new CustomEvent("apex:languageChanged", { detail: { lang } }));

    if (notify && typeof Main !== "undefined" && Main.showToast) {
      const msg = lang === "vi" 
        ? "Giao diện showroom đã chuyển sang Tiếng Việt." 
        : "Showroom interface set to English (US).";
      Main.showToast(msg, "info");
    }
  },

  syncSelectDropdowns() {
    const selects = document.querySelectorAll("#header-language-select, .header-lang-select");
    selects.forEach(sel => {
      if (sel.value !== this.currentLang) {
        sel.value = this.currentLang;
      }
    });
  },

  /**
   * Get translation by key with optional string interpolation
   * @param {string} key 
   * @param {Object} [vars={}] 
   * @returns {string}
   */
  t(key, vars = {}) {
    const dict = this.dict[this.currentLang] || this.dict.en;
    let str = dict[key] !== undefined ? dict[key] : (this.dict.en[key] !== undefined ? this.dict.en[key] : key);

    if (vars && typeof vars === "object") {
      Object.keys(vars).forEach(k => {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), vars[k]);
      });
    }
    return str;
  },

  /**
   * Returns car description & overview for the active language.
   * NOTE: car.model and car.brand are NEVER changed.
   */
  getCarDescription(carId) {
    if (this.currentLang === "vi" && this.carTranslations[carId]) {
      return {
        description: this.carTranslations[carId].description,
        overview: this.carTranslations[carId].overview
      };
    }
    const defaultCar = (typeof APEX_DATA !== "undefined" && APEX_DATA.cars) 
      ? APEX_DATA.cars.find(c => c.id === carId) 
      : null;
    return {
      description: defaultCar ? defaultCar.description : "",
      overview: defaultCar ? defaultCar.overview : ""
    };
  },

  /**
   * Returns translated technical specs for the car in active language
   */
  getCarTechSpecs(carId) {
    const defaultCar = (typeof APEX_DATA !== "undefined" && APEX_DATA.cars) 
      ? APEX_DATA.cars.find(c => c.id === carId) 
      : null;
    const defaultSpecs = defaultCar ? defaultCar.technicalSpecs : {};

    if (this.currentLang === "vi" && this.carTranslations[carId] && this.carTranslations[carId].technicalSpecs) {
      return {
        ...defaultSpecs,
        ...this.carTranslations[carId].technicalSpecs
      };
    }
    return defaultSpecs;
  },

  /**
   * Returns translated badge string
   */
  getCarBadge(badge) {
    if (!badge) return "";
    const badgeKey = "badge_" + badge.toLowerCase().replace(/[\s\-]+/g, "_");
    return this.t(badgeKey) || badge;
  },

  /**
   * Returns translated category
   */
  getCategory(cat) {
    if (!cat) return "";
    const catMap = {
      "Hypercar": "cat_hypercar",
      "Supercar": "cat_supercar",
      "Sports Car": "cat_sports_car",
      "Grand Tourer": "cat_grand_tourer",
      "All Models": "cat_all"
    };
    return catMap[cat] ? this.t(catMap[cat]) : cat;
  },

  /**
   * Returns translated color
   */
  getColor(color) {
    if (!color) return "";
    const colorKey = "color_" + color.toLowerCase();
    return this.t(colorKey) || color;
  },

  /**
   * Returns translated blog post data
   */
  getBlogPost(postId) {
    const defaultPost = (typeof APEX_DATA !== "undefined" && APEX_DATA.blogPosts)
      ? APEX_DATA.blogPosts.find(p => p.id === postId)
      : null;
    if (!defaultPost) return null;

    if (this.currentLang === "vi" && this.blogTranslations[postId]) {
      return {
        ...defaultPost,
        ...this.blogTranslations[postId]
      };
    }
    return defaultPost;
  },

  /**
   * Scan DOM and update elements with data-i18n attributes or standard selectors
   */
  applyTranslations(container = document) {
    const lang = this.currentLang;
    document.documentElement.lang = lang;

    // 1. Text elements: data-i18n="key"
    const textEls = container.querySelectorAll("[data-i18n]");
    textEls.forEach(el => {
      const key = el.getAttribute("data-i18n");
      const translation = this.t(key);
      if (translation !== undefined) {
        el.textContent = translation;
      }
    });

    // 2. HTML elements: data-i18n-html="key"
    const htmlEls = container.querySelectorAll("[data-i18n-html]");
    htmlEls.forEach(el => {
      const key = el.getAttribute("data-i18n-html");
      const translation = this.t(key);
      if (translation !== undefined) {
        el.innerHTML = translation;
      }
    });

    // 3. Placeholders: data-i18n-placeholder="key"
    const phEls = container.querySelectorAll("[data-i18n-placeholder]");
    phEls.forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      const translation = this.t(key);
      if (translation !== undefined) {
        el.setAttribute("placeholder", translation);
      }
    });

    // 4. Titles: data-i18n-title="key"
    const titleEls = container.querySelectorAll("[data-i18n-title]");
    titleEls.forEach(el => {
      const key = el.getAttribute("data-i18n-title");
      const translation = this.t(key);
      if (translation !== undefined) {
        el.setAttribute("title", translation);
      }
    });

    // 5. Aria Labels: data-i18n-aria="key"
    const ariaEls = container.querySelectorAll("[data-i18n-aria]");
    ariaEls.forEach(el => {
      const key = el.getAttribute("data-i18n-aria");
      const translation = this.t(key);
      if (translation !== undefined) {
        el.setAttribute("aria-label", translation);
      }
    });

    // 6. Direct DOM selector mapper (ensures full coverage across all 8 pages)
    this.applySelectorMappings(container);
  },

  /**
   * Universal selector fallback mapper for standard static layout elements
   */
  applySelectorMappings(container) {
    const lang = this.currentLang;
    const isVi = lang === "vi";

    // Top Bar
    const topAlloc = container.querySelector(".top-contact-item:nth-child(2) span");
    if (topAlloc && (topAlloc.textContent.includes("Private Client") || topAlloc.textContent.includes("Phân bổ Khách hàng"))) {
      topAlloc.textContent = isVi ? "Phân bổ Khách hàng Đặc quyền 2026/2027" : "Private Client Allocations 2026/2027";
    }

    const topNotice = container.querySelector(".top-notice-pill");
    if (topNotice) {
      topNotice.textContent = isVi ? "Nền tảng Thử nghiệm" : "Demonstration Platform";
    }

    const clientPortalBtn = container.querySelector("#header-user-btn span");
    if (clientPortalBtn && (clientPortalBtn.textContent === "Client Portal" || clientPortalBtn.textContent === "Cổng Khách hàng")) {
      clientPortalBtn.textContent = isVi ? "Cổng Khách hàng" : "Client Portal";
    }

    // Main Navigation Links
    const navMap = [
      { sel: '.main-nav a[href="index.html"]', en: "Home", vi: "Trang chủ" },
      { sel: '.main-nav a[href="shop-grid.html"]:not(.nav-dropdown-link):not(.nav-link-parent)', en: "Shop", vi: "Bộ sưu tập xe" },
      { sel: '.main-nav .nav-link-parent', en: 'Pages <i class="fa-solid fa-chevron-down"></i>', vi: 'Trang <i class="fa-solid fa-chevron-down"></i>', isHtml: true },
      { sel: '.main-nav a[href="shop-details.html"]', en: "Shop Details", vi: "Chi tiết xe" },
      { sel: '.main-nav a[href="shoping-cart.html"]', en: "Shopping Cart", vi: "Giỏ hàng" },
      { sel: '.main-nav a[href="checkout.html"]', en: "Checkout", vi: "Thanh toán" },
      { sel: '.main-nav a[href="blog-details.html"]', en: "Blog Details", vi: "Chi tiết tin tức" },
      { sel: '.main-nav a[href="blog.html"]', en: "Blog", vi: "Tin tức" },
      { sel: '.main-nav a[href="contact.html"]', en: "Contact", vi: "Liên hệ" },

      // Mobile Nav Drawer Links
      { sel: '.mobile-nav-links a[href="index.html"]', en: "Home", vi: "Trang chủ" },
      { sel: '.mobile-nav-links a[href="shop-grid.html"]:not(.mobile-nav-dropdown a)', en: "Shop Collection", vi: "Bộ sưu tập xe" },
      { sel: '.mobile-nav-dropdown a[href="shop-details.html"]', en: "Shop Details", vi: "Chi tiết xe" },
      { sel: '.mobile-nav-dropdown a[href="shoping-cart.html"]', en: "Shopping Cart", vi: "Giỏ hàng" },
      { sel: '.mobile-nav-dropdown a[href="checkout.html"]', en: "Checkout", vi: "Thanh toán" },
      { sel: '.mobile-nav-dropdown a[href="blog-details.html"]', en: "Blog Details", vi: "Chi tiết tin tức" },
      { sel: '.mobile-nav-links a[href="blog.html"]', en: "Editorial Blog", vi: "Chuyên mục tin tức" },
      { sel: '.mobile-nav-links a[href="contact.html"]', en: "Contact Showroom", vi: "Liên hệ Showroom" }
    ];

    navMap.forEach(item => {
      const el = container.querySelector(item.sel);
      if (el) {
        if (item.isHtml) {
          el.innerHTML = isVi ? item.vi : item.en;
        } else {
          el.textContent = isVi ? item.vi : item.en;
        }
      }
    });

    // Cart Label in Header
    const cartLabel = container.querySelector(".header-cart-label");
    if (cartLabel) {
      cartLabel.textContent = isVi ? "Tổng danh mục" : "Portfolio Total";
    }

    // Hero Search Form
    const searchInput = container.querySelector('.hero-search-form input[name="search"], .header-search-form input[name="search"]');
    if (searchInput) {
      searchInput.setAttribute("placeholder", isVi ? "Tìm kiếm siêu xe mơ ước của bạn..." : "Search your dream supercar...");
      searchInput.setAttribute("aria-label", isVi ? "Tìm kiếm siêu xe" : "Search Supercars");
    }

    const searchSelectAll = container.querySelector('.search-brand-select option[value="all"]');
    if (searchSelectAll) {
      searchSelectAll.textContent = isVi ? "Tất cả thương hiệu" : "All Marques";
    }

    const searchBtnSpan = container.querySelector(".btn-search span");
    if (searchBtnSpan) {
      searchBtnSpan.textContent = isVi ? "Tìm kiếm" : "Search";
    }

    const supportHours = container.querySelector(".support-hours");
    if (supportHours) {
      supportHours.textContent = isVi ? "Dịch vụ VIP & Ký gửi 24/7" : "24/7 VIP Concierge & Escrow";
    }

    // Footer Elements
    const footerAboutP = container.querySelector(".footer-about p, .footer-brand-desc");
    if (footerAboutP) {
      footerAboutP.textContent = isVi 
        ? "APEX MOTORS là điểm đến hàng đầu dành cho các nhà sưu tập tinh hoa tìm kiếm những siêu xe và hypercar hiếm có, đậm chất đường đua. Mua bán kín đáo toàn cầu & ký gửi an toàn."
        : "APEX MOTORS is the premier destination for discerning collectors seeking rare, track-focused, and bespoke luxury hypercars. Worldwide discreet acquisition & secure escrow.";
    }

    const footerCols = container.querySelectorAll(".footer-links-col h4, .footer-newsletter-col h4, .footer-col-links h4, .footer-col-newsletter h4");
    if (footerCols.length >= 3) {
      footerCols[0].textContent = isVi ? "Bộ sưu tập xe" : "Collection";
      footerCols[1].textContent = isVi ? "Dịch vụ VIP" : "VIP Services";
      footerCols[2].textContent = isVi ? "Bản tin Riêng tư" : "Private Dispatches";
    }

    const newsletterDesc = container.querySelector(".footer-newsletter-col p, .footer-newsletter-text");
    if (newsletterDesc) {
      newsletterDesc.textContent = isVi
        ? "Đăng ký nhận thông tin các suất phân bổ nội bộ, lời mời xem xe riêng tư và các siêu xe hiếm mới ra mắt."
        : "Subscribe to receive off-market allocations, confidential collector acquisitions, and technical bulletins.";
    }

    const newsletterInput = container.querySelector('.footer-newsletter-form input[type="email"]');
    if (newsletterInput) {
      newsletterInput.setAttribute("placeholder", isVi ? "Nhập email của bạn..." : "Your private email...");
    }

    const newsletterBtn = container.querySelector('.footer-newsletter-form button[type="submit"]');
    if (newsletterBtn) {
      const span = newsletterBtn.querySelector("span");
      if (span) {
        span.textContent = isVi ? "Gia nhập" : "Join Circle";
      } else {
        newsletterBtn.textContent = isVi ? "Gia nhập" : "Join Circle";
      }
    }

    // Footer Links localization
    const footerLinkMap = [
      { sel: '.footer-col-links a[href="shop-grid.html"]', en: "Full Inventory", vi: "Toàn bộ danh mục" },
      { sel: '.footer-col-links a[href*="Hypercar"]', en: "Hypercar Royalty", vi: "Đỉnh cao Hypercar" },
      { sel: '.footer-col-links a[href*="Supercar"]', en: "Supercar Icons", vi: "Biểu tượng Supercar" },
      { sel: '.footer-col-links a[href*="Sports"]', en: "Track Specials", vi: "Chiến binh đường đua" },
      { sel: '.footer-col-links a[href*="Grand"]', en: "Mega-GTs", vi: "Dòng xe Mega-GT" },
      { sel: '.footer-col-links a[href*="price-high"]', en: "Crown Allocations", vi: "Suất phân bổ thượng hạng" },
      { sel: '.footer-col-links a[href="contact.html"]:nth-of-type(1)', en: "Private Commissioning", vi: "Đặt xe cá nhân hóa" },
      { sel: '.footer-col-links a[href="shop-details.html"]', en: "180-Point Certification", vi: "Kiểm định 180 điểm" },
      { sel: '.footer-col-links a[href="checkout.html"]', en: "Demo Escrow Checkout", vi: "Thanh toán Ký gửi Thử nghiệm" },
      { sel: '.footer-col-links a[href="blog.html"]', en: "Market Insights", vi: "Thông tin thị trường" }
    ];
    footerLinkMap.forEach(item => {
      const a = container.querySelector(item.sel);
      if (a) a.textContent = isVi ? item.vi : item.en;
    });

    const footerDisclaimer = container.querySelector(".footer-disclaimer-pill");
    if (footerDisclaimer) {
      footerDisclaimer.textContent = isVi ? "Nền tảng Trưng bày Siêu xe Thử nghiệm" : "Simulated E-Commerce Showroom Demonstration";
    }

    const footerBottomPs = container.querySelectorAll(".footer-bottom p");
    if (footerBottomPs.length >= 2) {
      footerBottomPs[1].textContent = isVi ? "Vượt trên Tốc độ. Đỉnh cao Sang trọng." : "Beyond Speed. Beyond Luxury.";
    }

    // Breadcrumbs common links & titles
    const bcHomeLinks = container.querySelectorAll('.breadcrumb-nav a[href="index.html"]');
    bcHomeLinks.forEach(a => {
      a.textContent = isVi ? "Trang chủ" : "Home";
    });

    const bcShopLinks = container.querySelectorAll('.breadcrumb-nav a[href="shop-grid.html"]');
    bcShopLinks.forEach(a => {
      a.textContent = isVi ? "Bộ sưu tập xe" : "Shop Collection";
    });

    const bcBlogLinks = container.querySelectorAll('.breadcrumb-nav a[href="blog.html"]');
    bcBlogLinks.forEach(a => {
      a.textContent = isVi ? "Bản tin & Chuyên mục" : "Editorial Dispatches";
    });

    const bcActive = container.querySelector(".breadcrumb-nav .breadcrumb-active");
    if (bcActive) {
      const txt = bcActive.textContent.trim();
      if (txt === "Shop Collection" || txt === "Bộ sưu tập xe") bcActive.textContent = isVi ? "Bộ sưu tập xe" : "Shop Collection";
      if (txt === "Shopping Cart" || txt === "Giỏ hàng") bcActive.textContent = isVi ? "Giỏ hàng" : "Shopping Cart";
      if (txt === "Checkout" || txt === "Thanh toán") bcActive.textContent = isVi ? "Thanh toán" : "Checkout";
      if (txt === "Contact Us" || txt === "Liên hệ") bcActive.textContent = isVi ? "Liên hệ" : "Contact Us";
      if (txt === "Editorial Dispatches" || txt === "Bản tin & Chuyên mục Siêu xe") bcActive.textContent = isVi ? "Bản tin & Chuyên mục Siêu xe" : "Editorial Dispatches";
      if (txt === "Specifications" || txt === "Thông số Kỹ thuật") bcActive.textContent = isVi ? "Thông số Kỹ thuật" : "Specifications";
    }

    // Page titles in Breadcrumb Hero
    const bcTitle = container.querySelector(".breadcrumb-title");
    if (bcTitle && !bcTitle.id) {
      const txt = bcTitle.textContent.trim();
      if (txt === "Supercar Catalog" || txt === "Danh mục Siêu xe") bcTitle.textContent = isVi ? "Danh mục Siêu xe" : "Supercar Catalog";
      if (txt === "Acquisition Portfolio" || txt === "Danh mục Sở hữu") bcTitle.textContent = isVi ? "Danh mục Sở hữu" : "Acquisition Portfolio";
      if (txt === "Escrow Reservation" || txt === "Ký gửi Bảo mật") bcTitle.textContent = isVi ? "Ký gửi Bảo mật" : "Escrow Reservation";
      if (txt === "Contact Showroom" || txt === "Liên hệ Showroom") bcTitle.textContent = isVi ? "Liên hệ Showroom" : "Contact Showroom";
      if (txt === "Editorial Dispatches" || txt === "Bản tin & Chuyên mục Siêu xe") bcTitle.textContent = isVi ? "Bản tin & Chuyên mục Siêu xe" : "Editorial Dispatches";
    }

    // Checkout page elements
    const checkoutBoxTitle = container.querySelector("#checkout-billing-form")?.closest(".checkout-box")?.querySelector(".checkout-box-title");
    if (checkoutBoxTitle) {
      checkoutBoxTitle.textContent = isVi ? "Thông tin Đăng ký & Hồ sơ Giao nhận" : "Client Registration & Delivery Dossier";
    }

    const checkoutLabels = [
      { sel: 'label[for="billing-first-name"]', en: "First Name *", vi: "Tên *" },
      { sel: 'label[for="billing-last-name"]', en: "Last Name *", vi: "Họ *" },
      { sel: 'label[for="billing-email"]', en: "Client Email Address *", vi: "Địa chỉ Email Khách hàng *" },
      { sel: 'label[for="billing-phone"]', en: "Telephone / Signal Contact *", vi: "Số điện thoại / Liên lạc Signal *" },
      { sel: 'label[for="billing-country"]', en: "Country / Jurisdiction *", vi: "Quốc gia / Khu vực nhận xe *" },
      { sel: 'label[for="billing-city"]', en: "City *", vi: "Thành phố *" },
      { sel: 'label[for="billing-address"]', en: "Private Residence / Hangar Address *", vi: "Địa chỉ Tư gia / Hangar riêng *" },
      { sel: 'label[for="billing-postal"]', en: "Postal Code *", vi: "Mã bưu chính / ZIP *" },
      { sel: 'label[for="billing-notes"]', en: "Bespoke Commissioning Requests / Special Delivery Instructions", vi: "Yêu cầu giao nhận đặc biệt / Ghi chú Bespoke" }
    ];
    checkoutLabels.forEach(item => {
      const l = container.querySelector(item.sel);
      if (l) l.textContent = isVi ? item.vi : item.en;
    });

    const paymentTitle = container.querySelector(".payment-methods-wrapper h4");
    if (paymentTitle) {
      paymentTitle.textContent = isVi ? "Phương thức Thanh toán & Ký gửi Thử nghiệm" : "Demonstration Settlement Method";
    }

    const paymentCards = container.querySelectorAll(".payment-option-card");
    if (paymentCards.length >= 3) {
      const p1Strong = paymentCards[0].querySelector("strong");
      const p1P = paymentCards[0].querySelector("p");
      if (p1Strong) p1Strong.textContent = isVi ? "Ký gửi chuyển khoản ngân hàng VIP (Mô phỏng)" : "VIP Escrow Bank Wire Transfer (Simulated)";
      if (p1P) p1P.textContent = isVi ? "Chuyển khoản trực tiếp qua tài khoản ký gửi ngân hàng đầu tư quốc tế với chữ ký đa bên." : "Direct wire via global private banking escrow with multi-signature authorization.";

      const p2Strong = paymentCards[1].querySelector("strong");
      const p2P = paymentCards[1].querySelector("p");
      if (p2Strong) p2Strong.textContent = isVi ? "Thanh toán tài sản số bảo mật (USDT/BTC Mô phỏng)" : "Private Asset Crypto Settlement (USDT/BTC Simulated)";
      if (p2P) p2P.textContent = isVi ? "Giao dịch on-chain được xử lý an toàn qua hệ thống ví lạnh của tổ chức." : "On-chain transaction processed through institutional cold custody.";

      const p3Strong = paymentCards[2].querySelector("strong");
      const p3P = paymentCards[2].querySelector("p");
      if (p3Strong) p3Strong.textContent = isVi ? "Thư tín dụng ngân hàng tư nhân (L/C Mô phỏng)" : "Private Banking Letter of Credit (Simulated)";
      if (p3P) p3P.textContent = isVi ? "Thư tín dụng không thể hủy ngang được xác nhận bởi định chế tài chính uy tín bậc nhất." : "Irrevocable letter of credit confirmed by tier-1 global wealth institution.";
    }

    const checkoutSubmitBtn = container.querySelector("#checkout-submit-btn");
    if (checkoutSubmitBtn) {
      checkoutSubmitBtn.textContent = isVi ? "Xác nhận Sở hữu & Ký gửi Hợp đồng" : "Confirm Acquisition & Execute Escrow";
    }

    const checkoutSummaryTitle = container.querySelector(".checkout-summary-card h3");
    if (checkoutSummaryTitle) {
      checkoutSummaryTitle.textContent = isVi ? "Tóm tắt Đơn hàng" : "Order Reservation Summary";
    }

    const checkoutDisclaimer = container.querySelector(".checkout-section .demo-disclaimer-box div");
    if (checkoutDisclaimer) {
      checkoutDisclaimer.innerHTML = isVi
        ? "<strong>LƯU Ý THỬ NGHIỆM:</strong> Giao diện thanh toán này mô phỏng quy trình đặt cọc ký gửi siêu xe giá trị cao tại APEX MOTORS. Không yêu cầu thẻ thanh toán thực tế và không có giao dịch tài chính nào diễn ra."
        : "<strong>CONFIDENTIAL SIMULATION NOTICE:</strong> This checkout interface models the high-value escrow reservation protocols of APEX MOTORS. No actual payment card data is required, nor are real financial transactions executed.";
    }

    // Contact page elements
    const contactCards = container.querySelectorAll(".contact-card");
    if (contactCards.length >= 4) {
      const h0 = contactCards[0].querySelector("h4");
      const h1 = contactCards[1].querySelector("h4");
      const h2 = contactCards[2].querySelector("h4");
      const h3 = contactCards[3].querySelector("h4");
      if (h0) h0.textContent = isVi ? "Địa chỉ Showroom" : "Showroom Location";
      if (h1) h1.textContent = isVi ? "Đường dây nóng VIP" : "VIP Telephone";
      if (h2) h2.textContent = isVi ? "Hộp thư Trực tiếp" : "Direct Dispatch";
      if (h3) h3.textContent = isVi ? "Giờ mở cửa Showroom" : "Showroom Hours";

      const hoursP = contactCards[3].querySelector("p");
      if (hoursP) {
        hoursP.innerHTML = isVi 
          ? "Thứ 2 – Thứ 7: 9:00 – 20:00<br>Chủ nhật: Chỉ đón khách theo lịch hẹn" 
          : "Mon – Sat: 9:00 AM – 8:00 PM<br>Sun: By Appointment Only";
      }
    }

    const contactFormBox = container.querySelector("#contact-showroom-form")?.closest(".checkout-box");
    if (contactFormBox) {
      const h3 = contactFormBox.querySelector(".checkout-box-title");
      const p = contactFormBox.querySelector("p");
      if (h3) h3.textContent = isVi ? "Yêu cầu Tư vấn Đặt cọc & Sở hữu" : "Commissioning & Acquisition Inquiry";
      if (p) p.textContent = isVi
        ? "Dù quý khách muốn đặt xe theo cấu hình riêng, tìm hiểu nguồn gốc xe hay sắp xếp lịch vận chuyển riêng tư, đội ngũ concierge cao cấp của chúng tôi sẽ phản hồi trong vòng 4 giờ."
        : "Whether you are commissioning a bespoke allocation, inquiring about vehicle provenance, or arranging private transport, our senior concierge will respond within 4 hours.";
    }

    const contactLabels = [
      { sel: 'label[for="contact-name"]', en: "Full Name *", vi: "Họ và tên *" },
      { sel: 'label[for="contact-email"]', en: "Email Address *", vi: "Địa chỉ Email *" },
      { sel: 'label[for="contact-phone"]', en: "Telephone / Signal *", vi: "Số điện thoại / Signal *" },
      { sel: 'label[for="contact-subject"]', en: "Inquiry Subject *", vi: "Tiêu đề / Siêu xe quan tâm *" },
      { sel: 'label[for="contact-message"]', en: "Inquiry Details *", vi: "Nội dung chi tiết yêu cầu *" }
    ];
    contactLabels.forEach(item => {
      const l = container.querySelector(item.sel);
      if (l) l.textContent = isVi ? item.vi : item.en;
    });

    const contactBtnSpan = container.querySelector('#contact-showroom-form button[type="submit"] span');
    if (contactBtnSpan) {
      contactBtnSpan.textContent = isVi ? "Gửi Tin Nhắn" : "Send Message";
    }

    const mapTitle = container.querySelector(".map-placeholder-title");
    if (mapTitle) {
      mapTitle.textContent = isVi ? "Showroom Cờ đầu APEX MOTORS" : "APEX MOTORS Flagship Showroom";
    }
    const mapBtn = container.querySelector(".map-action-btn");
    if (mapBtn) {
      mapBtn.textContent = isVi ? "Mở trong Bản đồ Toàn cầu" : "Open in Global Navigation";
    }

    // Blog page elements
    const blogWidgetTitles = container.querySelectorAll(".sidebar-widget-title");
    if (blogWidgetTitles.length >= 3) {
      blogWidgetTitles[0].textContent = isVi ? "Chủ đề Chuyên mục" : "Editorial Topics";
      blogWidgetTitles[1].textContent = isVi ? "Bài viết Mới nhất" : "Recent Dispatches";
      blogWidgetTitles[2].textContent = isVi ? "Thẻ Chủ đề" : "Focus Tags";
    }

    const blogSearchInput = container.querySelector('.sidebar-search-form input[type="text"]');
    if (blogSearchInput) {
      blogSearchInput.setAttribute("placeholder", isVi ? "Tìm kiếm bài viết..." : "Search editorial dispatches...");
    }

    const commentTitle = container.querySelector(".blog-comment-form h3");
    if (commentTitle) {
      commentTitle.textContent = isVi ? "Để lại Bình luận Bảo mật" : "Leave an Editorial Comment";
    }
    const commentDesc = container.querySelector(".blog-comment-form p");
    if (commentDesc) {
      commentDesc.textContent = isVi ? "Tham gia thảo luận về di sản siêu xe và kỹ thuật chế tác ô tô đỉnh cao." : "Join the discussion on supercar provenance and automotive engineering.";
    }
    const commentSubmitBtn = container.querySelector(".blog-comment-form button[type=" + '"submit"' + "]");
    if (commentSubmitBtn) {
      commentSubmitBtn.textContent = isVi ? "Gửi bình luận" : "Post Comment";
    }

    // Wishlist trigger tooltips
    const wishlistTriggers = container.querySelectorAll(".trigger-wishlist-modal");
    wishlistTriggers.forEach(btn => {
      btn.setAttribute("title", isVi ? "Danh sách yêu thích" : "Saved Wishlist");
      btn.setAttribute("aria-label", isVi ? "Xem danh sách yêu thích" : "View Saved Wishlist");
    });
  }
};

/**
 * UI Text Dictionary (EN and VI)
 */
I18N.dict = {
  en: {
    // Navigation
    nav_home: "Home",
    nav_shop: "Shop",
    nav_pages: "Pages",
    nav_shop_details: "Shop Details",
    nav_cart: "Shopping Cart",
    nav_checkout: "Checkout",
    nav_blog_details: "Blog Details",
    nav_blog: "Blog",
    nav_contact: "Contact",
    nav_shop_collection: "Shop Collection",
    nav_editorial_blog: "Editorial Blog",
    nav_contact_showroom: "Contact Showroom",

    // Top Bar & Header
    top_allocations: "Private Client Allocations 2026/2027",
    top_demonstration: "Demonstration Platform",
    top_portal: "Client Portal",
    header_portfolio_total: "Portfolio Total",
    search_all_marques: "All Marques",
    search_placeholder: "Search your dream supercar...",
    search_btn: "Search",
    support_hours: "24/7 VIP Concierge & Escrow",

    // Buttons & Badges
    btn_details: "Details",
    btn_add_to_cart: "Add to Cart",
    btn_acquire: "Acquire",
    allocation_ready: "Allocation Ready",
    badge_exclusive: "Exclusive",
    badge_track_legend: "Track Legend",
    badge_limited_edition: "Limited Edition",
    badge_rare_gem: "Rare Gem",
    badge_flagship: "Flagship",
    badge_hyper_gt: "Hyper GT",
    badge_track_only: "Track Only",
    badge_all_electric: "All-Electric",
    badge_megacar: "Megacar",
    badge_super_suv: "Super SUV",

    // Categories
    cat_all: "All Models",
    cat_hypercar: "Hypercar",
    cat_supercar: "Supercar",
    cat_sports_car: "Sports Car",
    cat_grand_tourer: "Grand Tourer",

    // Colors
    color_all: "All Colors",
    color_orange: "Orange",
    color_white: "White",
    color_red: "Red",
    color_blue: "Blue",
    color_green: "Green",
    color_grey: "Grey",
    color_yellow: "Yellow",
    color_black: "Black",
    color_purple: "Purple",

    // Homepage Hero
    hero_label: "EXCLUSIVE SUPERCAR COLLECTION",
    hero_title: "DRIVE BEYOND <span>LIMITS</span>",
    hero_subtitle: "Discover the world's most extraordinary supercars and hypercars. Engineered for supreme track velocity, commissioned with bespoke haute horlogerie craftsmanship.",
    hero_explore: "Explore Collection",
    hero_details: "View Details",

    // Homepage Sections
    marques_tagline: "Elite Manufacturers",
    marques_title: "Prestige Marques",
    marques_subtitle: "Curated allocations from the world's foremost automotive engineering houses.",
    featured_tagline: "Featured Supercars",
    featured_title: "Flagship Showroom Allocations",
    featured_subtitle: "Rare track-focused titans and road legal masterpieces available for immediate acquisition.",
    tab_all: "All Models",

    promo_porsche_tag: "Weissach Engineering",
    promo_porsche_title: "PORSCHE MOTORSPORT",
    promo_porsche_desc: "Track weapons engineered in Weissach with active aerodynamic mastery.",
    promo_lambo_tag: "Sant'Agata Bolognese",
    promo_lambo_title: "LAMBORGHINI V12 HPEV",
    promo_lambo_desc: "The dawn of electrified hypercars from Sant'Agata Bolognese.",
    promo_btn: "Acquire Now",

    col_latest: "Latest Arrivals",
    col_rated: "Top Rated",
    col_popular: "Collector Favorites",

    blog_tagline: "Apex Dispatches",
    blog_title: "Automotive Editorial",
    blog_subtitle: "Insightful analyses, engineering deep-dives, and market movements in ultra-rare vehicles.",
    read_article: "Read Article",
    view_all_blogs: "View All Editorial Posts",

    // Shop Grid Page
    shop_title: "Supercar Catalog",
    shop_breadcrumb: "Shop Collection",
    shop_special_tagline: "Crown Allocations",
    shop_special_title: "Exclusive & Limited Editions",
    filter_marque: "Marque / Brand",
    filter_budget: "Acquisition Budget",
    filter_category: "Category",
    filter_color: "Exterior Finish",
    filter_year: "Year of Manufacture",
    filter_reset: "Reset All Filters",
    showing_results: "Showing {start}–{end} of {total} supercars",
    sort_default: "Sort by: Default (Featured)",
    sort_price_low: "Price: Low to High",
    sort_price_high: "Price: High to Low",
    sort_newest: "Newest Arrivals",
    sort_name_az: "Model: A - Z",
    sort_power_high: "Horsepower: High to Low",
    no_results_title: "No Supercars Match Your Filter",
    no_results_desc: "Try adjusting your price range, selected marque, or clearing filters.",

    // Product Details Page
    tab_desc: "Description",
    tab_tech: "Technical Specifications",
    tab_warranty: "Concierge Handover & Warranty",
    tab_architectural_overview: "Architectural Overview",
    tab_commissioning_title: "Commissioning Details",
    tab_commissioning_desc: "Every vehicle in the APEX MOTORS inventory has completed our comprehensive 180-point mechanical certification. All factory original delivery documentation, owner provenance dossiers, telemetry keys, and fitted bespoke luggage sets accompany this chassis.",
    spec_hp: "Horsepower",
    spec_top_speed: "Top Speed",
    spec_accel: "0–100 km/h",
    spec_torque: "Max Torque",
    spec_engine: "Engine Unit",
    spec_trans: "Transmission",
    spec_drive: "Drivetrain",
    spec_color: "Exterior Finish",
    spec_chassis: "Chassis Construction",
    spec_brakes: "Braking System",
    spec_dry_weight: "Dry Curb Weight",
    spec_fuel: "Fuel Capacity",
    spec_emissions: "Environmental Homologation",
    spec_battery: "Hybrid / Electrical Architecture",
    warranty_f1_title: "2-Year Factory Extended Warranty",
    warranty_f1_desc: "Full bumper-to-bumper powertrain, telemetry, and composite structure coverage honored globally.",
    warranty_f2_title: "Enclosed Climate-Controlled Logistics",
    warranty_f2_desc: "Direct worldwide air freight delivery with white-glove uncrating at your private residence or hangar.",
    warranty_f3_title: "Private Circuit Handover",
    warranty_f3_desc: "Optional full-day circuit handover with a factory test driver to explore the dynamics of your new machine.",
    btn_share_product: "Share Product",
    btn_contact_showroom: "Contact Showroom",
    related_tag: "Related Supercars",
    related_title: "Acquisition Opportunities",
    related_sub: "Similar high-performance vehicles engineered for the discerning collector.",

    // Shopping Cart Page
    cart_breadcrumb: "Shopping Cart",
    cart_title: "Acquisition Portfolio",
    cart_th_supercar: "Supercar Allocation",
    cart_th_price: "Price (USD)",
    cart_th_units: "Units",
    cart_th_total: "Total",
    cart_continue: "Continue Shopping",
    cart_clear: "Clear Portfolio",
    cart_summary_title: "Escrow Summary",
    cart_promo_label: "Promotional Code",
    cart_promo_btn: "Apply",
    cart_promo_hint: "Demo Incentive: Use code <strong>APEX10</strong> for 10% off (up to $50,000).",
    cart_subtotal: "Portfolio Subtotal:",
    cart_discount: "VIP Privilege Discount",
    cart_total: "Capital Commitment Total:",
    cart_checkout_btn: "Proceed to Escrow Checkout",
    cart_empty_title: "Your Acquisition Portfolio is Empty",
    cart_empty_desc: "You have not designated any vehicles for acquisition reservation yet. Browse our inventory of hypercars, track specials, and luxury icons.",
    cart_empty_btn: "Explore Showroom Inventory",

    // Checkout Page
    checkout_title: "Escrow Reservation",
    checkout_box_title: "Client Registration & Delivery Dossier",
    field_first_name: "First Name *",
    field_last_name: "Last Name *",
    field_email: "Client Email Address *",
    field_phone: "Telephone / Signal Contact *",
    field_country: "Country / Jurisdiction *",
    field_city: "City *",
    field_address: "Private Residence / Hangar Address *",
    field_postal: "Postal Code *",
    field_notes: "Bespoke Commissioning Requests / Special Delivery Instructions",
    payment_method_title: "Demonstration Settlement Method",
    payment_wire_title: "VIP Escrow Bank Wire Transfer (Simulated)",
    payment_wire_desc: "Direct wire via global private banking escrow with multi-signature authorization.",
    payment_crypto_title: "Private Asset Crypto Settlement (USDT/BTC Simulated)",
    payment_crypto_desc: "On-chain transaction processed through institutional cold custody.",
    payment_loc_title: "Private Banking Letter of Credit (Simulated)",
    payment_loc_desc: "Irrevocable letter of credit confirmed by tier-1 global wealth institution.",
    checkout_summary_title: "Order Reservation Summary",
    checkout_btn: "Confirm Acquisition & Execute Escrow",

    // Confirmation Receipt Modal
    receipt_title: "Supercar Reservation Confirmed",
    receipt_ref: "Reservation Reference:",
    receipt_client_info: "Client Information",
    receipt_client: "Client:",
    receipt_email: "Email:",
    receipt_phone: "Phone:",
    receipt_dest: "Destination:",
    receipt_acquired: "Acquired Vehicles",
    receipt_subtotal: "Subtotal:",
    receipt_incentive: "Incentive",
    receipt_grand_total: "Grand Total:",
    receipt_print: "Print Dossier",
    receipt_return: "Return to Showroom",

    // Contact Page
    contact_title: "Contact Showroom",
    contact_card_loc: "Showroom Location",
    contact_card_phone: "VIP Telephone",
    contact_card_email: "Direct Dispatch",
    contact_card_hours: "Showroom Hours",
    contact_form_title: "Commissioning & Acquisition Inquiry",
    contact_form_sub: "Whether you are commissioning a bespoke allocation, inquiring about vehicle provenance, or arranging private transport, our senior concierge will respond within 4 hours.",
    contact_field_name: "Full Name *",
    contact_field_email: "Email Address *",
    contact_field_phone: "Telephone / Signal *",
    contact_field_subject: "Inquiry Subject *",
    contact_field_message: "Inquiry Details *",
    contact_btn_send: "Send Message",
    map_title: "APEX MOTORS Flagship Showroom",
    map_desc: "740 5th Avenue, Luxury Mile, New York, NY 10019",
    map_btn: "Open in Global Navigation",

    // Blog Pages
    blog_title_page: "Editorial Dispatches",
    blog_search_ph: "Search editorial dispatches...",
    blog_topics: "Editorial Topics",
    blog_recents: "Recent Dispatches",
    blog_tags: "Focus Tags",
    blog_comment_title: "Leave an Editorial Comment",
    blog_comment_sub: "Join the discussion on supercar provenance and automotive engineering.",
    blog_comment_submit: "Post Comment",

    // Wishlist Modal
    wishlist_title: "Saved Supercars",
    wishlist_empty_title: "Your Wishlist is Empty",
    wishlist_empty_desc: "You haven't saved any supercars to your wishlist yet.",
    wishlist_browse: "Browse Collection",
    wishlist_clear: "Clear All",
    wishlist_continue: "Continue Browsing",

    // Login Modal
    login_title: "Private Client Portal",
    login_desc: "Access exclusive supercar allocations, private showroom viewings, and bespoke vehicle commissioning.",
    login_demo_hint: "Demo Mode: Enter any client name to simulate login.",
    login_name_label: "Client Full Name *",
    login_email_label: "Email Address *",
    login_submit: "Enter VIP Portal"
  },

  vi: {
    // Navigation
    nav_home: "Trang chủ",
    nav_shop: "Bộ sưu tập xe",
    nav_pages: "Trang",
    nav_shop_details: "Chi tiết xe",
    nav_cart: "Giỏ hàng",
    nav_checkout: "Thanh toán",
    nav_blog_details: "Chi tiết tin tức",
    nav_blog: "Tin tức",
    nav_contact: "Liên hệ",
    nav_shop_collection: "Bộ sưu tập xe",
    nav_editorial_blog: "Chuyên mục tin tức",
    nav_contact_showroom: "Liên hệ Showroom",

    // Top Bar & Header
    top_allocations: "Phân bổ Khách hàng Đặc quyền 2026/2027",
    top_demonstration: "Nền tảng Thử nghiệm",
    top_portal: "Cổng Khách hàng",
    header_portfolio_total: "Tổng danh mục",
    search_all_marques: "Tất cả thương hiệu",
    search_placeholder: "Tìm kiếm siêu xe mơ ước của bạn...",
    search_btn: "Tìm kiếm",
    support_hours: "Dịch vụ VIP & Ký gửi 24/7",

    // Buttons & Badges
    btn_details: "Chi tiết",
    btn_add_to_cart: "Thêm vào giỏ",
    btn_acquire: "Đặt mua",
    allocation_ready: "Sẵn sàng bàn giao",
    badge_exclusive: "Độc quyền",
    badge_track_legend: "Huyền thoại đường đua",
    badge_limited_edition: "Bản giới hạn",
    badge_rare_gem: "Tuyệt phẩm hiếm",
    badge_flagship: "Siêu phẩm cờ đầu",
    badge_hyper_gt: "Hyper GT",
    badge_track_only: "Bản chuyên đường đua",
    badge_all_electric: "Thuần điện",
    badge_megacar: "Megacar",
    badge_super_suv: "Siêu SUV",

    // Categories
    cat_all: "Tất cả mẫu xe",
    cat_hypercar: "Hypercar",
    cat_supercar: "Supercar",
    cat_sports_car: "Xe thể thao",
    cat_grand_tourer: "Grand Tourer",

    // Colors
    color_all: "Tất cả màu sắc",
    color_orange: "Cam",
    color_white: "Trắng",
    color_red: "Đỏ",
    color_blue: "Xanh dương",
    color_green: "Xanh lá",
    color_grey: "Xám",
    color_yellow: "Vàng",
    color_black: "Đen",
    color_purple: "Tím",

    // Homepage Hero
    hero_label: "BỘ SƯU TẬP SIÊU XE ĐẶC QUYỀN",
    hero_title: "BỨT PHÁ MỌI <span>GIỚI HẠN</span>",
    hero_subtitle: "Khám phá những mẫu siêu xe và hypercar phi thường nhất thế giới. Được thiết kế cho tốc độ đỉnh cao, chế tác thủ công tinh xảo theo tiêu chuẩn bespoke thượng lưu.",
    hero_explore: "Khám phá Bộ sưu tập",
    hero_details: "Xem chi tiết",

    // Homepage Sections
    marques_tagline: "Nhà sản xuất Đẳng cấp",
    marques_title: "Thương hiệu Danh giá",
    marques_subtitle: "Các phân bổ tuyển chọn từ những hãng kỹ thuật ô tô hàng đầu thế giới.",
    featured_tagline: "Siêu xe Nổi bật",
    featured_title: "Siêu phẩm Nổi bật Showroom",
    featured_subtitle: "Những tuyệt phẩm đường đua và kiệt tác lăn bánh hợp pháp sẵn sàng bàn giao ngay.",
    tab_all: "Tất cả mẫu xe",

    promo_porsche_tag: "Kỹ thuật Weissach",
    promo_porsche_title: "PORSCHE MOTORSPORT",
    promo_porsche_desc: "Chiến binh đường đua từ Weissach với khí động học chủ động đỉnh cao.",
    promo_lambo_tag: "Sant'Agata Bolognese",
    promo_lambo_title: "LAMBORGHINI V12 HPEV",
    promo_lambo_desc: "Kỷ nguyên siêu xe điện hóa từ Sant'Agata Bolognese.",
    promo_btn: "Khám phá ngay",

    col_latest: "Mới cập bến",
    col_rated: "Đánh giá cao nhất",
    col_popular: "Bộ sưu tập Ưa chuộng",

    blog_tagline: "Bản tin Apex",
    blog_title: "Tin tức Chuyên đề",
    blog_subtitle: "Phân tích chuyên sâu, kỹ thuật đỉnh cao và xu hướng thị trường xe siêu hiếm.",
    read_article: "Đọc bài viết",
    view_all_blogs: "Xem tất cả bài viết",

    // Shop Grid Page
    shop_title: "Danh mục Siêu xe",
    shop_breadcrumb: "Bộ sưu tập xe",
    shop_special_tagline: "Phân bổ Thượng hạng",
    shop_special_title: "Phiên bản Độc quyền & Giới hạn",
    filter_marque: "Hãng sản xuất / Thương hiệu",
    filter_budget: "Ngân sách Sở hữu",
    filter_category: "Phân khúc xe",
    filter_color: "Màu ngoại thất",
    filter_year: "Năm sản xuất",
    filter_reset: "Đặt lại bộ lọc",
    showing_results: "Hiển thị {start}–{end} trong số {total} siêu xe",
    sort_default: "Sắp xếp: Mặc định (Nổi bật)",
    sort_price_low: "Giá: Thấp đến Cao",
    sort_price_high: "Giá: Cao đến Thấp",
    sort_newest: "Mới cập bến",
    sort_name_az: "Tên xe: A - Z",
    sort_power_high: "Công suất: Cao đến Thấp",
    no_results_title: "Không tìm thấy siêu xe phù hợp",
    no_results_desc: "Hãy thử điều chỉnh khoảng giá, chọn lại hãng xe hoặc đặt lại toàn bộ bộ lọc.",

    // Product Details Page
    tab_desc: "Tổng quan & Mô tả",
    tab_tech: "Thông số Kỹ thuật",
    tab_warranty: "Bàn giao & Bảo hành VIP",
    tab_architectural_overview: "Tổng quan Thiết kế & Khí động học",
    tab_commissioning_title: "Chi tiết Hồ sơ & Bàn giao",
    tab_commissioning_desc: "Mỗi siêu xe trong kho APEX MOTORS đều trải qua quy trình kiểm định cơ học 180 điểm nghiêm ngặt. Toàn bộ hồ sơ bàn giao xuất xưởng chính hãng, chứng nhận nguồn gốc chủ sở hữu, chìa khóa viễn thông và bộ hành lý bespoke đi kèm nguyên bản.",
    spec_hp: "Công suất",
    spec_top_speed: "Tốc độ tối đa",
    spec_accel: "0–100 km/h",
    spec_torque: "Mô-men xoắn cực đại",
    spec_engine: "Khối động cơ",
    spec_trans: "Hộp số",
    spec_drive: "Hệ dẫn động",
    spec_color: "Màu ngoại thất",
    spec_chassis: "Cấu trúc khung gầm",
    spec_brakes: "Hệ thống phanh",
    spec_dry_weight: "Trọng lượng khô",
    spec_fuel: "Dung tích bình nhiên liệu",
    spec_emissions: "Tiêu chuẩn khí thải",
    spec_battery: "Kiến trúc Hybrid / Điện tử",
    warranty_f1_title: "Bảo hành mở rộng chính hãng 2 năm",
    warranty_f1_desc: "Bảo hành toàn diện hệ truyền động, hệ thống viễn trắc và cấu trúc composite trên phạm vi toàn cầu.",
    warranty_f2_title: "Vận chuyển khép kín kiểm soát khí hậu",
    warranty_f2_desc: "Vận chuyển hàng không chuyên dụng toàn cầu với dịch vụ mở kiện tiêu chuẩn găng tay trắng tại tư gia hoặc hangar riêng.",
    warranty_f3_title: "Bàn giao xe tại đường đua riêng",
    warranty_f3_desc: "Đặc quyền bàn giao trọn ngày tại trường đua cùng chuyên gia lái thử của nhà máy để khám phá giới hạn của cỗ máy.",
    btn_share_product: "Chia sẻ xe",
    btn_contact_showroom: "Liên hệ Showroom",
    related_tag: "Siêu xe Liên quan",
    related_title: "Cơ hội Sở hữu Tương tự",
    related_sub: "Các siêu phẩm hiệu năng cao tương đồng dành cho nhà sưu tập tinh hoa.",

    // Shopping Cart Page
    cart_breadcrumb: "Giỏ hàng",
    cart_title: "Danh mục Sở hữu Siêu xe",
    cart_th_supercar: "Siêu xe Phân bổ",
    cart_th_price: "Đơn giá (USD)",
    cart_th_units: "Số lượng",
    cart_th_total: "Tổng cộng",
    cart_continue: "Tiếp tục xem xe",
    cart_clear: "Xóa toàn bộ danh mục",
    cart_summary_title: "Tóm tắt Đơn hàng",
    cart_promo_label: "Mã Ưu Đãi Đặc Quyền",
    cart_promo_btn: "Áp dụng",
    cart_promo_hint: "Ưu đãi thử nghiệm: Nhập mã <strong>APEX10</strong> để giảm 10% (tối đa $50.000).",
    cart_subtotal: "Tạm tính danh mục:",
    cart_discount: "Ưu đãi đặc quyền VIP",
    cart_total: "Tổng chi phí cam kết:",
    cart_checkout_btn: "Tiến hành Ký gửi Thanh toán",
    cart_empty_title: "Giỏ hàng Sở hữu Siêu xe của bạn đang trống",
    cart_empty_desc: "Bạn chưa chọn lưu siêu xe nào vào danh mục sở hữu. Hãy khám phá bộ sưu tập hypercar, xe đua và biểu tượng hạng sang của chúng tôi.",
    cart_empty_btn: "Khám phá Danh mục Showroom",

    // Checkout Page
    checkout_title: "Ký gửi Bảo mật",
    checkout_box_title: "Thông tin Đăng ký & Hồ sơ Giao nhận",
    field_first_name: "Tên *",
    field_last_name: "Họ *",
    field_email: "Địa chỉ Email Khách hàng *",
    field_phone: "Số điện thoại / Liên lạc Signal *",
    field_country: "Quốc gia / Khu vực nhận xe *",
    field_city: "Thành phố *",
    field_address: "Địa chỉ Tư gia / Hangar riêng *",
    field_postal: "Mã bưu chính / ZIP *",
    field_notes: "Yêu cầu giao nhận đặc biệt / Ghi chú Bespoke",
    payment_method_title: "Phương thức Thanh toán & Ký gửi Thử nghiệm",
    payment_wire_title: "Ký gửi chuyển khoản ngân hàng VIP (Mô phỏng)",
    payment_wire_desc: "Chuyển khoản trực tiếp qua tài khoản ký gửi ngân hàng đầu tư quốc tế với chữ ký đa bên.",
    payment_crypto_title: "Thanh toán tài sản số bảo mật (USDT/BTC Mô phỏng)",
    payment_crypto_desc: "Giao dịch on-chain được xử lý an toàn qua hệ thống ví lạnh của tổ chức.",
    payment_loc_title: "Thư tín dụng ngân hàng tư nhân (L/C Mô phỏng)",
    payment_loc_desc: "Thư tín dụng không thể hủy ngang được xác nhận bởi định chế tài chính uy tín bậc nhất.",
    checkout_summary_title: "Tóm tắt Đơn hàng",
    checkout_btn: "Xác nhận Sở hữu & Ký gửi Hợp đồng",

    // Confirmation Receipt Modal
    receipt_title: "Xác nhận Đặt cọc Siêu xe Thành công",
    receipt_ref: "Mã Tham chiếu Hợp đồng:",
    receipt_client_info: "Thông tin Khách hàng",
    receipt_client: "Khách hàng:",
    receipt_email: "Email:",
    receipt_phone: "Điện thoại:",
    receipt_dest: "Điểm giao nhận:",
    receipt_acquired: "Siêu xe Đã chọn",
    receipt_subtotal: "Tạm tính:",
    receipt_incentive: "Ưu đãi",
    receipt_grand_total: "Tổng thanh toán:",
    receipt_print: "In Hồ sơ Thỏa thuận",
    receipt_return: "Quay về Showroom",

    // Contact Page
    contact_title: "Liên hệ Showroom",
    contact_card_loc: "Địa chỉ Showroom",
    contact_card_phone: "Đường dây nóng VIP",
    contact_card_email: "Hộp thư Trực tiếp",
    contact_card_hours: "Giờ mở cửa Showroom",
    contact_form_title: "Yêu cầu Tư vấn Đặt cọc & Sở hữu",
    contact_form_sub: "Dù quý khách muốn đặt xe theo cấu hình riêng, tìm hiểu nguồn gốc xe hay sắp xếp lịch vận chuyển riêng tư, đội ngũ concierge cao cấp của chúng tôi sẽ phản hồi trong vòng 4 giờ.",
    contact_field_name: "Họ và tên *",
    contact_field_email: "Địa chỉ Email *",
    contact_field_phone: "Số điện thoại / Signal *",
    contact_field_subject: "Tiêu đề / Siêu xe quan tâm *",
    contact_field_message: "Nội dung chi tiết yêu cầu *",
    contact_btn_send: "Gửi Tin Nhắn",
    map_title: "Showroom Cờ đầu APEX MOTORS",
    map_desc: "740 Đại lộ số 5, Luxury Mile, New York, NY 10019",
    map_btn: "Mở trong Bản đồ Toàn cầu",

    // Blog Pages
    blog_title_page: "Bản tin & Chuyên mục Siêu xe",
    blog_search_ph: "Tìm kiếm bài viết...",
    blog_topics: "Chủ đề Chuyên mục",
    blog_recents: "Bài viết Mới nhất",
    blog_tags: "Thẻ Chủ đề",
    blog_comment_title: "Để lại Bình luận Bảo mật",
    blog_comment_sub: "Tham gia thảo luận về di sản siêu xe và kỹ thuật chế tác ô tô đỉnh cao.",
    blog_comment_submit: "Gửi bình luận",

    // Wishlist Modal
    wishlist_title: "Siêu xe Đã lưu",
    wishlist_empty_title: "Danh sách Yêu thích Đang trống",
    wishlist_empty_desc: "Quý khách chưa lưu siêu xe nào vào danh sách yêu thích.",
    wishlist_browse: "Khám phá Bộ sưu tập",
    wishlist_clear: "Xóa tất cả",
    wishlist_continue: "Tiếp tục xem xe",

    // Login Modal
    login_title: "Cổng Khách hàng Đặc quyền",
    login_desc: "Tiếp cận các suất phân bổ siêu xe độc quyền, đặt lịch tham quan showroom riêng và đặt xe theo yêu cầu cá nhân hóa.",
    login_demo_hint: "Chế độ thử nghiệm: Nhập bất kỳ tên khách hàng nào để mô phỏng đăng nhập.",
    login_name_label: "Họ và tên Khách hàng *",
    login_email_label: "Địa chỉ Email *",
    login_submit: "Đăng nhập Cổng VIP"
  }
};

/**
 * Vietnamese Translations for all 18 Supercars
 * IMPORTANT: car.model and car.brand are strictly PRESERVED original.
 * Only description, overview, and technical specifications are translated.
 */
I18N.carTranslations = {
  "lamborghini-revuelto": {
    description: "Lamborghini Revuelto đánh dấu cột mốc mang tính cách mạng khi là siêu xe thể thao hybrid hiệu năng cao (HPEV) đầu tiên từ Sant'Agata Bolognese. Kết hợp khối động cơ V12 6.5L hút khí tự nhiên đặt giữa đầy uy lực với 3 mô-tơ điện từ thông hướng trục, Revuelto sản sinh công suất đáng kinh ngạc 1.001 mã lực thông qua hộp số ly hợp kép 8 cấp đặt ngang hoàn toàn mới.",
    overview: "Khung gầm liền khối bằng sợi carbon 'monofuselage', cánh gió khí động học chủ động tạo ra lực ép xuống mặt đường lớn hơn 61% so với Aventador Ultimae, cùng 13 chế độ lái trải dài từ Recharge đến Corsa.",
    technicalSpecs: {
      chassis: "Khung gầm Monofuselage sợi carbon với khung phụ trước đúc Forged Composites",
      brakes: "Phanh gốm carbon CCB Plus 410x38mm trước, 390x32mm sau",
      dryWeight: "1.772 kg",
      fuelTank: "63 Lít",
      emissions: "Đạt chuẩn khí thải Euro 6d-ISC-FCM",
      batteryCapacity: "Bộ pin Lithium-ion công suất cao 3.8 kWh"
    }
  },
  "porsche-911-gt3-rs": {
    description: "Porsche 911 GT3 RS là hiện thân trọn vẹn của DNA đua xe thể thao được hợp pháp hóa cho đường phố. Với cánh gió cổ thiên nga khổng lồ tích hợp hệ thống giảm lực cản (DRS) phong cách Công thức 1, kết cấu tản nhiệt đơn trung tâm và khung chống lật carbon, xe mang lại lực ép mặt đường vượt trội cùng độ chính xác vào cua tuyệt đỉnh.",
    overview: "Tạo ra 860 kg lực ép xuống mặt đường chủ động ở tốc độ 285 km/h. Vô lăng tích hợp 4 núm xoay điều chỉnh trực tiếp khóa vi sai, kiểm soát lực kéo cùng độ nén và độ hồi của giảm xóc khi đang vận hành.",
    technicalSpecs: {
      chassis: "Kết cấu siêu nhẹ thông minh kết hợp nhôm và nhựa gia cường sợi carbon (CFRP)",
      brakes: "Phanh gốm phức hợp Porsche (PCCB) 410mm trước, 390mm sau",
      dryWeight: "1.450 kg",
      fuelTank: "64 Lít (tùy chọn bình nhiên liệu mở rộng 90L)",
      emissions: "Đạt chuẩn Euro 6d-ISC-FCM",
      batteryCapacity: "Ắc quy khởi động trọng lượng nhẹ 12V"
    }
  },
  "ferrari-sf90-xx-stradale": {
    description: "SF90 XX Stradale là siêu xe đường phố đầu tiên thuộc chương trình thử nghiệm đỉnh cao XX Programme của Ferrari. Bứt phá mọi giới hạn khí động học đường đua cùng hệ thống động lực hybrid, xe sở hữu cánh gió sau cố định gợi nhớ huyền thoại F40, tạo ra 530 kg lực ép ở 250 km/h kết hợp khối động cơ sắc sảo 1.030 mã lực.",
    overview: "Sản xuất giới hạn chỉ 799 chiếc coupe trên toàn thế giới. Tích hợp bộ điều khiển ABS EVO độc quyền, thuật toán kích hoạt thêm công suất cho các vòng đua phân hạng và các chi tiết động cơ bằng titan bespoke.",
    technicalSpecs: {
      chassis: "Khung không gian hợp kim nhôm đa vật liệu kết hợp cấu trúc carbon siêu cứng",
      brakes: "Hệ thống phanh đua CCM carbon gốm tích hợp đĩa phanh cải tiến khí động học",
      dryWeight: "1.560 kg",
      fuelTank: "68 Lít",
      emissions: "Đạt chuẩn khí thải Euro 6d",
      batteryCapacity: "Bộ pin Lithium-ion 7.9 kWh (di chuyển thuần điện 25 km)"
    }
  },
  "bugatti-chiron-pur-sport": {
    description: "Được chế tác chuyên biệt cho khả năng xử lý linh hoạt phi thường và gia tốc ngang vượt trội, Chiron Pur Sport kết hợp động cơ W16 8.0L danh tiếng với tỷ số truyền ngắn hơn 15%, bộ mâm magie siêu nhẹ và cánh gió sau bằng sợi carbon cố định 1,9 mét cho độ bám đường tuyệt đối.",
    overview: "Cỗ máy chinh phục góc cua không khoan nhượng. Tăng tốc từ 60 lên 120 km/h ở cấp số 6 chỉ trong 4,4 giây—nhanh hơn gần 3 giây so với Chiron tiêu chuẩn.",
    technicalSpecs: {
      chassis: "Khung liền khối carbon monocoque độ cứng xoắn tương đương xe đua LMP1",
      brakes: "Đĩa phanh carbon gốm với kẹp phanh titan in 3D 8 pít-tông",
      dryWeight: "1.945 kg",
      fuelTank: "100 Lít",
      emissions: "Đạt chuẩn Euro 6d-TEMP",
      batteryCapacity: "Hệ thống điện tử phụ trợ 12V hạng nặng"
    }
  },
  "mclaren-750s-coupe": {
    description: "Kế thừa di sản lẫy lừng của đàn anh 720S, McLaren 750S nhẹ hơn 30 kg với 30% linh kiện được nâng cấp hoặc thiết kế mới hoàn toàn. Động cơ V8 4.0L tăng áp kép sản sinh 750 mã lực, truyền qua hộp số 7 cấp siêu nhanh kết hợp hệ thống treo thủy lực McLaren Proactive Chassis Control III thế hệ mới.",
    overview: "Tỷ lệ công suất trên trọng lượng dẫn đầu phân khúc đạt 579 mã lực/tấn. Hệ thống ống xả thép không gỉ đặt cao ở trung tâm lấy cảm hứng trực tiếp từ siêu phẩm McLaren P1.",
    technicalSpecs: {
      chassis: "Khung monocoque sợi carbon MonoCage II-S tích hợp khung chống lật",
      brakes: "Phanh gốm carbon 390mm đúc nguyên khối kết hợp kẹp phanh monobloc",
      dryWeight: "1.277 kg",
      fuelTank: "72 Lít",
      emissions: "Đạt chuẩn Euro 6d-FCM",
      batteryCapacity: "Bộ ắc quy khởi động Lithium-ion siêu nhẹ"
    }
  },
  "aston-martin-valkyrie": {
    description: "Đồng phát triển cùng chuyên gia khí động học huyền thoại Adrian Newey của đội đua Red Bull Racing, Aston Martin Valkyrie đưa trải nghiệm xe đua Công thức 1 gần nhất lên đường phố. Khối động cơ V12 6.5L hút khí tự nhiên từ Cosworth có thể chạm ngưỡng vòng tua 11.100 vòng/phút, mang đến bản hòa âm động cơ đầy mê hoặc.",
    overview: "Tạo ra tới 1.100 kg lực ép khí động học ở tốc độ cao mà không cần cánh gió cồng kềnh. Tư thế ngồi nghiêng ngả nâng cao chân mang đúng chuẩn xe đua F1 thực thụ.",
    technicalSpecs: {
      chassis: "Khung vỏ hoàn toàn bằng sợi carbon nguyên khối không chứa bất kỳ cấu trúc thép nào",
      brakes: "Hệ thống phanh carbon-carbon phong cách xe đua chuyên nghiệp F1",
      dryWeight: "1.030 kg",
      fuelTank: "55 Lít",
      emissions: "Đạt chuẩn kiểm định Euro 6 bespoke",
      batteryCapacity: "Hệ thống phục hồi động năng KERS Hybrid từ Rimac"
    }
  },
  "koenigsegg-jesko-attack": {
    description: "Koenigsegg Jesko Attack là cỗ máy tạo lực ép tối thượng được đặt theo tên của thân phụ nhà sáng lập Christian von Koenigsegg. Trang bị động cơ V8 5.0L trục khuỷu phẳng tăng áp kép sản sinh tới 1.600 mã lực với nhiên liệu sinh học E85, đi kèm hộp số 9 cấp Light Speed Transmission (LST) đột phá.",
    overview: "Đánh lái bánh sau chủ động, hệ thống treo Triplex bổ sung giảm chấn trung tâm triệt tiêu hiện tượng nhấc đầu khi tăng tốc mãnh liệt, cùng cửa mở xoay đồng bộ dihedral synchro-helix trứ danh.",
    technicalSpecs: {
      chassis: "Khung monocoque sợi carbon mật độ cao với cấu trúc tổ ong nhôm siêu nhẹ",
      brakes: "Phanh đĩa gốm carbon Koenigsegg 410mm trước, 395mm sau",
      dryWeight: "1.320 kg",
      fuelTank: "72 Lít",
      emissions: "Đạt chuẩn khí thải quốc tế Euro 6",
      batteryCapacity: "Hệ thống quản lý năng lượng thông minh Koenigsegg"
    }
  },
  "ferrari-296-gtb": {
    description: "Định nghĩa lại niềm vui cầm lái trong kỷ nguyên mới, Ferrari 296 GTB giới thiệu động cơ V6 2.9L góc nghiêng rộng 120° tăng áp kép kết hợp mô-tơ điện plug-in, cho tổng công suất 830 mã lực với phản hồi chân ga tức thì và cảm giác lái sắc sảo đến từng milimet.",
    overview: "Được trang bị gói hiệu năng cao Assetto Fiorano: giảm xóc đua Multimatic DSSV điều chỉnh cơ học, các cánh lướt gió carbon và kính sau trọng lượng nhẹ bằng vật liệu Lexan.",
    technicalSpecs: {
      chassis: "Khung xe hợp kim nhôm thế hệ mới với trục cơ sở ngắn hơn 50mm gia tăng sự linh hoạt",
      brakes: "Phanh gốm carbon điện tử thông minh Aero calipers tích hợp làm mát",
      dryWeight: "1.470 kg",
      fuelTank: "65 Lít",
      emissions: "Đạt chuẩn khí thải Euro 6d",
      batteryCapacity: "Bộ pin cao áp 7.45 kWh"
    }
  },
  "porsche-918-spyder": {
    description: "Một mảnh ghép trong bộ ba siêu xe 'Holy Trinity' huyền thoại, Porsche 918 Spyder kết hợp động cơ V8 4.6L hút khí tự nhiên đạt vòng tua 9.150 vòng/phút cùng hai mô-tơ điện độc lập trên hai cầu, được bao bọc trong khung carbon liền khối siêu nhẹ với gói trang bị khí động học Weissach Package danh giá.",
    overview: "Chiến binh đầu tiên hoàn thành vòng đua Nürburgring Nordschleife dưới 7 phút. Khả năng vận hành êm ái thuần điện hoặc bứt tốc như sấm sét nhờ hệ thống đánh lái trục sau chủ động.",
    technicalSpecs: {
      chassis: "Khung monocoque và khung phụ bằng nhựa gia cường sợi carbon (CFRP)",
      brakes: "Hệ thống phanh gốm composite PCCB hiệu năng cao 410mm trước, 390mm sau",
      dryWeight: "1.634 kg",
      fuelTank: "70 Lít",
      emissions: "Đạt chuẩn Euro 6",
      batteryCapacity: "Bộ pin Lithium-ion làm mát bằng chất lỏng 6.8 kWh"
    }
  },
  "lamborghini-huracan-sterrato": {
    description: "Huracán Sterrato là siêu xe thể thao địa hình đầu tiên trên thế giới trang bị động cơ V10 5.2L hút khí tự nhiên. Được sinh ra để chinh phục đường đất cát và địa hình phức tạp nhờ hệ thống lái phong cách rally, khoảng sáng gầm xe tăng cường và họng hút gió nóc xe đặc trưng.",
    overview: "Chế độ lái Rally chuyên biệt cho địa hình độ bám thấp, bộ lốp run-flat đa địa hình Bridgestone Dueler bespoke và cụm đèn LED trợ sáng thể thao gắn cản trước.",
    technicalSpecs: {
      chassis: "Khung hybrid nhôm và sợi carbon gia cường bảo vệ gầm bằng nhôm nguyên tấm",
      brakes: "Phanh đĩa gốm carbon CCB thông gió kép 380mm trước, 356mm sau",
      dryWeight: "1.470 kg",
      fuelTank: "80 Lít",
      emissions: "Đạt chuẩn khí thải Euro 6d",
      batteryCapacity: "Ắc quy hiệu năng cao 12V"
    }
  },
  "mclaren-p1-gtr": {
    description: "Được tạo ra như cỗ máy đường đua thuần khiết nhất của McLaren, sau đó được xưởng Lanzante Motorsport chuyển đổi hợp pháp hóa để lăn bánh trên đường phố. Sở hữu vệt bánh trước mở rộng 84 mm, hệ truyền động hybrid 1.000 mã lực cùng cánh gió sau cố định khổng lồ tạo lực bám mặt đường phi thường.",
    overview: "Một trong 58 khung xe GTR từng được sản xuất trên toàn cầu. Trang bị kính phụ polycarbonate có cửa trượt đua xe cùng khoang lái ghế đua bucket bằng sợi carbon nguyên khối.",
    technicalSpecs: {
      chassis: "Khung monocoque carbon siêu bền McLaren MonoCage hoàn toàn từ sợi carbon",
      brakes: "Đĩa phanh carbon gốm Akebono phủ lớp hạt carbon chống mài mòn",
      dryWeight: "1.340 kg",
      fuelTank: "72 Lít",
      emissions: "Chứng nhận chuyển đổi đường phố hợp pháp bởi Lanzante",
      batteryCapacity: "Bộ pin sạc nhanh hiệu năng cao P1 Track Pack"
    }
  },
  "bugatti-tourbillon": {
    description: "Khởi đầu kỷ nguyên hoàn toàn mới của Bugatti. Tourbillon từ bỏ bộ tăng áp để chuyển sang động cơ V16 8.3L hút khí tự nhiên góc 90° tuyệt mỹ do Cosworth phát triển, kết hợp cùng 3 mô-tơ điện đem lại công suất kinh ngạc 1.800 mã lực với vòng tua lên tới 9.000 vòng/phút.",
    overview: "Cụm đồng hồ cơ học độc nhất vô nhị chế tác thủ công bởi các nghệ nhân đồng hồ Thụy Sĩ từ hơn 600 chi tiết bằng titan, sapphire và đá hồng ngọc ruby.",
    technicalSpecs: {
      chassis: "Khung monocoque carbon thế hệ tiếp theo tích hợp cụm pin cấu trúc chịu lực",
      brakes: "Hệ thống phanh gốm carbon siêu việt tích hợp công nghệ làm mát chủ động",
      dryWeight: "1.995 kg",
      fuelTank: "90 Lít",
      emissions: "Đạt chuẩn khí thải Euro 6e",
      batteryCapacity: "Bộ pin Lithium-ion 800V công suất cao 25 kWh"
    }
  },
  "aston-martin-dbs-770-ultimate": {
    description: "Lời chào tạm biệt đầy kiêu hãnh của dòng xe Super GT cờ đầu Aston Martin. Sở hữu sức mạnh 770 mã lực từ cỗ máy V12 5.2L tăng áp kép, trục lái gắn cứng được tái thiết kế và các chi tiết carbon khí động học tinh chỉnh cho những hành trình xuyên lục địa đỉnh cao.",
    overview: "Số lượng giới hạn chỉ 300 chiếc coupe trên toàn thế giới. Nội thất bọc da bán anilin Sports Plus và Alcantara may họa tiết quả trám cùng logo khắc laser tinh tế.",
    technicalSpecs: {
      chassis: "Cấu trúc thân vỏ bằng nhôm dập liên kết kết hợp nắp ca-pô và cánh gió carbon",
      brakes: "Phanh gốm carbon 410mm trước, 360mm sau chịu nhiệt độ cao cực hạn",
      dryWeight: "1.845 kg",
      fuelTank: "78 Lít",
      emissions: "Đạt chuẩn Euro 6d",
      batteryCapacity: "Ắc quy phụ trợ AGM 12V 90Ah"
    }
  },
  "koenigsegg-gemera": {
    description: "Mẫu siêu xe 'Mega-GT' đầu tiên trên thế giới cung cấp 4 chỗ ngồi rộng rãi cho người lớn, khoang hành lý chứa đủ 4 vali tiêu chuẩn và công suất không tưởng 2.300 mã lực từ động cơ V8 5.0L Hot-V tăng áp kép kết hợp cùng mô-tơ điện 'Dark Matter' độc quyền.",
    overview: "Thiết kế không có cột B với cửa xoay dihedral synchro-helix tự động mở rộng cho cả hai hàng ghế ra vào dễ dàng. Trang bị 4 hộc để cốc có tính năng làm mát và sưởi ấm độc lập.",
    technicalSpecs: {
      chassis: "Khung liền khối sợi carbon với độ cứng xoắn kỷ lục 40.000 Nm/độ",
      brakes: "Phanh gốm carbon đặc chế Koenigsegg 410mm 6 pít-tông",
      dryWeight: "1.990 kg",
      fuelTank: "115 Lít (hỗ trợ nhiên liệu tái tạo E85 / X-Fuel)",
      emissions: "Đạt chuẩn khí thải Euro 6d toàn cầu",
      batteryCapacity: "Bộ pin làm mát ngập dầu 850V dung lượng 14 kWh"
    }
  },
  "ferrari-purosangue": {
    description: "Mẫu xe thể thao 4 cửa, 4 chỗ đầu tiên trong lịch sử Ferrari, giữ trọn di sản nguyên bản với động cơ V12 6.5L hút khí tự nhiên đặt giữa trước sản sinh 725 mã lực không cần tăng áp hay hybrid, đi cùng công nghệ hệ thống treo chủ động Multimatic đột phá.",
    overview: "Phân bổ trọng lượng tối ưu 49:51% trước sau. Bốn ghế da độc lập phong cách lounge sang trọng tích hợp sưởi, thông gió và mát-xa đa điểm.",
    technicalSpecs: {
      chassis: "Khung hợp kim nhôm hoàn toàn mới kết hợp nóc xe bằng sợi carbon siêu nhẹ",
      brakes: "Phanh gốm carbon CCM-R Plus 398mm trước, 380mm sau",
      dryWeight: "2.033 kg",
      fuelTank: "100 Lít",
      emissions: "Đạt chuẩn khí thải Euro 6d",
      batteryCapacity: "Ắc quy lithium-ion phụ trợ 12V"
    }
  },
  "porsche-taycan-turbo-gt": {
    description: "Mẫu xe Porsche thương mại tăng tốc nhanh nhất trong lịch sử. Đạt công suất đỉnh lên tới 1.092 mã lực khi kích hoạt chế độ Attack Mode, phá vỡ kỷ lục vòng đua xe điện thương mại tại cả Nürburgring Nordschleife và WeatherTech Raceway Laguna Seca.",
    overview: "Gói trang bị Weissach lược bỏ hàng ghế sau giúp giảm 75 kg trọng lượng, thay bằng khay chứa đồ bằng carbon bespoke. Đi kèm cánh gió sau carbon cố định và bộ khuếch tán gầm khí động học toàn phần.",
    technicalSpecs: {
      chassis: "Khung gầm nhôm-thép tích hợp hệ thống treo khí nén chủ động Porsche Active Ride",
      brakes: "Phanh đĩa gốm siêu nhẹ Porsche Ceramic Composite Brake (PCCB) kẹp phanh vàng",
      dryWeight: "2.220 kg",
      fuelTank: "Thuần điện (Không sử dụng xăng)",
      emissions: "Không phát thải trực tiếp (Zero Emissions)",
      batteryCapacity: "Pin hiệu năng cao Performance Battery Plus 97.0 kWh (Kiến trúc 800V)"
    }
  },
  "lamborghini-countach-lpi-800-4": {
    description: "Tác phẩm kỷ niệm 50 năm ngày ra mắt của biểu tượng poster xe huyền thoại. Tái hiện lại kiểu dáng hình nêm sắc sảo kinh điển với hệ truyền động hybrid nhẹ siêu tụ điện kết hợp động cơ V12 hiện đại, truyền 814 mã lực tới cả bốn bánh.",
    overview: "Giới hạn nghiêm ngặt chỉ 112 chiếc được đánh số thứ tự trên toàn cầu. Đèn hậu lục giác, cửa sổ trời dạng rãnh kính periscopio và bộ mâm rèn phong cách đĩa quay điện thoại hoài cổ.",
    technicalSpecs: {
      chassis: "Khung monocoque hoàn toàn bằng sợi carbon với khung phụ nhôm trước và sau",
      brakes: "Phanh đĩa gốm carbon CCB 400x38mm trước, 380x38mm sau",
      dryWeight: "1.595 kg",
      fuelTank: "70 Lít",
      emissions: "Đạt chuẩn khí thải Euro 6d",
      batteryCapacity: "Bộ siêu tụ điện 48V độc quyền nhẹ hơn 3 lần so với pin lithium cùng dung lượng"
    }
  },
  "bugatti-bolide": {
    description: "Mẫu xe cực đoan, không thỏa hiệp và nhanh nhất trong lịch sử hiện đại của Bugatti. Được chế tạo theo tiêu chuẩn an toàn đua xe thể thao FIA LMH, Bolide kết hợp khối động cơ W16 1.850 mã lực với trọng lượng khô chỉ 1.450 kg, đạt tỷ lệ vàng 0,67 kg/mã lực chưa từng có.",
    overview: "Hốc gió trên nóc xe có thể biến đổi bề mặt dạng lúm đồng tiền giúp giảm 10% lực cản khí động học ở tốc độ cao. Tạo ra tới 3.000 kg lực ép xuống mặt đường ở 320 km/h.",
    technicalSpecs: {
      chassis: "Khung monocoque carbon độ bền cao tiêu chuẩn đua xe thể thao FIA LMH",
      brakes: "Hệ thống phanh đua carbon-carbon hoàn toàn với kẹp phanh gốm chịu nhiệt",
      dryWeight: "1.450 kg",
      fuelTank: "120 Lít tiêu chuẩn an toàn bình xăng đua FIA FT3",
      emissions: "Phiên bản chuyên đường đua (Track-Only Homologation)",
      batteryCapacity: "Hệ thống điện đua xe thể thao 12V quân sự"
    }
  }
};

/**
 * Blog Article Translations for all 6 Posts
 */
I18N.blogTranslations = {
  "evolution-of-the-porsche-911": {
    title: "Sự tiến hóa của Porsche 911: Từ mẫu 901 nguyên bản đến chiến binh GT3 RS đường đua",
    excerpt: "Hành trình sáu thập kỷ hoàn thiện hình bóng thể thao kinh điển và nghệ thuật làm chủ vị trí động cơ đặt sau."
  },
  "lamborghini-revuelto-v12-hybrid-era": {
    title: "Lamborghini Revuelto & Khởi nguyên của Kỷ nguyên Siêu xe Điện hóa V12 HPEV",
    excerpt: "Cách Sant'Agata Bolognese gìn giữ linh hồn động cơ V12 hút khí tự nhiên trong thời đại điện hóa toàn cầu."
  },
  "ferrari-aerodynamics-xx-programme": {
    title: "Bí mật Khí động học Đường đua Ferrari: Di sản từ Dự án Đỉnh cao XX Programme",
    excerpt: "Khám phá cách phòng thí nghiệm tốc độ Maranello biến những sáng chế xe đua F1 thành công nghệ thương mại."
  },
  "bugatti-w16-to-v16-legacy": {
    title: "Từ Đỉnh cao W16 đến Tuyệt tác V16: Bước nhảy Kỷ nguyên Động lực học của Bugatti",
    excerpt: "Nhìn lại 20 năm thống trị của cỗ máy quad-turbo W16 và sự xuất hiện chấn động của khối động cơ V16 hút khí tự nhiên."
  },
  "mclaren-carbon-monocoque-secrets": {
    title: "Bí quyết Khung carbon Liền khối McLaren: Khởi nguồn từ Đường đua Công thức 1",
    excerpt: "Tìm hiểu cấu trúc MonoCell và MonoCage đã mang lại tỷ lệ công suất trên trọng lượng vượt trội cho McLaren như thế nào."
  },
  "supercar-investment-collectors-guide": {
    title: "Cẩm nang Nhà Sưu tập: Đầu tư Siêu xe và Giá trị Tài sản Tăng trưởng Vượt trội",
    excerpt: "Phân tích biến động thị trường xe siêu hiếm, giá trị lưu giữ nguồn gốc xe và các nguyên tắc bảo toàn tài sản cho nhà đầu tư."
  }
};

// Auto-run when translations script is loaded
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => I18N.init());
  } else {
    I18N.init();
  }
}
