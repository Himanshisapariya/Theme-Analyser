const generateSrcset = (image, widths = []) => {
	const imageUrl = new URL(image["src"]);
	return widths
		.filter((width) => width <= image["width"])
		.map((width) => {
			imageUrl.searchParams.set("width", width.toString());
			return `${imageUrl.href} ${width}w`;
		})
		.join(", ");
};

const createImageElement = (image, classes, sizes, productTitle) => {
	const previewImage = image["preview_image"];
	const newImage = new Image(previewImage["width"], previewImage["height"]);
	newImage.className = classes;
	newImage.alt = image["alt"] || productTitle;
	newImage.sizes = sizes;
	newImage.src = previewImage["src"];
	newImage.srcset = generateSrcset(
		previewImage,
		[165, 360, 533, 720, 940, 1066]
	);
	newImage.loading = "lazy";
	return newImage;
};

const productCache = new Map();

const fetchProduct = (handle) => {
  if (productCache.has(handle)) return productCache.get(handle);
  const promise = fetch(window.Shopify.routes.root + `products/${handle}.js`)
    .then((r) => r.json())
    .catch(() => null);
  productCache.set(handle, promise);
  return promise;
};

const checkSwatches = () => {
  document.querySelectorAll(".js-color-swatches-wrapper").forEach((wrapper) => {
    const card = wrapper.closest(".card-information") || wrapper;
    const handleProduct = wrapper.dataset.product;

    const getInput = (label) => {
      const id = label.getAttribute("for");
      return wrapper.querySelector(`input[id="${CSS.escape(id)}"]`) ||
             card.querySelector(`input[id="${CSS.escape(id)}"]`) ||
             document.getElementById(id);
    };

    const checkedInput = wrapper.querySelector(".js-color-swatches input:checked");
    if (checkedInput) {
      updateSwatchSelection(checkedInput, wrapper);
      const badge = card.querySelector(".lowstock-badge");
      if (badge) {
        const val = (checkedInput.dataset.lowStock || "").trim();
        badge.textContent = val;
        badge.style.display = val ? "inline-block" : "none";
      }
    }

    // Prefetch product data when mouse enters the card
    if (handleProduct) {
      wrapper.addEventListener("mouseenter", () => fetchProduct(handleProduct), { once: true, passive: true });
    }

    wrapper.querySelectorAll(".js-color-swatches input").forEach((input) => {
      input.addEventListener("change", (e) => {
        if (e.currentTarget.checked) {
          updateSwatchSelection(e.currentTarget, wrapper);
          const badge = card.querySelector(".lowstock-badge");
          if (badge) {
            const val = (e.currentTarget.dataset.lowStock || "").trim();
            badge.textContent = val;
            badge.style.display = val ? "inline-block" : "none";
          }
        }
      }, { passive: true });
    });

    wrapper.querySelectorAll(".js-color-swatches label").forEach((label) => {
      label.addEventListener("mouseenter", () => {
        const input = getInput(label);
        if (!input) return;

        const badge = card.querySelector(".lowstock-badge");
        if (badge) {
          const val = (input.dataset.lowStock || "").trim();
          badge.textContent = val;
          badge.style.display = val ? "inline-block" : "none";
        }

        if (!input.checked) {
          input.checked = true;
          updateSwatchSelection(input, wrapper);
        }
      }, { passive: true });
    });
  });
};

const updateSwatchSelection = (input, wrapper) => {
  const primaryImage = wrapper.querySelector(".media--first");
  const secondaryImage = wrapper.querySelector(".media--second");
  const handleProduct = wrapper.dataset.product;

  if (!primaryImage) return;

  wrapper.querySelectorAll(".js-color-swatches-link").forEach((item) =>
    item.setAttribute("href", input.dataset.variantLink)
  );

  const currentColor = input.value;

  fetchProduct(handleProduct).then((product) => {
    if (!product) return;

    const colorOptionIndex = product.options.findIndex(
      opt => opt.name.toLowerCase() === 'color'
    );

    if (colorOptionIndex === -1) return;

    const variant = product.variants.find((item) => {
      if (!item.featured_media) return false;
      const variantColorValue = item[`option${colorOptionIndex + 1}`];
      return variantColorValue?.toLowerCase().trim() === currentColor.toLowerCase().trim();
    });

    if (!variant) return;

    const newPrimaryImage = createImageElement(
      variant.featured_media,
      primaryImage.className,
      primaryImage.sizes,
      product.title
    );

    const productCard = input.closest('.collection-product-card');
    if (productCard) {
      productCard.setAttribute('data-variant-id', variant.id);
      const tagSelectors = ['.variant-tag', '.variant-newsize_tag', '.variant-preorder_tag',
                           '.new_promo', '.best_promo', '.pref_promo', '.los_promo'];
      tagSelectors.forEach((selector) => window.updateVariantTags(productCard, selector, input));
    }

    const card = input.closest('.card-information');
    if (card) {
      const title = card.querySelector('.b4b-title div, .option_name_CTM');
      if (title) title.textContent = input.value;

      updatePricing(card, variant, input.value);
    }

    updateImage(primaryImage, secondaryImage, newPrimaryImage);
  });
};

function updatePricing(card, variant, variantB4b) {
  const salePriceDiv = card.querySelector('.price__sale');
  const regularPriceDiv = card.querySelector('.price__regular');
  
  if (!salePriceDiv || !regularPriceDiv) return;

  const colorSwatch = card.querySelector(`.color-swatch[title="${variantB4b}"]`);
  const dataPrice = colorSwatch?.getAttribute('data-price');
  const dataComparePrice = colorSwatch?.getAttribute('data-compare-price');
  const miniPrice = card.querySelector('.price.mini-price');
  
  const isOnSale = variant.compare_at_price && variant.compare_at_price > variant.price;

  if (isOnSale) {
    salePriceDiv.style.display = "block";
    regularPriceDiv.style.display = "none";
    miniPrice?.classList.add('price--on-sale');

    const comparePriceDiv = salePriceDiv.querySelector(".flex_badge_price .compareatprice_active");
    if (comparePriceDiv && dataPrice) comparePriceDiv.innerHTML = dataPrice;

    const priceDiv = salePriceDiv.querySelector(".flex_badge_price dd.price__compare");
    if (priceDiv && dataComparePrice) {
      priceDiv.innerHTML = `<span class="price-item price-item--regular">${dataComparePrice}</span>`;
    } else if (!priceDiv && dataComparePrice) {
      const comparePriceParent = comparePriceDiv?.closest("dd");
      if (comparePriceParent) {
        const newPriceDiv = document.createElement('dd');
        newPriceDiv.className = 'price__compare';
        newPriceDiv.innerHTML = `<span class="price-item price-item--regular b4b-vprice">${dataComparePrice}</span>`;
        comparePriceParent.parentNode.insertBefore(newPriceDiv, comparePriceParent.nextSibling);
      }
    }

  } else {
    salePriceDiv.style.display = "none";
    regularPriceDiv.style.display = "flex";
    miniPrice?.classList.remove('price--on-sale');

    const regularPriceSpan = regularPriceDiv.querySelector('.price-item--regular');
    if (regularPriceSpan && dataPrice) {
      regularPriceSpan.innerHTML = dataPrice;
    } else if (!regularPriceDiv.querySelector("dd") && dataPrice) {
      const dd = document.createElement('dd');
      dd.innerHTML = `<span class="price-item price-item--regular b4b-vprice">${dataPrice}</span>`;
      regularPriceDiv.appendChild(dd);
    }
  }
}

function updateImage(primaryImage, secondaryImage, newPrimaryImage) {
  if (newPrimaryImage.src === primaryImage.src) return;

  if (secondaryImage) {
    const secondaryPath = new URL(secondaryImage.src).pathname;
    const newPrimaryPath = new URL(newPrimaryImage.src).pathname;

    if (secondaryPath === newPrimaryPath) {
      primaryImage.remove();
      secondaryImage.classList.replace("media--second", "media--first");
      return;
    }
  }

  primaryImage.animate({ opacity: [1, 0] }, { duration: 200, easing: "ease-in", fill: "forwards" });

  setTimeout(() => {
    primaryImage.replaceWith(newPrimaryImage);
    newPrimaryImage.animate({ opacity: [0, 1] }, { duration: 200, easing: "ease-in" });
    secondaryImage?.remove();
  }, 200);
}

function initSwatchSwipers() {
  if (typeof Swiper === 'undefined') return;
  document.querySelectorAll('.product-recommendations .product-recommendations__product, .collection-product-card').forEach(function(card) {
    card.querySelectorAll('.js-color-swatches[data-option-name="color"]').forEach(function(wrap) {
      const container = wrap.classList.contains('swiper') ? wrap : wrap.querySelector('.swiper, .swiper-container');
      if (!container || container.swiper) return;
      new Swiper(container, { slidesPerView: 'auto', spaceBetween: 0, nested: true, observeParents: true });
    });
  });
}

function colorSwatches() {
  checkSwatches();
  initSwatchSwipers();
  document.addEventListener('shopify:section:load', function() {
    checkSwatches();
    initSwatchSwipers();
  });
}

document.addEventListener('DOMContentLoaded', colorSwatches);
