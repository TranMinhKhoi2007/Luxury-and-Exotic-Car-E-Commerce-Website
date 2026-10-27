/**
 * APEX MOTORS - Blog & Editorial System Controller
 * Handles Blog Listing, Filtering, Search, Article View, Social Sharing & Interactive Comments
 */

const Blog = {
  state: {
    search: "",
    category: "all",
    tag: "all",
    currentPage: 1,
    postsPerPage: 4
  },

  init() {
    if (document.getElementById("blog-posts-grid")) {
      this.initListing();
    } else if (document.getElementById("blog-details-article")) {
      this.initDetails();
    }
  },

  /**
   * --- BLOG LISTING (blog.html) ---
   */
  initListing() {
    this.parseUrlParams();
    this.setupSidebar();
    this.renderPosts();
  },

  parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("search")) this.state.search = params.get("search").trim();
    if (params.has("category")) this.state.category = params.get("category").trim();
    if (params.has("tag")) this.state.tag = params.get("tag").trim();
    if (params.has("page")) this.state.currentPage = parseInt(params.get("page"), 10) || 1;
  },

  getFilteredPosts() {
    return APEX_DATA.blogPosts.filter(post => {
      if (this.state.search) {
        const q = this.state.search.toLowerCase();
        const matches = 
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.content.some(p => p.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (this.state.category && this.state.category.toLowerCase() !== "all") {
        if (post.category.toLowerCase() !== this.state.category.toLowerCase()) return false;
      }

      if (this.state.tag && this.state.tag.toLowerCase() !== "all") {
        if (!post.tags.map(t => t.toLowerCase()).includes(this.state.tag.toLowerCase())) return false;
      }

      return true;
    });
  },

  renderPosts() {
    const grid = document.getElementById("blog-posts-grid");
    const paginationEl = document.getElementById("blog-pagination");
    if (!grid) return;

    const filtered = this.getFilteredPosts();
    const totalPages = Math.ceil(filtered.length / this.state.postsPerPage) || 1;

    if (this.state.currentPage > totalPages) this.state.currentPage = totalPages;
    if (this.state.currentPage < 1) this.state.currentPage = 1;

    const start = (this.state.currentPage - 1) * this.state.postsPerPage;
    const pagePosts = filtered.slice(start, start + this.state.postsPerPage);

    if (pagePosts.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <i class="fa-regular fa-newspaper empty-state-icon"></i>
          <h4>No Editorial Articles Found</h4>
          <p>No articles match your search criteria. Try a different topic or reset your filters.</p>
          <button type="button" class="btn btn-gold" id="blog-reset-btn">View All Dispatches</button>
        </div>
      `;
      const btn = grid.querySelector("#blog-reset-btn");
      if (btn) {
        btn.addEventListener("click", () => {
          this.state.search = "";
          this.state.category = "all";
          this.state.tag = "all";
          this.renderPosts();
        });
      }
    } else {
      grid.innerHTML = pagePosts.map(post => {
        const imgSlot = ImageLoader.createImageSlot({
          src: post.image,
          alt: post.title,
          description: "Editorial Cover",
          dimensions: "1000x650",
          aspectRatio: "16/10",
          className: "blog-card-image"
        });

        return `
          <article class="blog-card">
            <a href="blog-details.html?id=${post.id}" class="blog-card-img-link">
              ${imgSlot}
            </a>
            <div class="blog-card-content">
              <div class="blog-card-meta">
                <span class="blog-cat-pill">${post.category}</span>
                <span class="blog-date"><i class="fa-regular fa-calendar"></i> ${post.date}</span>
                <span class="blog-read-time"><i class="fa-regular fa-clock"></i> ${post.readTime}</span>
              </div>
              <h3 class="blog-card-title">
                <a href="blog-details.html?id=${post.id}">${post.title}</a>
              </h3>
              <p class="blog-card-excerpt">${post.excerpt}</p>
              <div class="blog-card-footer">
                <a href="blog-details.html?id=${post.id}" class="blog-read-more-link">
                  <span>Read Full Article</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </article>
        `;
      }).join("");
    }

    // Pagination
    if (paginationEl) {
      if (totalPages <= 1) {
        paginationEl.innerHTML = "";
      } else {
        let pagHtml = "";
        for (let i = 1; i <= totalPages; i++) {
          pagHtml += `
            <button 
              type="button" 
              class="page-link ${i === this.state.currentPage ? 'is-active' : ''}" 
              data-page="${i}"
            >${i}</button>
          `;
        }
        paginationEl.innerHTML = pagHtml;

        paginationEl.querySelectorAll(".page-link").forEach(btn => {
          btn.addEventListener("click", () => {
            this.state.currentPage = parseInt(btn.getAttribute("data-page"), 10);
            this.renderPosts();
            window.scrollTo({ top: grid.offsetTop - 120, behavior: "smooth" });
          });
        });
      }
    }
  },

  setupSidebar() {
    // Search form
    const searchForm = document.getElementById("blog-sidebar-search");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = searchForm.querySelector("input");
        this.state.search = input ? input.value.trim() : "";
        this.state.currentPage = 1;
        this.renderPosts();
      });
    }

    // Category widgets
    const catContainer = document.getElementById("blog-sidebar-categories");
    if (catContainer) {
      const categories = ["All", "Engineering", "Supercars", "Aerodynamics", "Hypercars", "Motorsport", "Showroom"];
      catContainer.innerHTML = categories.map(cat => {
        const count = cat === "All"
          ? APEX_DATA.blogPosts.length
          : APEX_DATA.blogPosts.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length;
        const isSelected = this.state.category.toLowerCase() === cat.toLowerCase();
        return `
          <li>
            <button 
              type="button" 
              class="sidebar-cat-btn ${isSelected ? 'is-active' : ''}" 
              data-cat="${cat}"
            >
              <span>${cat}</span>
              <span class="cat-count">(${count})</span>
            </button>
          </li>
        `;
      }).join("");

      catContainer.querySelectorAll(".sidebar-cat-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          this.state.category = btn.getAttribute("data-cat");
          this.state.currentPage = 1;
          this.renderPosts();
          catContainer.querySelectorAll(".sidebar-cat-btn").forEach(b => b.classList.remove("is-active"));
          btn.classList.add("is-active");
        });
      });
    }

    // Recent Posts
    const recentContainer = document.getElementById("blog-sidebar-recent");
    if (recentContainer) {
      const recents = APEX_DATA.blogPosts.slice(0, 3);
      recentContainer.innerHTML = recents.map(post => `
        <div class="sidebar-recent-item">
          <a href="blog-details.html?id=${post.id}" class="recent-thumb">
            ${ImageLoader.createImageSlot({
              src: post.image,
              alt: post.title,
              description: "Mini Thumb",
              dimensions: "200x130",
              aspectRatio: "16/10",
              className: "recent-post-slot"
            })}
          </a>
          <div class="recent-text">
            <span class="recent-date">${post.date}</span>
            <h5 class="recent-title"><a href="blog-details.html?id=${post.id}">${post.title}</a></h5>
          </div>
        </div>
      `).join("");
    }

    // Tags
    const tagsContainer = document.getElementById("blog-sidebar-tags");
    if (tagsContainer) {
      const allTags = Array.from(new Set(APEX_DATA.blogPosts.flatMap(p => p.tags)));
      tagsContainer.innerHTML = allTags.map(tag => `
        <button type="button" class="tag-pill" data-tag="${tag}">${tag}</button>
      `).join("");

      tagsContainer.querySelectorAll(".tag-pill").forEach(btn => {
        btn.addEventListener("click", () => {
          this.state.tag = btn.getAttribute("data-tag");
          this.state.currentPage = 1;
          this.renderPosts();
        });
      });
    }
  },

  /**
   * --- BLOG DETAILS (blog-details.html) ---
   */
  initDetails() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");
    const post = APEX_DATA.blogPosts.find(p => p.id === postId) || APEX_DATA.blogPosts[0];

    document.title = `${post.title} | APEX MOTORS Editorial`;

    // Breadcrumbs
    const bcCurrent = document.getElementById("blog-breadcrumb-current");
    if (bcCurrent) bcCurrent.textContent = post.title;

    // Article Hero / Content
    const titleEl = document.getElementById("article-title");
    const dateEl = document.getElementById("article-date");
    const catEl = document.getElementById("article-category");
    const authorName = document.getElementById("article-author-name");
    const authorRole = document.getElementById("article-author-role");
    const readTimeEl = document.getElementById("article-read-time");
    const coverSlot = document.getElementById("article-cover-slot");
    const bodyContainer = document.getElementById("article-body");
    const tagsContainer = document.getElementById("article-tags");

    if (titleEl) titleEl.textContent = post.title;
    if (dateEl) dateEl.textContent = post.date;
    if (catEl) catEl.textContent = post.category;
    if (readTimeEl) readTimeEl.textContent = post.readTime;
    if (authorName) authorName.textContent = post.author.name;
    if (authorRole) authorRole.textContent = post.author.role;

    if (coverSlot) {
      coverSlot.innerHTML = ImageLoader.createImageSlot({
        src: post.image,
        alt: post.title,
        description: "Editorial Feature Article Banner",
        dimensions: "1200x650",
        aspectRatio: "16/9",
        className: "article-hero-slot",
        icon: "fa-regular fa-newspaper"
      });
    }

    if (bodyContainer) {
      bodyContainer.innerHTML = post.content.map(para => `<p>${para}</p>`).join("");
    }

    if (tagsContainer) {
      tagsContainer.innerHTML = post.tags.map(t => `<span class="tag-pill">${t}</span>`).join("");
    }

    // Social Sharing
    this.setupSocialSharing(post);

    // Related Posts
    this.setupRelatedPosts(post);

    // Interactive Comments
    this.setupComments(post.id);
  },

  setupSocialSharing(post) {
    const shareContainer = document.getElementById("article-share-buttons");
    if (!shareContainer) return;

    const currentUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);

    shareContainer.innerHTML = `
      <a href="https://www.facebook.com/sharer/sharer.php?u=${currentUrl}" target="_blank" rel="noopener noreferrer" class="share-btn share-fb" title="Share on Facebook">
        <i class="fa-brands fa-facebook-f"></i>
      </a>
      <a href="https://twitter.com/intent/tweet?url=${currentUrl}&text=${title}" target="_blank" rel="noopener noreferrer" class="share-btn share-x" title="Share on X">
        <i class="fa-brands fa-x-twitter"></i>
      </a>
      <button type="button" class="share-btn share-copy" id="share-copy-btn" title="Copy Link to Clipboard">
        <i class="fa-solid fa-link"></i>
      </button>
    `;

    const copyBtn = document.getElementById("share-copy-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href).then(() => {
            Main.showToast("Article link copied to clipboard.", "success");
          });
        } else {
          Main.showToast("Link: " + window.location.href, "info");
        }
      });
    }
  },

  setupRelatedPosts(currentPost) {
    const container = document.getElementById("article-related-posts");
    if (!container) return;

    const others = APEX_DATA.blogPosts.filter(p => p.id !== currentPost.id).slice(0, 2);
    container.innerHTML = others.map(post => `
      <article class="blog-card mini">
        <a href="blog-details.html?id=${post.id}" class="blog-card-img-link">
          ${ImageLoader.createImageSlot({
            src: post.image,
            alt: post.title,
            description: "Related Editorial",
            dimensions: "600x400",
            aspectRatio: "16/10",
            className: "related-post-slot"
          })}
        </a>
        <div class="blog-card-content">
          <span class="blog-cat-pill">${post.category}</span>
          <h4 class="blog-card-title"><a href="blog-details.html?id=${post.id}">${post.title}</a></h4>
          <span class="blog-date"><i class="fa-regular fa-calendar"></i> ${post.date}</span>
        </div>
      </article>
    `).join("");
  },

  setupComments(postId) {
    const commentsList = document.getElementById("article-comments-list");
    const commentCount = document.getElementById("article-comments-count");
    const commentForm = document.getElementById("article-comment-form");

    const storageKey = `apex_comments_${postId}`;

    const getComments = () => {
      try {
        const stored = localStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : [
          {
            name: "Julian Moreau",
            date: "October 19, 2026",
            text: "Exceptional analysis. The engineering precision required to extract 1,000 HP while maintaining naturally aspirated acoustics is nothing short of automotive sorcery."
          }
        ];
      } catch (e) {
        return [];
      }
    };

    const renderComments = () => {
      if (!commentsList) return;
      const comments = getComments();
      if (commentCount) commentCount.textContent = `(${comments.length})`;

      commentsList.innerHTML = comments.map(c => `
        <div class="comment-item">
          <div class="comment-avatar">
            <i class="fa-solid fa-user-secret"></i>
          </div>
          <div class="comment-body">
            <div class="comment-meta">
              <span class="comment-author">${c.name}</span>
              <span class="comment-date">${c.date}</span>
            </div>
            <p class="comment-text">${c.text}</p>
          </div>
        </div>
      `).join("");
    };

    renderComments();

    if (commentForm) {
      commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameInput = commentForm.querySelector("#comment-name");
        const emailInput = commentForm.querySelector("#comment-email");
        const textInput = commentForm.querySelector("#comment-text");

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const text = textInput.value.trim();

        if (!Validator.isNotEmpty(name)) {
          Validator.showError(nameInput, "Please enter your name.");
          return;
        }
        if (!Validator.isValidEmail(email)) {
          Validator.showError(emailInput, "Please enter a valid email address.");
          return;
        }
        if (!Validator.isNotEmpty(text, 3)) {
          Validator.showError(textInput, "Comment must be at least 3 characters.");
          return;
        }

        const newComment = {
          name,
          date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
          text
        };

        const existing = getComments();
        existing.push(newComment);
        localStorage.setItem(storageKey, JSON.stringify(existing));

        renderComments();
        commentForm.reset();
        Main.showToast("Your comment has been published to this dispatch.", "success");
      });
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  Blog.init();
});
