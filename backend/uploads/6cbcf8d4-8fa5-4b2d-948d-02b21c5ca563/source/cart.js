class CartRemoveButton extends HTMLElement {
	constructor() {
		super();

		this.addEventListener("click", (event) => {
			event.preventDefault();
			
			// Show loader on this specific remove button
			const loader = this.querySelector('.remove-loader');
			const text = this.querySelector('.remove-text');
			if (loader) {
				loader.classList.remove('hidden');
			}
			if (text) {
				text.style.opacity = '0';
			}
			
			const cartItems =
				this.closest("cart-items") || this.closest("cart-drawer-items");
			cartItems.updateQuantity(this.dataset.index, 0);
		});
	}
}

customElements.define("cart-remove-button", CartRemoveButton);

class CartItems extends HTMLElement {
	constructor() {
		super();
		this.lineItemStatusElement =
			document.getElementById("shopping-cart-line-item-status") ||
			document.getElementById("CartDrawer-LineItemStatus");

		const debouncedOnChange = debounce((event) => {
			this.onChange(event);
		}, ON_CHANGE_DEBOUNCE_TIMER);

		this.addEventListener("change", debouncedOnChange.bind(this));
		
		// Add click handlers for quantity buttons
		this.addEventListener("click", (event) => {
			if (event.defaultPrevented) return;
			if (event.target.closest(".quantity__button")) {
				this.handleQuantityButtonClick(event);
			}
		});
		
		// Listen for custom cart refresh events (from GWP, etc.) — debounced to collapse bursts
		const debouncedCartRefresh = debounce(() => this.onCartUpdate(), 300);
		document.addEventListener('cart:refresh', debouncedCartRefresh);
	}

	cartUpdateUnsubscriber = undefined;

	connectedCallback() {
		this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
			if (event.source === "cart-items") {
				return;
			}
			if (event.source === "cart-api") {
				return;
			}
			this.onCartUpdate();
		});
	}

	disconnectedCallback() {
		if (this.cartUpdateUnsubscriber) {
			this.cartUpdateUnsubscriber();
		}
	}

	onChange(event) {
		this.updateQuantity(
			event.target.dataset.index,
			event.target.value,
			document.activeElement.getAttribute("name")
		);
	}

	handleQuantityButtonClick(event) {
		const button = event.target.closest(".quantity__button");
		const input = button.parentElement.querySelector(".quantity__input");
		const currentIndex = parseInt(input.dataset.index);
		let currentValue = parseInt(input.value);
		
		// Show loader on the clicked button (optimized)
		this.showQuantityButtonLoader(button);
		
		if (button.name === "minus") {
			currentValue = Math.max(0, currentValue - 1);
		} else if (button.name === "plus") {
			currentValue = currentValue + 1;
		}
		
		this.updateQuantity(currentIndex, currentValue, input.name);
	}

	showQuantityButtonLoader(button) {
		// Check if loader already exists to avoid DOM creation
		let loader = button.querySelector('.quantity-loader');
		if (!loader) {
			loader = document.createElement('div');
			loader.className = 'quantity-loader';
			loader.innerHTML = '<div class="spinner"></div>';
			loader.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: none;';
			button.appendChild(loader);
		}
		
		// Hide original icon and show loader (using CSS for performance)
		const icon = button.querySelector('svg');
		if (icon) {
			icon.style.opacity = '0';
		}
		loader.style.display = 'flex';
	}

	hideQuantityButtonLoader(line) {
		const cartItem = document.getElementById(`CartItem-${line}`);
		if (cartItem) {
			const buttons = cartItem.querySelectorAll('.quantity__button');
			// Use forEach with early exit for better performance
			for (let i = 0; i < buttons.length; i++) {
				const button = buttons[i];
				const loader = button.querySelector('.quantity-loader');
				const icon = button.querySelector('svg');
				if (loader) {
					loader.style.display = 'none';
				}
				if (icon) {
					icon.style.opacity = '1';
				}
			}
		}
	}

	onCartUpdate() {
		
		fetch(`${routes.cart_url}?section_id=main-cart-items`)
			.then((response) => response.text())
			.then((responseText) => {
				const html = new DOMParser().parseFromString(responseText, "text/html");
				const sourceQty = html.querySelector("cart-items");
					this.innerHTML = sourceQty.innerHTML;
			})
			.then(() => {
				// After updating cart items, the subtotal display will be updated by renderCartSections
			})
			.catch((e) => {
				console.error(e);
			})
			.finally(() => {
			});
	}

	getSectionsToRender() {
		return [
			{
				id: "main-cart-items",
				section: document.getElementById("main-cart-items").dataset.id,
				selector: ".js-contents",
			},
			{
				id: "cart-icon-bubble",
				section: "cart-icon-bubble",
				selector: ".shopify-section",
			},
			{
				id: "cart-live-region-text",
				section: "cart-live-region-text",
				selector: ".shopify-section",
			}
		];
	}

	updateQuantity(line, quantity, name) {
  this.enableLoading(line);

  fetch(routes.cart_change_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ line, quantity }),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(cart => {
      this.renderCartSections(cart);
      // Publish cart update event for other components
      publish(PUB_SUB_EVENTS.cartUpdate, { source: 'cart-items', cart: cart });
    })
    .catch(error => {
      console.error('Cart update error:', error);
      // Fallback to full page reload if there's an error
      window.location.reload();
    })
    .finally(() => this.disableLoading(line));
}


renderCartSections(cart) {
  const sectionsToRender = this.getSectionsToRender();
  
  const renderPromises = sectionsToRender.map(section => {
    return fetch(`${routes.cart_url}?section_id=${section.section}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Section fetch error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        const element = document.getElementById(section.id);
        if (element) {
          element.innerHTML = this.getSectionInnerHTML(html, section.selector);
        }
      })
      .catch(error => {
        console.error(`Error rendering section ${section.section}:`, error);
      });
  });

 Promise.all(renderPromises).then(() => {
    // ✅ Sync empty-state classes immediately without a page reload
    const cartItemsEl = document.querySelector('cart-items');
    const ctmMainCart = document.querySelector('.ctm-main-cart-data');

    if (cart.item_count === 0) {
      cartItemsEl?.classList.add('is-empty');
      ctmMainCart?.classList.add('cart-empty');
    } else {
      cartItemsEl?.classList.remove('is-empty');
      ctmMainCart?.classList.remove('cart-empty');
    }

    this.updateSubtotalDisplay(cart);
    initGwp(cart);
    // Sync cartData in gwp.liquid's inline script so button click uses fresh cart
    document.dispatchEvent(new CustomEvent('gwp:cart-updated', { detail: { cart } }));
  });
}

updateSubtotalDisplay(cart) {
  const money = (cents) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: Shopify.currency.active }).format(cents / 100);

  const subtotalEl = document.getElementById('cart-subtotal-value');
  const totalEl = document.querySelector('.summary-total span:last-child');
  const discountRow = document.getElementById('cart-discounts-wrapper');
  const appliedBox = document.getElementById('applied-discount-wrapper');
  const appliedText = document.getElementById('applied-discount-code');
  const autoWrapper = document.getElementById('automatic-discounts-wrapper');
  const autoTitle = document.getElementById('automatic-discount-title');
  const autoAmountEl = document.getElementById('automatic-discount-amount');

  // Update subtotal and total
  if (subtotalEl) subtotalEl.textContent = money(cart.original_total_price);
  if (totalEl) totalEl.textContent = money(cart.total_price);

  // Handle discount codes
  const discountCode = cart.discount_codes?.[0];
  let codeDiscountAmount = 0;
  if (discountCode) {
    const orderLevel = cart.cart_level_discount_applications.find(
      (d) => d.title.toLowerCase() === discountCode.code.toLowerCase()
    );
    if (orderLevel) codeDiscountAmount = orderLevel.total_allocated_amount;
    else {
      cart.items.forEach((item) =>
        item.discounts?.forEach((d) => {
          if (d.title.toLowerCase() === discountCode.code.toLowerCase()) codeDiscountAmount += d.amount;
        })
      );
    }
  }

  if (discountRow && appliedBox && appliedText) {
    if (codeDiscountAmount > 0) {
      discountRow.style.display = 'flex';
      const discountTitleEl = discountRow.querySelector('#discount-title');
      const discountAmountEl = discountRow.querySelector('#discount-amount');
      if (discountTitleEl) discountTitleEl.textContent = discountCode.code;
      if (discountAmountEl) discountAmountEl.textContent = '-' + money(codeDiscountAmount);
      appliedText.textContent = discountCode.code;
      appliedBox.style.display = 'flex';
    } else {
      discountRow.style.display = 'none';
      appliedBox.style.display = 'none';
    }
  }

  // Handle automatic discounts
  let autoDiscountAmount = 0;
  const autoDiscountTitles = new Set();
  cart.items.forEach((item) => {
    item.discounts?.forEach((d) => {
      if (!discountCode || d.title.toLowerCase() !== discountCode.code.toLowerCase()) {
        autoDiscountTitles.add(d.title);
        autoDiscountAmount += d.amount;
      }
    });
  });

  if (autoWrapper && autoTitle && autoAmountEl && autoDiscountTitles.size > 0 && autoDiscountAmount > 0) {
    autoWrapper.style.display = 'flex';
    autoTitle.textContent = Array.from(autoDiscountTitles).join(', ');
    autoAmountEl.textContent = '-' + money(autoDiscountAmount);
  } else if (autoWrapper) {
    autoWrapper.style.display = 'none';
  }

  // Update line item prices
  cart.items.forEach((item, index) => {
    const lineItem = document.querySelector(`[data-index="${index + 1}"]`);
    if (!lineItem) return;
    const priceEl = lineItem.querySelector('.cart-item__price, .cart-item__totals .price');
    if (priceEl) priceEl.textContent = money(item.final_line_price);

    let discountBadge = lineItem.querySelector('.cart-item__discount-badge');
    if (item.discounts?.length > 0) {
      if (!discountBadge) {
        discountBadge = document.createElement('span');
        discountBadge.className = 'cart-item__discount-badge';
        const titleEl = lineItem.querySelector('.cart-item__name, .cart-item__details h3, h3');
        if (titleEl) titleEl.insertAdjacentElement('afterend', discountBadge);
      }
      discountBadge.textContent = `${item.discounts[0].title} Applied`;
      discountBadge.style.display = 'inline-block';
    } else if (discountBadge) discountBadge.style.display = 'none';
  });
}

updateLiveRegions(line, message) {
		const lineItemError =
			document.getElementById(`Line-item-error-${line}`) ||
			document.getElementById(`CartDrawer-LineItemError-${line}`);
		if (lineItemError)
			lineItemError.querySelector(".cart-item__error-text").innerHTML = message;

		this.lineItemStatusElement.setAttribute("aria-hidden", true);

		const cartStatus =
			document.getElementById("cart-live-region-text") ||
			document.getElementById("CartDrawer-LiveRegionText");
		cartStatus.setAttribute("aria-hidden", false);

		setTimeout(() => {
			cartStatus.setAttribute("aria-hidden", true);
		}, 1000);
	}

	getSectionInnerHTML(html, selector) {
		return new DOMParser()
			.parseFromString(html, "text/html")
			.querySelector(selector).innerHTML;
	}

	enableLoading(line) {
		const mainCartItems =
			document.getElementById("main-cart-items") ||
			document.getElementById("CartDrawer-CartItems");
		mainCartItems.classList.add("cart__items--disabled");

		const cartItemElements = this.querySelectorAll(
			`#CartItem-${line} .loading-overlay`
		);
		const cartDrawerItemElements = this.querySelectorAll(
			`#CartDrawer-Item-${line} .loading-overlay`
		);

		[...cartItemElements, ...cartDrawerItemElements].forEach((overlay) =>
			overlay.classList.remove("hidden")
		);

		// Disable checkout button during loading
		document.querySelectorAll(".cart__checkout-button").forEach((btn) => {
			btn.disabled = true;
		});

		document.activeElement.blur();
		this.lineItemStatusElement.setAttribute("aria-hidden", false);
	}

	disableLoading(line) {
		const mainCartItems =
			document.getElementById("main-cart-items") ||
			document.getElementById("CartDrawer-CartItems");
		mainCartItems.classList.remove("cart__items--disabled");

		const cartItemElements = this.querySelectorAll(
			`#CartItem-${line} .loading-overlay`
		);
		const cartDrawerItemElements = this.querySelectorAll(
			`#CartDrawer-Item-${line} .loading-overlay`
		);

		cartItemElements.forEach((overlay) => overlay.classList.add("hidden"));
		cartDrawerItemElements.forEach((overlay) =>
			overlay.classList.add("hidden")
		);

		// Re-enable checkout button after loading
		document.querySelectorAll(".cart__checkout-button").forEach((btn) => {
			btn.disabled = false;
		});

		// Hide remove button loader for this specific line
		const removeButton = document.querySelector(`#CartItem-${line} cart-remove-button`);
		if (removeButton) {
			const loader = removeButton.querySelector('.remove-loader');
			const text = removeButton.querySelector('.remove-text');
			if (loader) {
				loader.classList.add('hidden');
			}
			if (text) {
				text.style.opacity = '1';
			}
		}

		// Hide quantity button loaders for this specific line
		this.hideQuantityButtonLoader(line);
	}
}

customElements.define("cart-items", CartItems);

if (!customElements.get("cart-note")) {
	customElements.define(
		"cart-note",
		class CartNote extends HTMLElement {
			constructor() {
				super();

				this.addEventListener(
					"change",
					debounce((event) => {
						const body = JSON.stringify({ note: event.target.value });
						fetch(`${routes.cart_update_url}`, {
							...fetchConfig(),
							...{ body },
						});
					}, ON_CHANGE_DEBOUNCE_TIMER)
				);
			}
		}
	);
}

// Gift with Purchase helper (keeps the free gift in sync after AJAX cart updates)
function initGwp(cartFromEvent) {
  const container = document.querySelector('[data-gwp-threshold]');
  if (!container) return;

  const statusEl = container.querySelector('[data-gwp-status]');
  const button = container.querySelector('.gwp-button');
  const variantSelect = container.querySelector('#gwp-variant-select');
  const threshold = parseInt(container.dataset.gwpThreshold, 10) || 0;

  let latestCart = cartFromEvent;
  let processing = false;

  const getSelectedVariantId = () => {
    return variantSelect ? parseInt(variantSelect.value, 10) : parseInt(container.dataset.gwpVariant, 10);
  };

  const removeGwpItems = (cart) => {
    const gwpItems = cart.items.filter((item) => item.properties && item.properties._gwp);
    if (!gwpItems.length) return Promise.resolve();

    processing = true;
    button && (button.textContent = 'Removing…');
    button && (button.disabled = true);
    const ctas = document.querySelector('.cart__ctas');
    if (ctas) { ctas.style.pointerEvents = 'none'; ctas.style.opacity = '0.4'; }

    return Promise.all(
      gwpItems.map((item) =>
        fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.key, quantity: 0 })
        })
      )
    )
      .then(() => {
        processing = false;
        if (ctas) { ctas.style.pointerEvents = ''; ctas.style.opacity = ''; }
        document.dispatchEvent(new CustomEvent('cart:refresh'));
      })
      .catch(() => {
        processing = false;
        if (ctas) { ctas.style.pointerEvents = ''; ctas.style.opacity = ''; }
      });
  };

  const updateUI = (cart) => {
    latestCart = cart;
    const subtotal = cart.total_price;
    const qualified = subtotal >= threshold;
    const hasPaidItem = cart.items.some((item) => (item.final_line_price || item.price) > 0);
    const gwpItems = cart.items.filter((item) => item.properties && item.properties._gwp);
    const hasGwp = gwpItems.length > 0;
    const selectedVariantId = getSelectedVariantId();
    const hasSelectedGift = gwpItems.some((item) => item.variant_id === selectedVariantId);

    if (!qualified || !hasPaidItem) {
      const amountLeft = threshold - subtotal;
      const amountLeftFormatted = (amountLeft / 100).toFixed(2);
      statusEl && (statusEl.innerHTML = `<span>You are only <span class="amount-left">$${amountLeftFormatted}</span> away from a free gift.</span>`);
button && (button.textContent = 'Keep Shopping');
      button && (button.disabled = false);
      variantSelect && (variantSelect.disabled = false);

      // Immediately remove any lingering GWP items when not qualified
      if (hasGwp && !processing) {
        return removeGwpItems(cart);
      }
      return;
    }

    // Qualified state — enforce max quantity of 1 for gift
    if (hasGwp && !processing) {
      const overQtyItem = gwpItems.find((item) => item.quantity > 1);
      if (overQtyItem) {
        processing = true;
        const ctas = document.querySelector('.cart__ctas');
        if (ctas) { ctas.style.pointerEvents = 'none'; ctas.style.opacity = '0.4'; }
        fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: overQtyItem.key, quantity: 1 })
        }).then(() => {
          processing = false;
          if (ctas) { ctas.style.pointerEvents = ''; ctas.style.opacity = ''; }
          document.dispatchEvent(new CustomEvent('cart:refresh'));
        }).catch(() => {
          processing = false;
          if (ctas) { ctas.style.pointerEvents = ''; ctas.style.opacity = ''; }
        });
        return;
      }
    }

    statusEl &&
      (statusEl.innerHTML = '<span class="gwp-qualified">You qualified for a free gift!</span>');

    if (button) {
      button.textContent = hasSelectedGift || hasGwp ? 'Gift Added' : 'Add to Cart';
      button.disabled = hasSelectedGift || hasGwp;
      if (variantSelect) variantSelect.disabled = hasSelectedGift || hasGwp;
    }
  };

  const ensureCart = latestCart
    ? Promise.resolve(latestCart)
    : fetch('/cart.js').then((res) => res.json());

  ensureCart.then(updateUI).catch(() => {});

  // Avoid binding twice on the same rendered block
  if (container.dataset.gwpInitialized === 'true') return;
  container.dataset.gwpInitialized = 'true';

  // Button click handling is now managed in gwp.liquid to avoid conflicts

  if (variantSelect) {
    variantSelect.addEventListener('change', () => {
      if (latestCart) updateUI(latestCart);
    });
  }
}
