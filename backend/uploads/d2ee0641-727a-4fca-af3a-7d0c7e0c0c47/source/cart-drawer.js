function waitForElement(selector, timeout = 3000) {
  return new Promise((resolve) => {
    const interval = 50;
    const maxAttempts = timeout / interval;
    let attempts = 0;

    const check = () => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);

      attempts++;
      if (attempts * interval >= timeout) return resolve(null);
      setTimeout(check, interval);
    };

    check();
  });
}

class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener(
      "keyup",
      (evt) => evt.code === "Escape" && this.close(),
    );
    this.querySelector("#CartDrawer-Overlay").addEventListener(
      "click",
      this.close.bind(this),
    );
    this.setHeaderCartIconAccessibility();
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector("#cart-icon-bubble");
    cartLink.setAttribute("role", "button");
    cartLink.setAttribute("aria-haspopup", "dialog");
    cartLink.addEventListener("click", (event) => {
      event.preventDefault();
      this.open(cartLink);
    });
    cartLink.addEventListener("keydown", (event) => {
      if (event.code.toUpperCase() === "SPACE") {
        event.preventDefault();
        this.open(cartLink);
      }
    });
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute("role"))
      this.setSummaryAccessibility(cartDrawerNote);

    setTimeout(() => {
      this.classList.add("animate", "active");

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "cart_drawer_opened",
        event_category: "Cart",
        event_label: "Cart Drawer Opened",
        timestamp: new Date().toISOString()
      });
      const variantInputs = document.querySelectorAll(
        '.cart-upsell input[type="radio"]',
      );
      const priceContainer = document.querySelector(".related_price span");
      const upgradeButton = document.querySelector(
        ".aloe_leaf_btn.upsell-atc-button",
      );
      const hiddenInput = document.querySelector(
        '.cart_relaterd_form input[name="id"]',
      );
      const targetOptions = document
        .querySelector(".cart-item .product-option dd")
        ?.innerText.trim()
        .toLowerCase();

      if (!targetOptions) return;

      variantInputs.forEach((input) => {
        const inputOptions = input
          .getAttribute("data-variant-options")
          ?.trim()
          .toLowerCase();

        if (inputOptions === targetOptions) {
          input.checked = true;

          const selectedPrice = input.getAttribute("data-variant-price");
          const selectedVariantId = input.getAttribute("data-variant-id");

          if (priceContainer && selectedPrice) {
            priceContainer.innerHTML = `${selectedPrice}`;
          }

          if (upgradeButton && selectedVariantId) {
            upgradeButton.setAttribute("data-id", selectedVariantId);
          }

          if (hiddenInput && selectedVariantId) {
            hiddenInput.value = selectedVariantId;
          }
        }

        input.addEventListener("change", function (e) {
          variantInputs.forEach((radio) => (radio.checked = false));
          e.target.checked = true;

          const selectedPrice = e.target.getAttribute("data-variant-price");
          const selectedVariantId = e.target.getAttribute("data-variant-id");

          if (priceContainer && selectedPrice) {
            priceContainer.innerHTML = `${selectedPrice}`;
          }

          if (upgradeButton && selectedVariantId) {
            upgradeButton.setAttribute("data-id", selectedVariantId);
          }

          if (hiddenInput && selectedVariantId) {
            hiddenInput.value = selectedVariantId;
          }
        });
      });
    });

    this.addEventListener(
      "transitionend",
      () => {
        const containerToTrapFocusOn = this.classList.contains("is-empty")
          ? this.querySelector(".drawer__inner-empty")
          : document.getElementById("CartDrawer");
        const focusElement =
          this.querySelector(".drawer__inner") ||
          this.querySelector(".drawer__close");
        trapFocus(containerToTrapFocusOn, focusElement);
      },
      { once: true },
    );

    document.body.classList.add("overflow-hidden");

    const variants = document.querySelectorAll(
      ".cart_related_iner_main variant-selects input",
    );
    const btn = document.querySelector(
      ".cart_related_iner_main .qty_related_btn",
    );
    if (variants?.length) {
      variants.forEach((variant) => {
        variant.addEventListener("change", (e) => {
          variants.forEach((v) => v.removeAttribute("checked"));
          e.target.setAttribute("checked", true);
          const price = e.target.getAttribute("data-variant-price");
          const compareAtPrice = e.target.getAttribute(
            "data-variant-compare-price",
          );
          const variantId = e.target.getAttribute("data-variant-id");

          if (btn && variantId) {
            const input = btn.querySelector("input[name='id']");
            if (input) input.value = variantId;
          }

          const priceWrapper = document.querySelector(
            ".cart_related_iner_main .related_price span",
          );
          const compareElement = priceWrapper?.querySelector("s");

          if (priceWrapper) priceWrapper.firstChild.textContent = price;
          if (compareElement) compareElement.textContent = compareAtPrice;
        });
      });
    }
  }

  close() {
    this.classList.remove("active");
    removeTrapFocus(this.activeElement);
    document.body.classList.remove("overflow-hidden");
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute("role", "button");
    cartDrawerNote.setAttribute("aria-expanded", "false");

    if (cartDrawerNote.nextElementSibling.getAttribute("id")) {
      cartDrawerNote.setAttribute(
        "aria-controls",
        cartDrawerNote.nextElementSibling.id,
      );
    }

    cartDrawerNote.addEventListener("click", (event) => {
      event.currentTarget.setAttribute(
        "aria-expanded",
        !event.currentTarget.closest("details").hasAttribute("open"),
      );
    });

    cartDrawerNote.parentElement.addEventListener("keyup", onKeyUpEscape);
  }

  renderContents(parsedState) {
    this.querySelector(".drawer__inner").classList.contains("is-empty") &&
      this.querySelector(".drawer__inner").classList.remove("is-empty");

    this.productId = parsedState.id;

    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);
      sectionElement.innerHTML = this.getSectionInnerHTML(
        parsedState.sections[section.id],
        section.selector,
      );
    });

    setTimeout(() => {
      this.querySelector("#CartDrawer-Overlay").addEventListener(
        "click",
        this.close.bind(this),
      );
      this.open();

      // ✅ Reinitialize Swiper after drawer content update
      this.initUpsellSwiper();

      // ✅ Wait for upsell element inside the cart drawer
      waitForElement("#CartDrawer .cart-upsell").then((el) => {
        if (el && typeof reinitializeAllUpsellSwatches === "function") {
          reinitializeAllUpsellSwatches();
        }
      });
    });
  }

  initUpsellSwiper() {
    const swiperContainer = document.querySelector(".upsell-swiper");
    if (!swiperContainer) return;

    // Optional: if Swiper instance already exists, destroy it first
    if (this.upsellSwiper && this.upsellSwiper.destroy) {
      this.upsellSwiper.destroy(true, true);
    }

    this.upsellSwiper = new Swiper(".upsell-swiper", {
      draggable: true,
      loop: true,
      pagination: {
        el: ".swiper-pagination.upsell_pagination",
        clickable: true,
      },
    });
  }

  getSectionInnerHTML(html, selector = ".shopify-section") {
    return new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: "cart-drawer",
        selector: "#CartDrawer",
      },
      {
        id: "cart-icon-bubble",
      },
    ];
  }

  getSectionDOM(html, selector = ".shopify-section") {
    return new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define("cart-drawer", CartDrawer);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: "CartDrawer",
        section: "cart-drawer",
        selector: ".drawer__inner",
      },
      {
        id: "cart-icon-bubble",
        section: "cart-icon-bubble",
        selector: ".shopify-section",
      },
    ];
  }
}

customElements.define("cart-drawer-items", CartDrawerItems);
