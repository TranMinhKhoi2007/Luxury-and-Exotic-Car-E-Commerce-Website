/**
 * APEX MOTORS - Image Loader & Placeholder System
 * 
 * Complies strictly with the Image Placeholder Policy:
 * 1. Zero external hotlinks or downloaded/generated fake images.
 * 2. Displays a sophisticated, responsive dark luxury placeholder with filename,
 *    dimensions, and description.
 * 3. Proactively tests if a local image file exists at the specified relative path.
 * 4. Automatically displays the real image once placed into the images/ directory,
 *    gracefully falling back to the placeholder if the file is absent.
 */

const ImageLoader = {
  /**
   * Extract filename from relative path
   * @param {string} path 
   * @returns {string}
   */
  getFilename(path) {
    if (!path) return "unspecified-image.jpg";
    const parts = path.split("/");
    return parts[parts.length - 1];
  },

  /**
   * Generate an image slot HTML string
   * @param {Object} config
   * @returns {string} HTML string
   */
  createImageSlot(config) {
    const src = config.src || "";
    const alt = config.alt || "Apex Motors Supercar";
    const description = config.description || "High-Resolution Vehicle Asset";
    const dimensions = config.dimensions || "1200x800";
    const aspectRatio = config.aspectRatio || "16/10";
    const className = config.className || "";
    const icon = config.icon || "fa-regular fa-image";
    const filename = this.getFilename(src);

    return `
      <div 
        class="image-slot ${className}" 
        data-image="${src}" 
        data-filename="${filename}"
        data-dimensions="${dimensions}"
        data-desc="${description}"
        style="aspect-ratio: ${aspectRatio};"
        role="img"
        aria-label="${alt}"
      >
        <img 
          src="${src}" 
          alt="${alt}" 
          class="slot-real-image" 
          loading="eager"
          onload="ImageLoader.onImageLoad(this)" 
          onerror="ImageLoader.onImageError(this)"
        />
        <div class="image-placeholder">
          <div class="placeholder-inner">
            <span class="placeholder-icon">
              <i class="${icon}"></i>
            </span>
            <span class="placeholder-filename">${filename}</span>
            <span class="placeholder-meta">
              <span class="placeholder-size">${dimensions}</span>
              <span class="placeholder-dot">&bull;</span>
              <span class="placeholder-desc">${description}</span>
            </span>
          </div>
        </div>
      </div>
    `.trim();
  },

  /**
   * Called when image successfully loads from disk
   * @param {HTMLImageElement} img 
   */
  onImageLoad(img) {
    if (!img) return;
    const slot = img.closest(".image-slot");
    if (slot) {
      slot.classList.add("has-real-image");
      slot.classList.remove("is-placeholder");
      const ph = slot.querySelector(".image-placeholder");
      if (ph) ph.style.display = "none";
      img.style.opacity = "1";
      img.style.display = "block";
      img.style.zIndex = "2";
    }
  },

  /**
   * Called when image fails to load (file not found on disk)
   * @param {HTMLImageElement} img 
   */
  onImageError(img) {
    if (!img) return;
    const slot = img.closest(".image-slot");

    // Try alternate extension if not already tried (e.g. .png <-> .jpg <-> .webp)
    if (!img.getAttribute("data-tried-alt")) {
      img.setAttribute("data-tried-alt", "true");
      const currentSrc = img.src;
      let altSrc = null;
      if (currentSrc.endsWith(".png")) {
        altSrc = currentSrc.replace(/\.png$/, ".jpg");
      } else if (currentSrc.endsWith(".jpg")) {
        altSrc = currentSrc.replace(/\.jpg$/, ".png");
      } else if (currentSrc.endsWith(".jpeg")) {
        altSrc = currentSrc.replace(/\.jpeg$/, ".png");
      }

      if (altSrc) {
        img.src = altSrc;
        return;
      }
    }

    if (slot) {
      slot.classList.add("is-placeholder");
      slot.classList.remove("has-real-image");
      const ph = slot.querySelector(".image-placeholder");
      if (ph) ph.style.display = "flex";
    }
    // Safely hide/remove img to prevent broken icon
    try {
      img.remove();
    } catch (e) {
      img.style.display = "none";
    }
  },

  /**
   * Scan and evaluate all image slots on the page
   */
  init() {
    const slots = document.querySelectorAll(".image-slot");
    slots.forEach(slot => {
      slot.setAttribute("data-initialized", "true");
      const src = slot.getAttribute("data-image");
      let img = slot.querySelector("img.slot-real-image");

      if (!img && src) {
        img = document.createElement("img");
        img.className = "slot-real-image";
        img.alt = slot.getAttribute("aria-label") || "Showroom Asset";
        img.loading = "eager";
        img.src = src;
        slot.prepend(img);
      }

      if (img) {
        if (img.complete) {
          if (img.naturalWidth > 0) {
            ImageLoader.onImageLoad(img);
          } else {
            ImageLoader.onImageError(img);
          }
        } else {
          img.addEventListener("load", () => ImageLoader.onImageLoad(img), { once: true });
          img.addEventListener("error", () => ImageLoader.onImageError(img), { once: true });
        }
      }
    });
  }
};

// Immediate early hook so inline onload/onerror handlers never fail
window.ImageLoader = ImageLoader;

// Run on DOM ready and also window load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => ImageLoader.init());
} else {
  ImageLoader.init();
}

window.addEventListener("load", () => {
  ImageLoader.init();
});
