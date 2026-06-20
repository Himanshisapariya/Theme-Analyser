function handleProductImages(isQuickView) {
  const prodPageSwiper = new Swiper('.product__media-list.swiper', {
    loop: false,
    slidesPerView: 1,
    autoHeight: false,
    navigation: {
      nextEl: '.swiper-btn--next',
      prevEl: '.swiper-btn--prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      hide: true,
    },
  });

  const colorSwatches = document.querySelectorAll('.color-swatch-input:not([id*="product-recommendations"])');

  const mediaItems = document.querySelectorAll('.product__media-item, .product__media-subitem');
  const modelSizeTextEl = document.querySelectorAll('.size_model-main .main-text-model');

  if (!colorSwatches.length || !mediaItems.length || !modelSizeTextEl) return;

  // Shop This Color — parse map once, reuse in updateMediaDisplay
  const _stcLink = document.querySelector('.ctm-shop-this-color-link');
  const _stcMap = {};
  if (_stcLink) {
    (_stcLink.getAttribute('data-color-map') || '').replace(/&#10;/g, '\n').split('\n').forEach(function(line) {
      line = line.trim();
      if (!line) return;
      const i = line.indexOf(':');
      if (i !== -1) _stcMap[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
    });
  }

  updateVariantBadge();

  function extractVariantParts(altText) {
    if (!altText) return [];

    const raw = altText.toLowerCase();
    const parts = raw.split('||').map((p) => p.trim());
    const matchSegment = parts.length > 1 ? parts[1] : parts[0];
    return matchSegment
      .replace('variants:', '')
      .split('*')
      .map((v) => v.trim())
      .filter(Boolean);
  }

  function updateMediaDisplay(e) {
    let defaultVariantValue;

    const checkedSwatch = Array.from(colorSwatches).find((input) => input.checked);
    if (!checkedSwatch) return;

    const modelSizingTest = checkedSwatch.dataset.modelSizing || '';

    if (e && e.target) {
      defaultVariantValue = e.target.value
    } else {
      defaultVariantValue = checkedSwatch.getAttribute('data-variant-value');
    }

    if (!defaultVariantValue) return;

    let matchingIndexes = [];
    let firstVisibleIndex = -1;

    mediaItems.forEach((media, index) => {
      const mediaAltRaw = media.getAttribute('data-media-alt') || '';
      const variantParts = extractVariantParts(mediaAltRaw);

      const match = variantParts.some((part) => part.trim().toLowerCase() === defaultVariantValue.toLowerCase());

      if (match) {
        matchingIndexes.push(index);
        if (firstVisibleIndex === -1) {
          firstVisibleIndex = index;
        }
      }
    });

    const showAll = matchingIndexes.length === 0;

    mediaItems.forEach((media, index) => {
      const mediaAltRaw = media.getAttribute('data-media-alt') || '';
      const variantParts = extractVariantParts(mediaAltRaw);

      const match = variantParts.some((part) => part.trim().toLowerCase() === defaultVariantValue.toLowerCase());
      const shouldShow = showAll || match;
      media.style.display = shouldShow ? '' : 'none';
    });

    const visibleMediaItems = [...document.querySelectorAll('.product__media-item:not(.swiper-slide)')].filter(
      (el) => el.style.display != 'none'
    );

    visibleMediaItems.forEach((el, index) => {
      const modelSizingTest = checkedSwatch.dataset.modelSizing;
      const badge = el.querySelector('div.product-color-badge');

      if (badge) {
        badge.remove();
      }

      // Only add badge if modelSizingTest has a value and is not empty
      if (modelSizingTest && modelSizingTest.trim() !== '') {
        if(isQuickView){
          if (index == 0 || (visibleMediaItems.length == 1 && index == 0)) {
            el.insertAdjacentHTML('beforeend', `<div class="product-color-badge">${modelSizingTest}</div>`);
          }
        } else {
          if (index == 1 || (visibleMediaItems.length == 1 && index == 0)) {
            el.insertAdjacentHTML('beforeend', `<div class="product-color-badge">${modelSizingTest}</div>`);
          }
        }
      }

    });

    modelSizeTextEl.forEach((el) => {
      el.textContent = modelSizingTest;
    });

    updateVariantBadge();

    if (prodPageSwiper) {
      prodPageSwiper.update();

      // Force Swiper to move to first visible slide on variant change
      requestAnimationFrame(() => {
        prodPageSwiper.setTranslate(0);
        prodPageSwiper.updateSlides();
        prodPageSwiper.updateProgress();
        prodPageSwiper.slideTo(0, 0); // instant, no animation
      });
    }

    const loadMoreBtn = document.getElementById('load-more-media');

    if (loadMoreBtn) {
      const allMediaItems = Array.from(document.querySelectorAll('.product__media-item:not(.swiper-slide)'));
      const visibleMediaItems = allMediaItems.filter((el) => el.style.display !== 'none');

      allMediaItems.forEach((el) => el.classList.remove('extra-product-media', 'hidden'));

      if (visibleMediaItems.length > 4) {
        visibleMediaItems.forEach((el, index) => {
          if (index >= 4) {
            el.classList.add('extra-product-media', 'hidden');
          }
        });

        loadMoreBtn.style.display = 'inline-block';
      } else {
        loadMoreBtn.style.display = 'none';
      }

      loadMoreBtn.onclick = function () {
        document.querySelectorAll('.extra-product-media').forEach((el) => el.classList.remove('hidden'));
        loadMoreBtn.style.display = 'none';
      };
    }

    // Update Shop This Color link
    if (_stcLink) {
      const stcUrl = _stcMap[defaultVariantValue.trim().toLowerCase()];
      const stcWrapper = _stcLink.closest('.ctm_shop_this_color');
      if (stcUrl) {
        _stcLink.href = stcUrl;
        if (stcWrapper) stcWrapper.style.display = '';
      } else {
        if (stcWrapper) stcWrapper.style.display = 'none';
      }
    }
  }

  updateMediaDisplay();

  colorSwatches.forEach((swatch) => {
    swatch.addEventListener('change', (e) => {
      updateMediaDisplay(e);
    });
  });

  function updateVariantBadge() {
    const colorSwitchInput = document.querySelectorAll('.color-swatch-input:not([id*="product-recommendations"])');
    const checkedSwatch = Array.from(colorSwitchInput).find((input) => input.checked);
    
    if (!checkedSwatch) return;
    
    const modelSizingText = checkedSwatch.dataset.modelSizing;
    
    // Only show badges if modelSizingText has actual content
    if (modelSizingText && modelSizingText.trim() !== '') {
      const badges = document.querySelectorAll('.product__media-item:not(.ctm-custom-product) .product-color-badge.mobile');
  
      badges.forEach((badge) => {
        badge.textContent = modelSizingText;
        badge.style.display = 'block';
      });
    } else {
      // Hide badges if modelSizingText is empty or blank
      const badges = document.querySelectorAll('.product__media-item:not(.ctm-custom-product) .product-color-badge.mobile');
      badges.forEach((badge) => {
        badge.textContent = '';
        badge.style.display = 'none';
      });
    }
  }
  
}

document.addEventListener('DOMContentLoaded', function () {
  handleProductImages();
});

window.addEventListener("quickview:load", () => {
  handleProductImages(true);
});

$(document).ready(function () {
  function updateSelectedValue(target) {
    const selectedValue = $(target)
      .closest("div.swiper-slide-thumb-active")
      .find("img")
      .attr("alt");
    $(".size_model-content .main-text-model").text(selectedValue);
  }

  $(document).on("click", ".product__media-subitem", function (e) {
    updateSelectedValue(e.target);
  });

  $(document).on(
    "click",
    "variant-radios .product-form__controls-group .color-swatch",
    function (e) {
      setTimeout(() => {
        updateSelectedValue(".product__media-subitem");
      }, 100);
    }
  );

  $(document).on(
    "click",
    ".product__media-list .swiper-btn--next, .product__media-list .swiper-btn--prev",
    function (e) {
      const activeSlide = $(
        ".product__media-subitem.swiper-slide-thumb-active"
      );
      updateSelectedValue(activeSlide);
    }
  );

  const activeThumb = $(
    ".product__media-subitem.swiper-slide-thumb-active img"
  );
  if (activeThumb.length) {
    updateSelectedValue(activeThumb);
  }

  $(document).on(
    "click",
    ".product-form__controls-group .color-swatch",
    function (e) {
      $(".product__media-list .swiper-wrapper").css(
        "transform",
        "translate3d(0px, 0px, 0px)"
      );
    }
  );

  $(document).on(
    "click",
    ".product__media-sublist .swiper-wrapper .product__media-subitem",
    function (e) {
      const index = $(this).index();
      const itemWidth = $(".product__media-item").outerWidth();
      const translateValue = -(itemWidth * index);
      $(".product__media-list .swiper-wrapper").css(
        "transform",
        `translate3d(${translateValue}px, 0px, 0px)`
      );
    }
  );
});
document.addEventListener("DOMContentLoaded", () => {
  const updateVariantTags = (productCard, tagSelector, specificInput = null) => {
    // Use specific input if provided, otherwise look for checked swatch
    let currentInput = specificInput;
    
    if (!currentInput) {
      currentInput = productCard.querySelector(
        '.color-swatch-input:checked, input[data-variant][checked]'
      );
    }
    
    const currentVariantId = currentInput?.dataset?.variant;
    
    if (!currentVariantId) return;
    
    productCard.querySelectorAll(tagSelector).forEach((tag) => {
      tag.style.display = "none";
    });
    const relevantTag = Array.from(
      productCard.querySelectorAll(tagSelector)
    ).find((tag) => {
      const variantId = tag.getAttribute("data-variant-id");
      return variantId === currentVariantId;
    });
    if (relevantTag) {
      relevantTag.style.display = "block";
    }
  };
  window.updateVariantTags = updateVariantTags;

  const tagSelectors = [
    ".variant-tag",
    ".variant-newsize_tag",
    ".variant-preorder_tag",
    ".new_promo",
    ".best_promo",
    ".pref_promo",
    ".los_promo"
  ];

  document.querySelectorAll(".collection-product-card").forEach((product) => {
    tagSelectors.forEach((selector) => updateVariantTags(product, selector));
  });
});

/* ADA Audit js start */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".color-swatch-input")?.forEach((input) => {
    if (!input) return;

    input.addEventListener("focus", () => {
      const swatch = input.nextElementSibling;
      if (swatch && swatch.classList.contains("color-swatch")) {
        swatch.style.border = "2px solid #2ab572";
      }
    });

    input.addEventListener("blur", () => {
      const swatch = input.nextElementSibling;
      if (swatch && swatch.classList.contains("color-swatch")) {
        swatch.style.border = "none";
      }
    });
  });

  const tabs = document.querySelectorAll(".tab-links .tab-link");
  if (tabs?.length) {
    tabs?.forEach((tab) => {
      if (tab) {
        tab.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            tabs?.forEach((tab) => tab.classList.remove("active"));

            const tabValue = tab.getAttribute("data-tab");
            const tabContainer = tab.closest(".tabs-container");

            const swipers = tabContainer.querySelectorAll(`.tab-content`);
            swipers?.forEach((swiper) => swiper.classList.remove("active"));

            const swiper = tabContainer.querySelector(
              `.tab-content#${tabValue}`
            );

            tab.classList.toggle("active");
            swiper.classList.toggle("active");
          }
        });
      }
    });
  }
  //add aria-hidden="true" and tabindex="-1" to non-visible slides (excluding collection-product-card)
  const productCards = document.querySelectorAll(
    ".product-image-gallery, .product__media-subitem, .product__media-sublist"
  );

  if (productCards?.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const card = entry.target;
          if (entry.isIntersecting) {
            card.setAttribute("aria-hidden", "false");
            card.removeAttribute("tabindex");
          } else {
            card.setAttribute("aria-hidden", "true");
            card.setAttribute("tabindex", "-1");
          }
        });
      },
      {
        root: null,
        threshold: 0.5,
      }
    );

    productCards.forEach((card) => {
      observer.observe(card);
    });
  }

  // Roving tabindex and keyboard navigation for variant radio inputs
  const radios = document.querySelectorAll('input[type="radio"][data-radio-group]');
  const groups = {};

  radios.forEach((el, i) => {
    const group = el.dataset.radioGroup;
    groups[group] = groups[group] || [];
    groups[group].push(el);
    el.tabIndex = el.checked ? 0 : -1;

    el.addEventListener("click", () => select(groups[group], i));

    el.addEventListener("keydown", (e) => {
      const keys = ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"];
      if (!keys.includes(e.key) && e.key !== " " && e.key !== "Spacebar")
        return;
      e.preventDefault();

      let newIndex = i;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp")
        newIndex = (i - 1 + groups[group].length) % groups[group].length;
      if (e.key === "ArrowRight" || e.key === "ArrowDown")
        newIndex = (i + 1) % groups[group].length;
      if (e.key === " " || e.key === "Spacebar") select(groups[group], i);
      else {
        groups[group][newIndex].focus();
        select(groups[group], newIndex);
      }
    });
  });

  // Fallback: set first radio focusable if none checked
  Object.values(groups).forEach((group) => {
    if (!group.some((r) => r.checked))
      group[0].tabIndex = 0;
  });

  function select(group, index) {
    group.forEach((el, i) => {
      el.tabIndex = i === index ? 0 : -1;
      if (i === index) {
        el.checked = true;
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  }
  // Product media img zoom-in and out
  document.addEventListener("keydown", function (event) {
    // Get the currently active slide
    const activeSlide = document.querySelector(
      ".swiper-slide.product-image-gallery.swiper-slide-active"
    );
    if (!activeSlide) return;

    // Get the image inside the swiper-zoom-container of the active slide
    const zoomImg = activeSlide.querySelector(".swiper-zoom-container img");
    if (!zoomImg) return;

    if (event.key === "+") {
      activeSlide.classList.add("swiper-slide-zoomed");
      zoomImg.style.transitionDuration = "300ms";
      zoomImg.style.transform = "translate3d(0px, 0px, 0px) scale(3)";
    }

    if (event.key === "-") {
      activeSlide.classList.remove("swiper-slide-zoomed");
      zoomImg.style.transitionDuration = "300ms";
      zoomImg.style.transform = "translate3d(0px, 0px, 0px) scale(1)";
    }
  });

  const colorSwiper = document.querySelector(".color-swiper-section");
  const swiperNotification = document.querySelectorAll(
    ".swiper-notification"
  );

  if (colorSwiper) {
    const colorSwiperWrapper = colorSwiper.querySelector(".swiper-wrapper");
    if (colorSwiperWrapper) colorSwiperWrapper.removeAttribute("aria-live");

    if (swiperNotification?.length) {
      swiperNotification.forEach((notification) => {
        notification.removeAttribute("aria-live");
        notification.removeAttribute("aria-atomic");
      })
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const card = entry.target;
        if (entry.isIntersecting) {
          card.setAttribute("aria-hidden", "false");
          card.removeAttribute("tabindex");
        } else {
          card.setAttribute("aria-hidden", "true");
          card.setAttribute("tabindex", "-1");
        }
      });
    },
    {
      root: null,
      threshold: 0.5,
    }
  );

  const slides = document.querySelectorAll(".swiper-slide");
  if (slides?.length) {
    slides?.forEach((slide) => {
      observer.observe(slide);
    });
  }

});

// Quick View added tabindex on selected variant
window.addEventListener("quickview:load", () => {
  const quickViews = document.querySelectorAll(
    ".quick-add-modal__content-wrapper"
  );
  if (quickViews?.length) {
    quickViews?.forEach((qv) => {
      const radios = qv.querySelectorAll('input[type="radio"][data-radio-group]');
      if (radios?.length) {
        const hasChecked = Array.from(radios).some((r) => r.checked);
        radios.forEach((radio) => {
          radio.tabIndex = radio.checked || (!hasChecked && radio === radios[0]) ? 0 : -1;
          radio.addEventListener("click", (e) => {
            radios.forEach((r) => { r.tabIndex = -1; });
            e.target.tabIndex = 0;
          });
        });
      }
    });
  }
});

// Model name and size update on variant change
document.addEventListener("DOMContentLoaded", () => {
  function updateModelSizeText() {
    const modalSizeDiv = document.querySelectorAll(".size_model-content .main-text-model");
    const selectedVariant = document.querySelector('.product-form__controls-group .color-swatch-input:checked');

    if (selectedVariant && modalSizeDiv) {
      const selectedValue = selectedVariant.getAttribute("data-model-sizing");
      modalSizeDiv.forEach((div) => {
        div.textContent = selectedValue;
      });
    }
  }

  // Initial update on page load
  updateModelSizeText();

  // Update on variant change
  const variants = document.querySelectorAll(".product-form__controls-group .color-swatch-input");
  if (variants.length) {

    variants.forEach((variant) => {
      variant.addEventListener("change", () => {
        updateModelSizeText();
      });
    });
  }
});
// mobile navigation js 

document.querySelectorAll('.menu-drawer__menu .menu-drawer__menu-item.list-menu__item a').forEach(link => {
  link.addEventListener('click', function (e) {
    const isMobile = window.innerWidth < 1200;
    if (isMobile) {
      this.removeAttribute("href");
    } else {
      document.querySelectorAll('.menu-drawer__menu .menu-drawer__menu-item.list-menu__item a').forEach(link => {
        link.setAttribute("href", link.dataset.href);
      });
    }
  });
});

window.addEventListener('resize', function () {
  const isMobile = window.innerWidth < 1200;
  if (isMobile) {
    document.querySelectorAll('.menu-drawer__menu .menu-drawer__menu-item.list-menu__item a').forEach(link => {
      link.removeAttribute("href");
    });
  } else {
    document.querySelectorAll('.menu-drawer__menu .menu-drawer__menu-item.list-menu__item a').forEach(link => {
      link.setAttribute("href", link.dataset.href);
    });
  }
});

// Product tag js update start
document.addEventListener("DOMContentLoaded", function () {
  const tagEl = document.querySelector("#variant-tag");

  if (!tagEl) return;

  const swatchInputs = document.querySelectorAll(".color-swatch-input");

  function updateTagFromSelectedInput() {
    const selectedInput = document.querySelector(".color-swatch-input:checked");
    const tagValue = selectedInput?.dataset.tag || "";
    tagEl.textContent = tagValue;
    tagEl.closest(".product-variant--tag").style.display = tagValue ? "block" : "none";
  }

  // Initial load
  updateTagFromSelectedInput();

  // Update on swatch change
  swatchInputs.forEach(input => {
    input.addEventListener("change", updateTagFromSelectedInput);
  });
  // Product tag js update end

});

document.addEventListener("DOMContentLoaded", () => {
  const handleFiltersVisibility = () => {
    const facetsLists = document.querySelectorAll(".facets__list");

    facetsLists.forEach((list) => {
      const items = list.querySelectorAll(".facets__item");
      const showMoreWrapper = list.nextElementSibling;
      const showMoreBtn = showMoreWrapper?.querySelector(".facets-show-more-btn");
      const plusIcon = showMoreWrapper?.querySelector(".show-plus-icon");
      const minusIcon = showMoreWrapper?.querySelector(".show-minus-icon");

      if (items.length > 5) {
        items.forEach((item, index) => {
          if (index >= 5) {
            item.classList.add("hidden");
          }
        });

        showMoreWrapper.style.display = "flex";

        showMoreBtn.addEventListener("click", () => {
          const expanded = showMoreBtn.getAttribute("data-expanded") === "true";

          if (expanded) {
            items.forEach((item, index) => {
              if (index >= 5) {
                item.classList.add("hidden");
              }
            });
            showMoreBtn.textContent = "Show More";
            plusIcon.style.display = "block";
            minusIcon.style.display = "none";
            showMoreBtn.setAttribute("data-expanded", "false");
            // return focus to button so user knows state changed
            showMoreBtn.focus();
          } else {
            items.forEach((item) => item.classList.remove("hidden"));
            showMoreBtn.textContent = "Show Less";
            plusIcon.style.display = "none";
            minusIcon.style.display = "block";
            showMoreBtn.setAttribute("data-expanded", "true");
            // move focus to first newly revealed item
            const firstRevealed = items[5]?.querySelector('input.facets-checkbox__hide:not([disabled])');
            if (firstRevealed) firstRevealed.focus();
          }
        });
      } else {
        showMoreWrapper.style.display = "none";
      }
    });
  };

  handleFiltersVisibility();
});

// collection filter menu show more functionality
function toggleBannersByURL() {
  const bannerCards = document.querySelectorAll('.banner_promo-ctm');
  const query = window.location.search;

  // Check if filters or sorting are applied
  const hasFilters = query.includes('filter') || query.includes('sort_by');

  bannerCards.forEach(banner => {
    banner.style.display = hasFilters ? 'none' : '';
  });
}

// Initial check on page load
toggleBannersByURL();

// Re-check after Shopify AJAX filter reloads the grid
document.addEventListener('shopify:section-render', (event) => {
  if (event.detail.sectionId.includes('collection')) {
    toggleBannersByURL();
  }
});

// Watch for URL changes during filtering (important for instant detection)
let lastURL = location.href;
new MutationObserver(() => {
  if (location.href !== lastURL) {
    lastURL = location.href;
    toggleBannersByURL();
  }
}).observe(document, {subtree: true, childList: true});

// Size Chart Scroll start

function bindSizeChartHandler(container = document) {
  const sizeChartLink = container.querySelector(".ctm_sizechart_btn_txt");
  const accordion = container.querySelector("#ctm_size_chart");

  if (sizeChartLink && accordion) {
    sizeChartLink.addEventListener("click", function () {
      accordion.scrollIntoView({ behavior: "smooth", block: "center" });

      const title = accordion.querySelector(".about__accordion-title");
      if (title && !title.classList.contains("active")) {
        title.click();
      }

      const button = accordion.querySelector("button[aria-expanded]");
      if (button) button.focus();
    });
  }
}

function openSizeChartAccordion(container = document) {
  if (window.location.hash !== "#ctm_size_chart") return;

  const accordion = container.querySelector("#ctm_size_chart");
  if (accordion) {
    accordion.scrollIntoView({ behavior: "smooth", block: "center" });

    const title = accordion.querySelector(".about__accordion-title");
    if (title && !title.classList.contains("active")) {
      title.click();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  bindSizeChartHandler();
  openSizeChartAccordion();
});

window.addEventListener("quickview:load", () => {
  const quickViews = document.querySelectorAll(".quick-add-modal__content-wrapper");

  quickViews.forEach((quickView) => {
    bindSizeChartHandler(quickView);
    openSizeChartAccordion(quickView);
  });
});

// Size Chart Scroll End

// Shop Promise and shipping Design start
customElements.whenDefined('delivery-promise-wc').then(() => {
  const promiseWC = document.querySelector('delivery-promise-wc');
  
  if (!promiseWC) return;
  
  const shadowRoot = promiseWC.shadowRoot;
  if (!shadowRoot) return;

  const style = document.createElement('style');
  style.textContent = `
    .ContainerCommon__Container.ShopPromiseLayout__Clickable.ContainerCommon__FontOverride {
        background-color: transparent !important;
        padding: 0 !important;
    }
    .PromiseShell_Promise {
      background-color: transparent !important;
      padding: 0 !important;
    }
    .ProductPageContainer__Spacer {
      margin: 5px 0 !important;
    }
    .Text__Text.Text__regular, .TextField__InputWrapper input[type='text'], .Button__button {
      color: black !important;
    }
    .BlockStack__BlockStack > .InlineStack__InlineStack + .Text__Text.Text__inherit.Text__bodyMd.Text__regular {
      display: none !important;
    }
    .TextField__InputWrapper input[type='text'] , .InlineStack__InlineStack .Button__button {
      border: 1px solid black !important;
    }
  `;
  
  shadowRoot.appendChild(style);
  
}).catch(error => {
});

// Shop Promise and shipping Design end

document.querySelectorAll('.ctm-digital-gift-card').forEach(container => {
  const display = container.querySelector('.product-form-color-value');
  const radios = container.querySelectorAll('.ctm-variant-selector input[type="radio"]');

  // Show initial selected value
  const selected = container.querySelector('input[type="radio"]:checked');
  if (selected) display.textContent = selected.value;

  radios.forEach(r => r.addEventListener('change', e => display.textContent = e.target.value));
});


(function () {
  const SPECIAL_IDS = [
    45597976952963, 45597976985731, 45597977018499,
    45597977051267, 45597979017347, 45597979050115,
    45597979082883, 45597979115651, 45597979148419
  ]; 
  let enforcing = false;

  function toggleGiftCartMsg(show) {
    const msgEl = document.querySelector('.ctm-gift-cart-msg p');
    if (!msgEl) return;

    msgEl.style.display = show ? 'block' : 'none';
  }

  function enforceExclusive() {
    if (enforcing) return;
    enforcing = true;

    const cart = (window.Rebuy?.SmartCart?.cart) || window.Rebuy?.Cart?.getCart();
    const items = cart?.items || [];

    const hasSpecial = items.some(i => SPECIAL_IDS.includes(Number(i.id)));
    const hasOther = items.some(i => !SPECIAL_IDS.includes(Number(i.id)));

    if (hasSpecial && hasOther) {
      toggleGiftCartMsg(true);

      const lastItem = items[items.length - 1];
      const lastIsSpecial = SPECIAL_IDS.includes(Number(lastItem.id));

      items.forEach((it) => {
        const isSpecial = SPECIAL_IDS.includes(Number(it.id));
        if ((lastIsSpecial && !isSpecial) || (!lastIsSpecial && isSpecial)) {
          window.Rebuy.SmartCart.removeItem(it);
        }
      });
    } else {
      toggleGiftCartMsg(false);
    }

    setTimeout(() => { enforcing = false; }, 300);
  }

  document.addEventListener('rebuy:smartcart.ready', () => {
    enforceExclusive();
  });

  document.addEventListener('rebuy:cart.change', () => {
    enforceExclusive();
  });

  document.addEventListener('rebuy:smartcart.line-item-removed', () => {
    enforceExclusive();
  });
})();

// Mission page donation amount js

(function () {

var IMPACT_URL    = 'https://www.pledgeling.com/widgets/impact'
var POLL_INTERVAL = 30000

var getJSON = function getJSON (url, success) {
  var xhr = new XMLHttpRequest()

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4)
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304)
        success(JSON.parse(xhr.responseText))
      else
        console.log(xhr)
  }

  xhr.open('GET', url)
  xhr.setRequestHeader('Accept', 'application/json')
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.send()
}


var formatNumber = function formatNumber(value) {
  if (value === null || value === undefined) return '';

  const abs = Math.abs(value);
  if (abs >= 1e12) {
    return (value / 1e12).toFixed(1).replace(/\.0$/, '') + 'T';
  } else if (abs >= 1e9) {
    return (value / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (abs >= 1e6) {
    return (value / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (abs >= 1e3) {
    return (value / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return String(value);
}


var initImpact = function initImpact (impact) {
  var token = 'PBUYdty7gXwzMv1T'
  getJSON([IMPACT_URL, token].join('/'), function (data) {
    impact.innerHTML = formatNumber(data.amount.toString())
    setTimeout(function () { initImpact(impact) }, POLL_INTERVAL)
  })
}

var init = function init () {
  var impacts = document.querySelectorAll('[data-impact-id]')
  Array.prototype.forEach.call(impacts, initImpact)
}

document.addEventListener('DOMContentLoaded', init)

})();

// Mission page donation amount js

// Final sale varinats JS
document.addEventListener("DOMContentLoaded", function () {
  const productForm = document.querySelector(".product-form");
  const finalSaleInput = document.getElementById("final-sale-property");

  if (!productForm || !finalSaleInput || !window.finalSaleVariants) return;

  function updateFinalSaleProperty() {
    const selectedVariantId = Number(productForm.querySelector('[name="id"]').value);
    const finalSaleValue = window.finalSaleVariants[selectedVariantId];

    const isFinalSale =
      finalSaleValue === true ||
      finalSaleValue === "true" ||
      finalSaleValue === 1 ||
      finalSaleValue === "1";

    // ✅ Only include property when true; remove otherwise
    if (isFinalSale) {
      finalSaleInput.name = "properties[_final_sale_variants]";
      finalSaleInput.value = "true";
    } else {
      // Remove name so Shopify won’t include it in the submission
      finalSaleInput.removeAttribute("name");
      finalSaleInput.value = "";
    }
  }

  updateFinalSaleProperty();
  productForm.addEventListener("change", updateFinalSaleProperty);
  });

// Final Sale Notice

document.addEventListener("DOMContentLoaded", function () {
  const productForm = document.querySelector(".product-form");
  const finalSaleNoticeInput = document.getElementById("final-sale-notice-property");

  if (!productForm || !finalSaleNoticeInput || !window.finalSaleVariants) return;

  function updateFinalSaleNotice() {
    const selectedVariantId = Number(productForm.querySelector('[name="id"]').value);
    const finalSaleValue = window.finalSaleVariants[selectedVariantId];

    const isFinalSale =
      finalSaleValue === true ||
      finalSaleValue === "true" ||
      finalSaleValue === 1 ||
      finalSaleValue === "1";

    if (isFinalSale) {
      finalSaleNoticeInput.name = "properties[FINAL SALE]";
      finalSaleNoticeInput.value = "No Returns or Exchanges";
    } else {
      finalSaleNoticeInput.removeAttribute("name");
      finalSaleNoticeInput.value = "";
    }
  }

  updateFinalSaleNotice();
  productForm.addEventListener("change", updateFinalSaleNotice);
});


// Bundle drawer on PDPS - Optimized
document.addEventListener("DOMContentLoaded", function () {
  const drawer = document.getElementById("buildALookDrawer");
  const closeBtn = document.getElementById("closeBuildALook");
  const addAllForm = document.getElementById("add-all-to-cart");
  const addBtn = document.getElementById("add-all-btn");
  
  const initDrawerControls = () => {
    const btns = document.querySelectorAll("#ctm-build-a-look");
    if (!btns.length || !drawer || !closeBtn) return;

    let drawerOpener = null;

    const openDrawer = (triggerEl) => {
      drawerOpener = triggerEl;
      drawer.classList.add("open");
      closeBtn.focus();
    };

    // fix - #569: Closing this modal dialog does not return the user to the element that opened it
    const closeDrawer = () => {
      drawer.classList.remove("open");
      if (drawerOpener) {
        drawerOpener.focus();
        drawerOpener = null;
      }
    };

    btns.forEach(btn => btn.addEventListener("click", () => openDrawer(btn)));
    closeBtn.addEventListener("click", closeDrawer);

    // fix - #568: Keyboard users are able to focus on elements outside of this modal dialog while it is open
    drawer.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeDrawer(); return; }
      if (e.key !== "Tab") return;
      const focusable = Array.from(drawer.querySelectorAll(
        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
      )).filter(el => !el.closest('[hidden]') && el.offsetParent !== null);
      if (!focusable.length) { e.preventDefault(); return; }
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  };

  const initSwipers = () => {
    document.querySelectorAll(".drawer-product-images.swiper:not(.swiper-initialized)").forEach(el => {
      new Swiper(el, {
        slidesPerView: 1,
        loop: true,
        a11y: false,
        navigation: {
          nextEl: el.querySelector(".swiper-button-next"),
          prevEl: el.querySelector(".swiper-button-prev"),
        },
      });
      el.classList.add('swiper-initialized');
    });
  };

  class BundleDrawerManager {
    constructor() {
      this.products = new Map();
      this.totalPrice = 0;
      this.drawer = document.getElementById("buildALookDrawer");
      this.totalPriceEl = document.getElementById("drawer-total-price");
      this.init();
    }

    init() {
      this.initializeProducts();
      this.bindEvents();
      this.updateTotalPrice();
    }

    initializeProducts() {
      document.querySelectorAll(".drawer-product").forEach(productEl => {
        const productIndex = parseInt(productEl.dataset.productIndex);
        const variantsScript = productEl.querySelector(".product-variants-json");
        
        if (!variantsScript) return;
        
        const variants = JSON.parse(variantsScript.textContent);
        const productData = {
          variants,
          currentVariant: variants.find(v => v.available) || variants[0],
          element: productEl,
          cachedElements: this.cacheProductElements(productEl)
        };
        
        this.products.set(productIndex, productData);
        
        if (variants.length === 1) {
          this.selectSingleVariant(productIndex, variants[0]);
        }
      });
    }

    cacheProductElements(productEl) {
      return {
        variantIdInput: productEl.querySelector(".selected-variant-id"),
        priceEl: productEl.querySelector("[id^='price-']"),
        nameEl: productEl.querySelector("[id^='variant-name-']"),
        optionSpans: productEl.querySelectorAll(".product-form-color-value"),
        swiper: productEl.querySelector(".swiper")?.swiper
      };
    }

    selectSingleVariant(productIndex, variant) {
      const productData = this.products.get(productIndex);
      if (!productData) return;
      
      const { variantIdInput, priceEl, nameEl } = productData.cachedElements;
      
      if (variantIdInput) variantIdInput.value = variant.id;
      if (priceEl) priceEl.textContent = this.formatMoney(variant.price);
      if (nameEl) nameEl.textContent = variant.title;
      
      const singleInput = productData.element.querySelector('input[type="radio"]');
      if (singleInput) {
        singleInput.checked = true;
        const label = productData.element.querySelector(`label[for="${singleInput.id}"]`);
        label?.classList.add('selected');
      }
      
      this.updateTotalPrice();
    }

    bindEvents() {
      this.drawer?.addEventListener("change", (e) => {
        if (e.target.matches('input[name*="options["]')) {
          const productEl = e.target.closest(".drawer-product");
          productEl && this.handleVariantChange(parseInt(productEl.dataset.productIndex));
        }
      });

      this.drawer?.addEventListener("click", (e) => {
        if (e.target.matches(".product-form__option-label")) {
          setTimeout(() => {
            const productEl = e.target.closest(".drawer-product");
            productEl && this.handleVariantChange(parseInt(productEl.dataset.productIndex));
          }, 10);
        }
      });
    }

    handleVariantChange(productIndex) {
      const productData = this.products.get(productIndex);
      if (!productData) return;

      const selectedOptions = this.getSelectedOptions(productData.element);
      const matchingVariant = this.findMatchingVariant(productData.variants, selectedOptions);

      if (matchingVariant) {
        productData.currentVariant = matchingVariant;
        this.updateProductDisplay(productIndex, matchingVariant, selectedOptions);
        this.updateSizeAvailability(productIndex, selectedOptions);
        this.updateTotalPrice();
        
        if (matchingVariant.featured_image) {
          this.updateProductImage(productIndex, matchingVariant.featured_image);
        }
      }
    }

    getSelectedOptions(productEl) {
      const selectedOptions = {};
      productEl.querySelectorAll('input[name*="options["]:checked').forEach(input => {
        const optionName = input.name.match(/options\[([^\]]+)\]/)?.[1];
        optionName && (selectedOptions[optionName] = input.value);
      });
      return selectedOptions;
    }

    findMatchingVariant(variants, selectedOptions) {
      const optionNames = Object.keys(selectedOptions);
      return variants.find(variant => 
        optionNames.every((optionName, index) => variant.options[index] === selectedOptions[optionName])
      );
    }

    updateProductDisplay(productIndex, variant, selectedOptions) {
      const productData = this.products.get(productIndex);
      if (!productData) return;
      
      const { variantIdInput, priceEl, nameEl, optionSpans } = productData.cachedElements;
      
      if (variantIdInput) variantIdInput.value = variant.id;
      if (priceEl) priceEl.textContent = this.formatMoney(variant.price);
      if (nameEl) nameEl.textContent = variant.title;
      
      optionSpans.forEach((span, index) => {
        const optionName = Object.keys(selectedOptions)[index];
        if (optionName && selectedOptions[optionName]) {
          span.textContent = selectedOptions[optionName];
        }
      });
    }

    updateProductImage(productIndex, featuredImage) {
      const productData = this.products.get(productIndex);
      if (!productData?.cachedElements.swiper || !featuredImage) return;
      
      const targetImg = productData.element.querySelector(`img[data-image-id='${featuredImage.id}']`);
      if (targetImg) {
        const slides = Array.from(productData.element.querySelectorAll(".swiper-slide img"));
        const index = slides.indexOf(targetImg);
        index >= 0 && productData.cachedElements.swiper.slideTo(index);
      }
    }

    updateSizeAvailability(productIndex, selectedOptions) {
      this.products.forEach((productData) => {
        const thisProductOptions = this.getSelectedOptions(productData.element);
        const selectedColor = thisProductOptions[Object.keys(thisProductOptions)[0]];
        if (!selectedColor) return;

        const sizeOptions = productData.element.querySelectorAll('.ctm_size_option input[type="radio"]');
        sizeOptions.forEach(sizeInput => {
          const sizeLabel = productData.element.querySelector(`label[for="${sizeInput.id}"]`);
          if (!sizeLabel) return;

          const isAvailable = productData.variants.some(variant => 
            variant.option1 === selectedColor && 
            variant.option2 === sizeInput.value && 
            variant.available
          );

          if (isAvailable) {
            sizeLabel.classList.remove('unavailable');
            sizeInput.removeAttribute('data-unavailable');
            sizeInput.disabled = false;
          } else {
            sizeLabel.classList.add('unavailable');
            sizeInput.setAttribute('data-unavailable', 'true');
            sizeInput.disabled = true;
          }
        });
      });
    }

    updateTotalPrice() {
      this.totalPrice = 0;
      this.products.forEach(productData => {
        if (productData?.currentVariant) {
          this.totalPrice += productData.currentVariant.price;
        }
      });
      
      if (this.totalPriceEl) {
        this.totalPriceEl.textContent = this.formatMoney(this.totalPrice);
      }
    }

    formatMoney(cents) {
      return window.Shopify?.formatMoney?.(cents) || `$${(cents / 100).toFixed(2)}`;
    }

    getCurrentVariants() {
      return Array.from(this.products.values())
        .map(productData => productData?.currentVariant?.id)
        .filter(Boolean);
    }
  }

  initDrawerControls();
  initSwipers();
  const bundleManager = new BundleDrawerManager();

  if (addAllForm) {
    addAllForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const items = [];
      addAllForm.querySelectorAll(".selected-variant-id").forEach(input => {
        const variantId = input.value;
        if (variantId) {
          items.push({ id: parseInt(variantId), quantity: 1 });
        }
      });

      if (items.length === 0) {
        console.log("Please select variants for all products.");
        return;
      }

      const originalText = addBtn?.textContent || "Add to Cart";
      
      if (addBtn) {
        addBtn.textContent = "Adding to Cart...";
        addBtn.disabled = true;
      }

      fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ items }),
      })
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then(() => {
          console.log("All products added to cart!");
          drawer?.classList.remove("open");
          window.updateCartCount?.();
          setTimeout(() => window.openCartDrawer?.(), 300);
        })
        .catch(err => console.error("Error adding products:", err))
        .finally(() => {
          if (addBtn) {
            addBtn.textContent = originalText;
            addBtn.disabled = false;
          }
        });
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const variantNameEl = document.getElementById("selected-variant-name");

  if (!variantNameEl) return;

  document.addEventListener("variant:change", (event) => {
    const variant = event.detail.variant;
    if (variant) {
      variantNameEl.textContent = variant.title;
    }
  });


  const productForm = document.querySelector("form[action^='/cart/add']");
  if (productForm && window.productVariants) {
    productForm.addEventListener("change", () => {
      const selectedOptions = Array.from(
        productForm.querySelectorAll("select[name^='options'], input[name^='options']:checked")
      ).map(el => el.value);

      const currentVariant = window.productVariants.find(variant =>
        variant.options.every((opt, i) => opt === selectedOptions[i])
      );

      if (currentVariant) {
        variantNameEl.textContent = currentVariant.title;
      }
    });
  }
});


document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('.product-form__input--radios').forEach(function (fieldset) {

    // --- 1️⃣ Handle manual change ---
    fieldset.addEventListener('change', function (e) {
      if (e.target.type === "radio") {
        fieldset.querySelectorAll('label').forEach(function (label) {
          label.classList.remove('selected');
        });

        const selectedLabel = fieldset.querySelector(`label[for="${e.target.id}"]`);
        if (selectedLabel) {
          selectedLabel.classList.add('selected');
        }
      }
    });

    // --- 2️⃣ Handle case where there is only one radio ---
    const radios = fieldset.querySelectorAll('input[type="radio"]');
    if (radios.length === 1) {
      const singleRadio = radios[0];
      const singleLabel = fieldset.querySelector(`label[for="${singleRadio.id}"]`);
      singleRadio.checked = true; // make sure it's selected
      if (singleLabel) {
        singleLabel.classList.add('selected');
      }
    }

    // --- 3️⃣ Handle case where one is already pre-checked ---
    const precheckedRadio = fieldset.querySelector('input[type="radio"]:checked');
    if (precheckedRadio) {
      const precheckedLabel = fieldset.querySelector(`label[for="${precheckedRadio.id}"]`);
      if (precheckedLabel) {
        precheckedLabel.classList.add('selected');
      }
    }
  });
});


// Bundle drawers on pdps


// Low stock Badge in card-product
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".card-wrapper").forEach(card => {
    const firstBadge = card.querySelector(".lowstock-badge");
    if (firstBadge) firstBadge.classList.add("active");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const accountHeader = document.querySelector(".header__account details");

  if (!accountHeader) return;

  if (window.matchMedia("(min-width: 1024px)").matches) {
    accountHeader.addEventListener("mouseenter", () => {
      accountHeader.setAttribute("open", "");
    });

    accountHeader.addEventListener("mouseleave", () => {
      accountHeader.removeAttribute("open");
    });
  }
});

(function () {
  function hideZeroCompareAtPrices() {
    document.querySelectorAll(".rebuy-money.compare-at").forEach(function (el) {
      const priceText = el.textContent.trim();
      const numeric = parseFloat(priceText.replace(/[^0-9.-]/g, ""));
      if (numeric === 0) {
        el.style.display = "none";
      }
    });
  }

  hideZeroCompareAtPrices();

  document.addEventListener("rebuy:cart.updated", hideZeroCompareAtPrices);
  document.addEventListener("rebuy:smartcart.ready", hideZeroCompareAtPrices);
  document.addEventListener("rebuy:products.loaded", hideZeroCompareAtPrices);

  const observer = new MutationObserver(() => {
    hideZeroCompareAtPrices();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();

document.addEventListener('DOMContentLoaded', function() {
  const cartIcon = document.getElementById('cart-icon-bubble');
  if (cartIcon) {
    cartIcon.addEventListener('click', function(e) {
      // remove any drawer override
      e.stopImmediatePropagation();
      // go to cart page
      window.location.href = '/cart';
    });
  }
});

// Blog Image Carousels

document.addEventListener('DOMContentLoaded', function() {

  const carousel = document.querySelector('.blog-carousel');
  const slides = document.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.carousel-arrow.prev');
  const nextBtn = document.querySelector('.carousel-arrow.next');

  if (!carousel || slides.length === 0) return;

  let currentIndex = 0;

  function getSlideWidth() {
    const slide = slides[0];
    const style = window.getComputedStyle(carousel);
    const gap = parseInt(style.gap) || 0;
    return slide.offsetWidth + gap;
  }

  function updateSlide() {
    carousel.scrollTo({
      left: getSlideWidth() * currentIndex,
      behavior: 'smooth'
    });
  }

  nextBtn.addEventListener('click', function() {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      updateSlide();
    }
  });

  prevBtn.addEventListener('click', function() {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlide();
    }
  });

});

// ADA #299 — Nav submenu keyboard accessibility
(function () {
  var openBtn = null;

  function closeSubmenu() {
    if (!openBtn) return;
    openBtn.setAttribute('aria-expanded', 'false');
    var li = openBtn.closest('li');
    if (li) li.classList.remove('submenu-open');
    openBtn = null;
  }

  // Single delegated listener — no per-button loop
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.header__submenu-toggle');
    if (btn) {
      e.stopPropagation();
      var alreadyOpen = btn === openBtn;
      closeSubmenu();
      if (!alreadyOpen) {
        btn.setAttribute('aria-expanded', 'true');
        var li = btn.closest('li');
        if (li) li.classList.add('submenu-open');
        openBtn = btn;
      }
      return;
    }
    if (!e.target.closest('.submenu-open')) closeSubmenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSubmenu();
  });
}());
