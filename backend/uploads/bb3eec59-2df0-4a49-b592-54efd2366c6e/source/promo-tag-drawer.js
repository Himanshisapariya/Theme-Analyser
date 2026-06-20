// Rebuy Promo Drawer (Cart Only)
(function () {
  // Complete mapping for all promo types
  const promoToCollection = {
    '2+ for 50% off': 'honest-tees',
    '2+ for 25% off': 'fearless-fleece',
    'Buy 2, Get 1 Free': 'all-socks',
    '3+ for 20% off': 'mix-match-for-20-off',
    '2+ Truth Fits For 50% off': 'truth-fits-tank'
  };

  // Full messages for promo drawer headings
  const promoTitles = {
    '2+ for 50% off'           : 'Honest Tees BOGO 50% Off',
    '2+ for 25% off'           : 'Buy 2 Fleece, Get 25% Off',
    'Buy 2, Get 1 Free'        : 'Buy 2 Socks, Get 1 Free',
    '3+ for 20% off'           : 'Buy 3, Get 20% Off',
    '2+ Truth Fits For 50% off': 'Truth Fits Tank BOGO 50% Off'
  };

  function closePromoDrawer() {
    const drawer = document.getElementById('promo-drawer');
    if (drawer) {
      drawer.classList.remove('promo-drawer--open');
    }
  }

  // Function to fetch products from a collection
  async function fetchCollectionProducts(collectionHandle) {
    try {
      const response = await fetch(`/collections/${collectionHandle}/products.json`);
      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error('Error fetching collection products:', error);
      return [];
    }
  }

  // Initialize Swiper for color swatch carousels inside the promo drawer
function initPromoDrawerSwatches() {
  if (typeof Swiper === 'undefined') return;

  const promoDrawer = document.getElementById('promo-drawer');
  if (!promoDrawer) return;

  const swatchWraps = promoDrawer.querySelectorAll('.swatch-swiper.js-color-swatches.swiper');
  if (!swatchWraps.length) return;

  swatchWraps.forEach(function (container) {
    if (container.swiper) {
      container.swiper.destroy(true, true);
    }

    new Swiper(container, {
      slidesPerView: 'auto',
      spaceBetween: 4,
      freeMode: true,
      grabCursor: true,
      simulateTouch: true,
      allowTouchMove: true,
      touchEventsTarget: 'container',
      threshold: 3,
      resistance: true,
      resistanceRatio: 0.85,
      passiveListeners: false,
      nested: false,
      observer: false,
      observeParents: false,
      a11y: false,
    });
  });
}

  async function createPromoDrawer(promoTag, collectionHandle) {
    // Remove existing drawer if it exists
    const existingDrawer = document.getElementById('promo-drawer');
    if (existingDrawer) {
      existingDrawer.remove();
    }

    const drawer = document.createElement('div');
    drawer.id = 'promo-drawer';
    drawer.className = 'promo-drawer';
    drawer.innerHTML = `
      <div class="promo-drawer__overlay"></div>
      <div class="promo-drawer__content gts">
        <div class="promo-drawer__header">
          <h6>${promoTitles[promoTag] || promoTag || 'Promo Details'}</h6>
          <button class="promo-drawer__close" aria-label="Close drawer">
            ×
          </button>
        </div>
        <div class="promo-drawer__gender-filter">
          <div class="ctm-gender-filter-buttons tabbing-content">
            <ul class="tabbing-list-group">
              <li class="item-tabbing active-tab">
                <a class="ctm-gender-filter-btn" data-gender="Women">WOMEN'S</a>
              </li>
              <li class="item-tabbing">
                <a class="ctm-gender-filter-btn" data-gender="Men">MEN'S</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="promo-drawer__body">
          <div class="promo-drawer__products">
            <div class="loading-spinner">Loading products...</div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);

    // Fetch and render products
    if (collectionHandle) {
      try {
        const products = await fetchCollectionProducts(collectionHandle);
        const productsContainer = drawer.querySelector('.promo-drawer__products');

        if (products && products.length > 0) {
          productsContainer.className = 'promo-drawer__products-grid';

          const productPromises = products.map(async (product) => {
            try {
              const response = await fetch(`/products/${product.handle}?section_id=product-card-ajax`);
              return response.ok ? await response.text() : '';
            } catch (error) {
              console.error('Error fetching product card:', error);
              return '';
            }
          });

          const productCards = await Promise.all(productPromises);
          productsContainer.innerHTML = productCards.join('');

          // Initialize gender filter functionality
          initializeGenderFilter();

          // Initialize product card functionality
          setTimeout(() => {
            initializeSwatchesForPromoDrawer();
            
            if (typeof initQuickView === 'function') {
              initQuickView();
            }

            setTimeout(() => {
              initPromoDrawerSwatches();
            }, 300);

          }, 100);

        } else {
          productsContainer.innerHTML = '<p>No products found.</p>';
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        drawer.querySelector('.promo-drawer__products').innerHTML = '<p>Error loading products.</p>';
      }
    } else {
      drawer.querySelector('.promo-drawer__products').innerHTML = '<p>No collection mapping found for this promotion.</p>';
    }

    // Add close functionality
    drawer.querySelector('.promo-drawer__overlay').addEventListener('click', (e) => {
      if (e.target === drawer.querySelector('.promo-drawer__overlay')) {
        e.stopPropagation();
        closePromoDrawer();
      }
    });

    drawer.querySelector('.promo-drawer__content').addEventListener('click', (e) => {
      e.stopPropagation();
    });

    drawer.querySelector('.promo-drawer__close').addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      closePromoDrawer();
    });
  }

  function openPromoDrawer(promoTag, collectionHandle) {
    createPromoDrawer(promoTag, collectionHandle);
    const drawer = document.getElementById('promo-drawer');
    if (drawer) {
      drawer.classList.add('promo-drawer--open');
    }
  }

  // Function to initialize gender filter functionality
  function initializeGenderFilter() {
    const promoDrawer = document.getElementById('promo-drawer');
    if (!promoDrawer) return;

    const filterButtons = promoDrawer.querySelectorAll('.ctm-gender-filter-btn');
    if (!filterButtons.length) return;

    let currentFilter = 'Women';

    function applyFilter(selectedGender) {
      let productsContainer = promoDrawer.querySelector('.promo-drawer__products');
      if (!productsContainer) productsContainer = promoDrawer.querySelector('.promo-drawer__products-grid');
      if (!productsContainer) return;

      if (!productsContainer) {
        setTimeout(() => applyFilter(selectedGender), 500);
        return;
      }

      let productCards = promoDrawer.querySelectorAll('.collection-product-card');
      if (productCards.length === 0) productCards = promoDrawer.querySelectorAll('.promo-drawer-product-card');
      if (productCards.length === 0) productCards = promoDrawer.querySelectorAll('.card-wrapper');
      if (productCards.length === 0) productCards = promoDrawer.querySelectorAll('.card');

      if (productCards.length === 0) {
        if (productsContainer.innerHTML.includes('Loading products')) {
          setTimeout(() => applyFilter(selectedGender), 1000);
          return;
        }
      }

      let visibleProductsCount = 0;

      productCards.forEach(card => {
        const productTags = card.getAttribute('data-product-tags') || '';
        const tagsArray = productTags.split(',').map(tag => tag.trim().toLowerCase());

        const hasGenderTag = tagsArray.includes(selectedGender.toLowerCase()) ||
                             tagsArray.includes(selectedGender.toLowerCase() + 's');

        card.classList.toggle('hidden', !hasGenderTag);
        if (hasGenderTag) visibleProductsCount++;
      });

      let noProductsMsg = promoDrawer.querySelector('.promo-drawer__no-products');
      if (!noProductsMsg) {
        noProductsMsg = document.createElement('div');
        noProductsMsg.className = 'promo-drawer__no-products';
        productsContainer.appendChild(noProductsMsg);
      }

      if (visibleProductsCount === 0) {
        noProductsMsg.textContent = `No ${selectedGender} products available`;
        noProductsMsg.classList.add('visible');
      } else {
        noProductsMsg.classList.remove('visible');
      }
    }

    filterButtons.forEach(button => {
      button.addEventListener('click', function () {
        currentFilter = this.getAttribute('data-gender');

        promoDrawer
          .querySelectorAll('.ctm-gender-filter-buttons .item-tabbing')
          .forEach(tab => tab.classList.remove('active-tab'));

        this.closest('.item-tabbing').classList.add('active-tab');
        applyFilter(currentFilter);
      });
    });

  applyFilter(currentFilter);
  }

  // Delegated click handler — set up once, works for any .promo-tag-container
  // Rebuy renders at any time, no re-init needed.
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 1024) return;

    // Promo tag click → open drawer
    const container = e.target.closest('.rebuy-cart .promo-tag-container');
    if (container && (e.target.closest('.promo-text') || e.target.closest('.promo-info-icon'))) {
      e.preventDefault();
      e.stopPropagation();
      const promoTag = container.getAttribute('data-promo-type');
      openPromoDrawer(promoTag, promoToCollection[promoTag]);
      return;
    }

    // Rebuy close / continue-shopping → close promo drawer
    if (e.target.closest('#rebuy-cart-close') || e.target.closest('.rebuy-cart__continue-shopping-button')) {
      setTimeout(() => closePromoDrawer(), 100);
    }
  });

  function initRebuyPromo() {
    // kept for cursor styling only — click handling is delegated above
    if (window.innerWidth <= 1024) return;
    document.querySelectorAll('.rebuy-cart .promo-tag-container:not([data-cursor-set])').forEach(container => {
      const promoText = container.querySelector('.promo-text');
      const promoIcon = container.querySelector('.promo-info-icon');
      if (promoText) promoText.style.cursor = 'pointer';
      if (promoIcon) promoIcon.style.cursor = 'pointer';
      container.setAttribute('data-cursor-set', 'true');
    });
  }

  // Debounced wrapper — collapses burst of events into one /cart.js call
  let _hidePromoTimer = null;
  function scheduleHideActivatedPromoTags(cartData) {
    clearTimeout(_hidePromoTimer);
    _hidePromoTimer = setTimeout(() => hideActivatedPromoTags(cartData), 300);
  }

  document.addEventListener('rebuy:cart.updated',   (e) => { initRebuyPromo(); scheduleHideActivatedPromoTags(e.detail?.cart); });
  document.addEventListener('rebuy:smartcart.ready',() => { initRebuyPromo(); scheduleHideActivatedPromoTags(); });
  document.addEventListener('rebuy:products.loaded', () => { initRebuyPromo(); });
  document.addEventListener('cart:refresh',          () => { scheduleHideActivatedPromoTags(); });
  // gwp:cart-updated carries the full cart object — pass it in to skip the extra fetch
  document.addEventListener('gwp:cart-updated',     (e) => { scheduleHideActivatedPromoTags(e.detail?.cart); });

  // initial run
  initRebuyPromo();
  hideActivatedPromoTags();

  // Close promo drawer when resizing to mobile
  let _promoResizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(_promoResizeTimer);
    _promoResizeTimer = setTimeout(function () {
      if (window.innerWidth <= 1024) closePromoDrawer();
    }, 150);
  });

function updateProductCardImage(selectedSwatch) {
  const productCard = selectedSwatch.closest('.card-wrapper');
  if (!productCard) return;

  // --- Image update (no opacity fade — causes flicker) ---
  const variantImage = selectedSwatch.getAttribute('data-variant-image');
  const productImage = productCard.querySelector('.card__inner img, .product-card__image img');

  if (variantImage && productImage) {
    productImage.src = variantImage;
    productImage.srcset = '';
  }

  // --- Price update ---
  const swatchLabel =
    productCard.querySelector(`label[for="${selectedSwatch.id}"]`) ||
    selectedSwatch.nextElementSibling;

  if (!swatchLabel) return;

  const newPrice        = swatchLabel.getAttribute('data-price');
  const newComparePrice = swatchLabel.getAttribute('data-compare-price');

  if (!newPrice) return;

  const priceWrapper =
    productCard.querySelector('.price__container') ||
    productCard.querySelector('.price') ||
    productCard.querySelector('.card-title_info');

  if (!priceWrapper) return;

  const regularPriceEl =
    priceWrapper.querySelector('.price-item--regular') ||
    priceWrapper.querySelector('.mini-price .price-item--regular') ||
    priceWrapper.querySelector('.price__regular .price-item');

  const salePriceEl =
    priceWrapper.querySelector('.price-item--sale') ||
    priceWrapper.querySelector('.mini-price .price-item--sale') ||
    priceWrapper.querySelector('.price__sale .price-item--sale');

  const comparePriceEl =
    priceWrapper.querySelector('.price-item--compare') ||
    priceWrapper.querySelector('.mini-price .price-item--compare') ||
    priceWrapper.querySelector('.price__sale .price-item--compare');

  const hasSale =
    newComparePrice &&
    newComparePrice !== newPrice &&
    newComparePrice !== '$0.00';

  if (hasSale) {
    if (comparePriceEl) comparePriceEl.textContent = newComparePrice;
    if (salePriceEl)    salePriceEl.textContent    = newPrice;
    if (regularPriceEl) regularPriceEl.textContent = newPrice;
    priceWrapper.classList.add('price--on-sale');
  } else {
    if (regularPriceEl) regularPriceEl.textContent = newPrice;
    if (salePriceEl)    salePriceEl.textContent    = newPrice;
    if (comparePriceEl) comparePriceEl.textContent = '';
    priceWrapper.classList.remove('price--on-sale');
  }
}

  // Initialize swatch image-swap + price-update listeners for promo drawer
function initializeSwatchesForPromoDrawer() {
  const promoDrawer = document.getElementById('promo-drawer');
  if (!promoDrawer) return;

  const colorSwatches = promoDrawer.querySelectorAll('.color-swatch-input');
  if (!colorSwatches.length) return;

  colorSwatches.forEach((swatch) => {
    const newSwatch = swatch.cloneNode(true);
    swatch.parentNode.replaceChild(newSwatch, swatch);

    // Update on radio change (click)
    newSwatch.addEventListener('change', (e) => {
      updateProductCardImage(e.target);
    });

    // Get the label (visually the swatch circle) — pointer-events: none is on it via CSS
    // so we use JS to attach the listener instead
    const label = newSwatch.nextElementSibling;
    if (!label || !label.classList.contains('color-swatch')) return;

    label.addEventListener('mouseenter', function () {
      const input = label.previousElementSibling;
      if (input) updateProductCardImage(input);
    });

    label.addEventListener('mouseleave', function () {
      const productCard = label.closest('.card-wrapper');
      if (!productCard) return;
      const checkedSwatch = productCard.querySelector('.color-swatch-input:checked');
      if (checkedSwatch) updateProductCardImage(checkedSwatch);
    });

    // Prevent label from blocking Swiper drag
    label.addEventListener('mousedown', function (e) {
      e.preventDefault();
    });
  });
}

  // ─── Discount → promo-tag mapping ───────────────────────────────────────
  const discountToPromoTag = {
    'honest tees bogo 50%'       : '2+ for 50% off',
    'buy 2 fleece get 25% off'   : '2+ for 25% off',
    'buy 2 socks get 3rd free'   : 'Buy 2, Get 1 Free',
    '3 hats or tees for 20% off' : '3+ for 20% off',
    'truth fits bogo 50% off'    : '2+ Truth Fits For 50% off'
  };

  async function hideActivatedPromoTags(cartData) {
    try {
      const cart = cartData || await fetch('/cart.js').then(r => r.json());

      const activeDiscounts = new Set();

      if (cart.cart_level_discount_applications) {
        cart.cart_level_discount_applications.forEach(d => {
          activeDiscounts.add(d.title.toLowerCase().trim());
        });
      }

      if (cart.items) {
        cart.items.forEach(item => {
          if (item.discounts) {
            item.discounts.forEach(d => {
              activeDiscounts.add(d.title.toLowerCase().trim());
            });
          }
          if (item.line_level_discount_applications) {
            item.line_level_discount_applications.forEach(d => {
              activeDiscounts.add(d.title.toLowerCase().trim());
            });
          }
        });
      }

      const promoTagsToHide = new Set();
      activeDiscounts.forEach(discountTitle => {
        if (discountToPromoTag[discountTitle]) {
          promoTagsToHide.add(discountToPromoTag[discountTitle]);
          return;
        }
        Object.entries(discountToPromoTag).forEach(([key, promoTag]) => {
          if (discountTitle.includes(key) || key.includes(discountTitle)) {
            promoTagsToHide.add(promoTag);
          }
        });
      });

      document.querySelectorAll('.rebuy-cart .promo-tag-container').forEach(container => {
        const promoType = container.getAttribute('data-promo-type');
        if (promoTagsToHide.has(promoType)) {
          container.style.display = 'none';
          container.setAttribute('data-discount-active', 'true');
        } else {
          if (container.getAttribute('data-discount-active') === 'true') {
            container.style.display = '';
            container.removeAttribute('data-discount-active');
          }
        }
      });

    } catch (error) {
      console.error('Error checking active discounts:', error);
    }
  }

})();