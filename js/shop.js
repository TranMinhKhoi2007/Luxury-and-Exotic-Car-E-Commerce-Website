/**
 * APEX MOTORS - Shop Catalog Controller
 * Handles Multi-attribute Filtering, Sorting, Dynamic Pagination & URL Search State
 */

const Shop = {
  state: {
    search: "",
    brand: "all",
    category: "all",
    color: "all",
    minPrice: 0,
    maxPrice: 5000000,
    year: "all",
    sortBy: "default",
    currentPage: 1,
    itemsPerPage: 6
  },

  init() {
    this.parseUrlParams();
    this.setupSidebarFilters();
    this.setupSorting();
    this.renderCatalog();
    this.renderDiscountHighlights();

    // Bind card event delegation
    const grid = document.getElementById("shop-products-grid");
    if (grid) {
      Products.bindCardEvents(grid);
    }
  },

  /**
   * Parse query parameters on page load
   */
  parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("search")) this.state.search = params.get("search").trim();
    if (params.has("brand")) this.state.brand = params.get("brand").trim();
    if (params.has("category")) this.state.category = params.get("category").trim();
    if (params.has("color")) this.state.color = params.get("color").trim();
    if (params.has("minPrice")) this.state.minPrice = parseInt(params.get("minPrice"), 10) || 0;
    if (params.has("maxPrice")) this.state.maxPrice = parseInt(params.get("maxPrice"), 10) || 5000000;
    if (params.has("sort")) this.state.sortBy = params.get("sort").trim();
    if (params.has("page")) this.state.currentPage = parseInt(params.get("page"), 10) || 1;
  },

  /**
   * Filter and sort cars based on current state
   * @returns {Object[]}
   */
  getFilteredCars() {
    return APEX_DATA.cars.filter(car => {
      // Search query (matches model, brand, engine, category)
      if (this.state.search) {
        const query = this.state.search.toLowerCase();
        const matches = 
          car.model.toLowerCase().includes(query) ||
          car.brand.toLowerCase().includes(query) ||
          car.engine.toLowerCase().includes(query) ||
          car.category.toLowerCase().includes(query) ||
          car.color.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Brand filter
      if (this.state.brand && this.state.brand.toLowerCase() !== "all") {
        if (car.brand.toLowerCase() !== this.state.brand.toLowerCase()) return false;
      }

      // Category filter
      if (this.state.category && this.state.category.toLowerCase() !== "all") {
        if (car.category.toLowerCase() !== this.state.category.toLowerCase()) return false;
      }

      // Color filter
      if (this.state.color && this.state.color.toLowerCase() !== "all") {
        if (car.color.toLowerCase() !== this.state.color.toLowerCase()) return false;
      }

      // Year filter
      if (this.state.year && this.state.year !== "all") {
        if (car.year.toString() !== this.state.year.toString()) return false;
      }

      // Price filter
      if (car.price < this.state.minPrice || car.price > this.state.maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (this.state.sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return b.year - a.year;
        case "name-az":
          return a.model.localeCompare(b.model);
        case "horsepower-high":
          return b.horsepower - a.horsepower;
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  },

  /**
   * Render catalog grid, counts, and pagination
   */
  renderCatalog() {
    const grid = document.getElementById("shop-products-grid");
    const countEl = document.getElementById("shop-results-count");
    const paginationEl = document.getElementById("shop-pagination");

    if (!grid) return;

    const filtered = this.getFilteredCars();
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / this.state.itemsPerPage) || 1;

    // Constrain current page
    if (this.state.currentPage > totalPages) this.state.currentPage = totalPages;
    if (this.state.currentPage < 1) this.state.currentPage = 1;

    const startIndex = (this.state.currentPage - 1) * this.state.itemsPerPage;
    const endIndex = Math.min(startIndex + this.state.itemsPerPage, totalItems);
    const pageItems = filtered.slice(startIndex, endIndex);

    // Update results count
    if (countEl) {
      if (totalItems === 0) {
        countEl.textContent = "0 supercars found";
      } else {
        countEl.textContent = `Showing ${startIndex + 1}–${endIndex} of ${totalItems} supercars`;
      }
    }

    // Render Grid
    if (pageItems.length === 0) {
      grid.innerHTML = `
        <div class="catalog-empty-state">
          <i class="fa-solid fa-car-tunnel empty-icon"></i>
          <h3>No Supercars Match Your Filter Criteria</h3>
          <p>Try refining your search keyword, adjusting the price ceiling, or resetting the brand filters.</p>
          <button type="button" class="btn btn-gold" id="btn-reset-filters">Reset All Filters</button>
        </div>
      `;
      const resetBtn = grid.querySelector("#btn-reset-filters");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => this.resetFilters());
      }
    } else {
      grid.innerHTML = pageItems.map(car => Products.renderCard(car)).join("");
    }

    // Render Pagination
    if (paginationEl) {
      if (totalPages <= 1) {
        paginationEl.innerHTML = "";
      } else {
        let pagHtml = "";
        // Prev button
        if (this.state.currentPage > 1) {
          pagHtml += `<button type="button" class="page-link" data-page="${this.state.currentPage - 1}"><i class="fa-solid fa-chevron-left"></i></button>`;
        }

        for (let i = 1; i <= totalPages; i++) {
          pagHtml += `
            <button 
              type="button" 
              class="page-link ${i === this.state.currentPage ? 'is-active' : ''}" 
              data-page="${i}"
            >${i}</button>
          `;
        }

        // Next button
        if (this.state.currentPage < totalPages) {
          pagHtml += `<button type="button" class="page-link" data-page="${this.state.currentPage + 1}"><i class="fa-solid fa-chevron-right"></i></button>`;
        }

        paginationEl.innerHTML = pagHtml;

        paginationEl.querySelectorAll(".page-link").forEach(btn => {
          btn.addEventListener("click", () => {
            const targetPage = parseInt(btn.getAttribute("data-page"), 10);
            this.state.currentPage = targetPage;
            this.renderCatalog();
            window.scrollTo({ top: grid.offsetTop - 120, behavior: "smooth" });
          });
        });
      }
    }
  },

  /**
   * Render Special Offer / Promotional section
   */
  renderDiscountHighlights() {
    const promoContainer = document.getElementById("shop-discount-slider");
    if (!promoContainer) return;

    const promoCars = APEX_DATA.cars.filter(c => c.originalPrice !== null || c.badge === "Exclusive").slice(0, 3);
    promoContainer.innerHTML = promoCars.map(car => Products.renderCard(car)).join("");
    Products.bindCardEvents(promoContainer);
  },

  /**
   * Setup sidebar filter inputs and update active UI
   */
  setupSidebarFilters() {
    // Brand Radio/Checkboxes
    const brandContainer = document.getElementById("sidebar-brand-filters");
    if (brandContainer) {
      const brands = ["All", ...APEX_DATA.brands.map(b => b.name)];
      brandContainer.innerHTML = brands.map(b => {
        const count = b === "All" 
          ? APEX_DATA.cars.length 
          : APEX_DATA.cars.filter(c => c.brand.toLowerCase() === b.toLowerCase()).length;
        const isChecked = this.state.brand.toLowerCase() === b.toLowerCase();
        return `
          <label class="filter-radio-label ${isChecked ? 'is-selected' : ''}">
            <input type="radio" name="filter-brand" value="${b}" ${isChecked ? 'checked' : ''} />
            <span class="filter-name">${b}</span>
            <span class="filter-count">(${count})</span>
          </label>
        `;
      }).join("");

      brandContainer.querySelectorAll('input[name="filter-brand"]').forEach(radio => {
        radio.addEventListener("change", (e) => {
          this.state.brand = e.target.value;
          this.state.currentPage = 1;
          this.syncSidebarUI();
          this.renderCatalog();
        });
      });
    }

    // Category Radio/Filters
    const categoryContainer = document.getElementById("sidebar-category-filters");
    if (categoryContainer) {
      const categories = ["All", "Supercar", "Hypercar", "Sports Car", "Grand Tourer"];
      categoryContainer.innerHTML = categories.map(cat => {
        const count = cat === "All"
          ? APEX_DATA.cars.length
          : APEX_DATA.cars.filter(c => c.category.toLowerCase() === cat.toLowerCase()).length;
        const isChecked = this.state.category.toLowerCase() === cat.toLowerCase();
        return `
          <label class="filter-radio-label ${isChecked ? 'is-selected' : ''}">
            <input type="radio" name="filter-category" value="${cat}" ${isChecked ? 'checked' : ''} />
            <span class="filter-name">${cat}</span>
            <span class="filter-count">(${count})</span>
          </label>
        `;
      }).join("");

      categoryContainer.querySelectorAll('input[name="filter-category"]').forEach(radio => {
        radio.addEventListener("change", (e) => {
          this.state.category = e.target.value;
          this.state.currentPage = 1;
          this.syncSidebarUI();
          this.renderCatalog();
        });
      });
    }

    // Color Filters
    const colorContainer = document.getElementById("sidebar-color-filters");
    if (colorContainer) {
      const colors = ["All", "Orange", "Red", "Blue", "Black", "White", "Yellow", "Silver"];
      colorContainer.innerHTML = colors.map(col => {
        const isSelected = this.state.color.toLowerCase() === col.toLowerCase();
        const hexMap = {
          orange: "#E65100",
          red: "#D32F2F",
          blue: "#1976D2",
          black: "#111111",
          white: "#F5F5F5",
          yellow: "#FBC02D",
          silver: "#9E9E9E",
          all: "#C9A45C"
        };
        const dotColor = hexMap[col.toLowerCase()] || "#888888";
        return `
          <button 
            type="button" 
            class="color-filter-btn ${isSelected ? 'is-selected' : ''}" 
            data-color="${col}"
            title="${col}"
          >
            <span class="color-dot" style="background-color: ${dotColor};"></span>
            <span class="color-name">${col}</span>
          </button>
        `;
      }).join("");

      colorContainer.querySelectorAll(".color-filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const col = btn.getAttribute("data-color");
          this.state.color = col;
          this.state.currentPage = 1;
          this.syncSidebarUI();
          this.renderCatalog();
        });
      });
    }

    // Year Filter
    const yearContainer = document.getElementById("sidebar-year-filters");
    if (yearContainer) {
      const years = ["All", "2025", "2024", "2023", "2022"];
      yearContainer.innerHTML = years.map(yr => {
        const isSelected = this.state.year.toString() === yr;
        return `
          <button 
            type="button" 
            class="year-filter-btn ${isSelected ? 'is-selected' : ''}" 
            data-year="${yr}"
          >${yr}</button>
        `;
      }).join("");

      yearContainer.querySelectorAll(".year-filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          this.state.year = btn.getAttribute("data-year");
          this.state.currentPage = 1;
          this.syncSidebarUI();
          this.renderCatalog();
        });
      });
    }

    // Price Slider Range
    const priceSlider = document.getElementById("price-range-slider");
    const priceDisplay = document.getElementById("price-range-val");
    if (priceSlider && priceDisplay) {
      priceSlider.value = this.state.maxPrice;
      priceDisplay.textContent = Products.formatPrice(this.state.maxPrice);

      priceSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        this.state.maxPrice = val;
        priceDisplay.textContent = Products.formatPrice(val);
        this.state.currentPage = 1;
        this.renderCatalog();
      });
    }

    // Reset Filters Button
    const resetTrigger = document.getElementById("sidebar-reset-btn");
    if (resetTrigger) {
      resetTrigger.addEventListener("click", () => this.resetFilters());
    }
  },

  syncSidebarUI() {
    // Update selected labels
    document.querySelectorAll("#sidebar-brand-filters .filter-radio-label").forEach(l => {
      const inp = l.querySelector("input");
      if (inp && inp.value.toLowerCase() === this.state.brand.toLowerCase()) {
        l.classList.add("is-selected");
        inp.checked = true;
      } else {
        l.classList.remove("is-selected");
      }
    });

    document.querySelectorAll("#sidebar-category-filters .filter-radio-label").forEach(l => {
      const inp = l.querySelector("input");
      if (inp && inp.value.toLowerCase() === this.state.category.toLowerCase()) {
        l.classList.add("is-selected");
        inp.checked = true;
      } else {
        l.classList.remove("is-selected");
      }
    });

    document.querySelectorAll("#sidebar-color-filters .color-filter-btn").forEach(btn => {
      if (btn.getAttribute("data-color").toLowerCase() === this.state.color.toLowerCase()) {
        btn.classList.add("is-selected");
      } else {
        btn.classList.remove("is-selected");
      }
    });

    document.querySelectorAll("#sidebar-year-filters .year-filter-btn").forEach(btn => {
      if (btn.getAttribute("data-year").toString() === this.state.year.toString()) {
        btn.classList.add("is-selected");
      } else {
        btn.classList.remove("is-selected");
      }
    });
  },

  /**
   * Setup sorting dropdown
   */
  setupSorting() {
    const sortSelect = document.getElementById("shop-sort-select");
    if (!sortSelect) return;

    sortSelect.value = this.state.sortBy;
    sortSelect.addEventListener("change", (e) => {
      this.state.sortBy = e.target.value;
      this.state.currentPage = 1;
      this.renderCatalog();
    });
  },

  /**
   * Reset all state to defaults
   */
  resetFilters() {
    this.state.search = "";
    this.state.brand = "all";
    this.state.category = "all";
    this.state.color = "all";
    this.state.minPrice = 0;
    this.state.maxPrice = 5000000;
    this.state.year = "all";
    this.state.sortBy = "default";
    this.state.currentPage = 1;

    const priceSlider = document.getElementById("price-range-slider");
    const priceDisplay = document.getElementById("price-range-val");
    if (priceSlider && priceDisplay) {
      priceSlider.value = 5000000;
      priceDisplay.textContent = Products.formatPrice(5000000);
    }

    const sortSelect = document.getElementById("shop-sort-select");
    if (sortSelect) sortSelect.value = "default";

    // Clear search in URL without reload
    window.history.replaceState({}, document.title, window.location.pathname);

    this.syncSidebarUI();
    this.renderCatalog();
    Main.showToast("All filters reset.", "info");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("shop-products-grid")) {
    Shop.init();
  }
});
