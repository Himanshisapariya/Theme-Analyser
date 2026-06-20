document.addEventListener('DOMContentLoaded', () => {
  // Move afterpay block below estimated total row
  const afterpay = document.querySelector('.afterpay-block');
  const totalRow = document.querySelector('.summary-total');
  if (afterpay && totalRow) totalRow.after(afterpay);

  // Open second accordion by default
  const accordions = document.querySelectorAll('.cart-help-accordion');
  if (accordions.length > 1) accordions[1].classList.add('is-open');

  // ----- element refs -----
  const giftCheckbox = document.getElementById('giftCheckbox');
  const giftBox      = document.getElementById('giftMessageContainer');
  const giftInput    = document.getElementById('giftMessage');
  const errorEl      = document.getElementById('discount-code-error');
  const errorText    = errorEl?.querySelector('.discount-alert__text');
  const errorClose   = errorEl?.querySelector('.discount-alert__close');
  const form         = document.getElementById('cart-discount-form');
  const input        = document.getElementById('discount-code-input');
  const removeBtn    = document.getElementById('remove-discount');

  const money = (cents) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: Shopify.currency.active }).format(cents / 100);

  // ----- gift message -----
  let giftDebounce;
  giftInput?.addEventListener('input', (e) => {
    clearTimeout(giftDebounce);
    giftDebounce = setTimeout(() => updateCartNote(e.target.value), 300);
  });

  giftCheckbox?.addEventListener('change', () => {
    giftBox.style.display = giftCheckbox.checked ? 'block' : 'none';
    if (!giftCheckbox.checked) updateCartNote('');
  });

  const updateCartNote = (note) =>
    fetch(`${Shopify.routes.root}cart/update.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    });

  // ----- cart helpers -----
  const fetchCart = async () => {
    const res = await fetch(`${Shopify.routes.root}cart.js`);
    if (!res.ok) throw new Error('Cart fetch failed');
    return res.json();
  };

  const applyDiscount = async (code) => {
    const res = await fetch(`${Shopify.routes.root}cart/update.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discount: code }),
    });
    if (res.ok) return res.json();
    return fetchCart();
  };

  const updateCartDisplay = (cart) => {
    const _subtotalEl   = document.getElementById('cart-subtotal-value');
    const _totalEl      = document.querySelector('.summary-total span:last-child');
    const _discountRow  = document.getElementById('cart-discounts-wrapper');
    const _appliedBox   = document.getElementById('applied-discount-wrapper');
    const _appliedText  = document.getElementById('applied-discount-code');
    const _autoWrapper  = document.getElementById('automatic-discounts-wrapper');
    const _autoTitle    = document.getElementById('automatic-discount-title');
    const _autoAmountEl = document.getElementById('automatic-discount-amount');

    if (_subtotalEl) _subtotalEl.textContent = money(cart.original_total_price);
    if (_totalEl) _totalEl.textContent = money(cart.total_price);

    const discountCode = cart.discount_codes?.[0];
    let codeDiscountAmount = 0;
    if (discountCode) {
      const orderLevel = (cart.cart_level_discount_applications || []).find(
        (d) => d.title?.toLowerCase() === discountCode.code.toLowerCase()
      );
      if (orderLevel) {
        codeDiscountAmount = orderLevel.total_allocated_amount;
      } else {
        cart.items.forEach((item) =>
          item.discounts?.forEach((d) => {
            if (d.title.toLowerCase() === discountCode.code.toLowerCase()) codeDiscountAmount += d.amount;
          })
        );
      }
    }

    if (_discountRow && _appliedBox && _appliedText) {
      if (codeDiscountAmount > 0) {
        _discountRow.style.display = 'flex';
        _discountRow.querySelector('#discount-title').textContent = discountCode.code;
        _discountRow.querySelector('#discount-amount').textContent = '-' + money(codeDiscountAmount);
        _appliedText.textContent = discountCode.code;
        _appliedBox.style.display = 'flex';
      } else {
        _discountRow.style.display = 'none';
        _appliedBox.style.display = 'none';
      }
    }

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
    // Fallback: use discount_applications for automatic/script discounts not in item.discounts
    if (autoDiscountAmount === 0) {
      (cart.discount_applications || []).forEach((d) => {
        if (d.type !== 'automatic' && d.type !== 'script') return;
        const title = d.title || '';
        if (!discountCode || title.toLowerCase() !== discountCode.code.toLowerCase()) {
          if (!autoDiscountTitles.has(title)) {
            autoDiscountTitles.add(title);
            autoDiscountAmount += d.total_allocated_amount || 0;
          }
        }
      });
    }

    if (_autoWrapper && _autoTitle && _autoAmountEl && autoDiscountTitles.size > 0 && autoDiscountAmount > 0) {
      _autoWrapper.style.display = 'flex';
      _autoTitle.textContent = Array.from(autoDiscountTitles).join(', ');
      _autoAmountEl.textContent = '-' + money(autoDiscountAmount);
    } else if (_autoWrapper) {
      _autoWrapper.style.display = 'none';
    }

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
          const titleEl = lineItem.querySelector('.cart-item__name, .cart-item__details span, span');
          if (titleEl) titleEl.insertAdjacentElement('afterend', discountBadge);
        }
        discountBadge.textContent = `${item.discounts[0].title} Applied`;
        discountBadge.style.display = 'inline-block';
      } else if (discountBadge) {
        discountBadge.style.display = 'none';
      }
    });
  };

  let gwpFired = false;
  document.addEventListener('gwp:cart-updated', (e) => {
    gwpFired = true;
    updateCartDisplay(e.detail.cart);
  });
  fetchCart().then(cart => { if (!gwpFired) updateCartDisplay(cart); }).catch(err => console.error('[cart-page] init error:', err));

  // ----- discount form -----
  const submitBtn = form?.querySelector('button[type="submit"]');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = input.value.trim();
    if (!code) return;

    errorEl.hidden = true;
    errorText.textContent = '';
    input.value = '';

    submitBtn?.classList.add('is-loading');
    if (submitBtn) submitBtn.disabled = true;

    try {
      const cart = await applyDiscount(code);
      const codeApplied =
        cart.cart_level_discount_applications.some((d) => d.title?.toLowerCase() === code.toLowerCase()) ||
        cart.items.some((i) => i.discounts?.some((d) => d.title?.toLowerCase() === code.toLowerCase()));

      if (!codeApplied) {
        errorText.textContent = `${code} is invalid or cannot be combined with existing discounts.`;
        errorEl.hidden = false;
      }
      updateCartDisplay(cart);
    } catch (err) {
      console.error(err);
      errorText.textContent = 'An error occurred. Please try again.';
      errorEl.hidden = false;
    } finally {
      submitBtn?.classList.remove('is-loading');
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  removeBtn?.addEventListener('click', async () => {
    try {
      const cart = await applyDiscount('');
      updateCartDisplay(cart);
    } catch (err) {
      console.error(err);
    }
  });

  errorClose?.addEventListener('click', () => {
    errorEl.hidden = true;
    errorText.textContent = '';
  });

  const donationWrapper  = document.getElementById('donation-checkbox-row');
  if (donationWrapper) {
    const donationCheckbox = document.getElementById('donationCheckbox');
    const donationInfoIcon = document.getElementById('donationInfoIcon');
    const donationTooltip  = document.getElementById('donationTooltip');
    const variantId        = donationCheckbox?.dataset.variantId;

    let tooltipVisible = false;
    donationInfoIcon?.addEventListener('click', (e) => {
      e.stopPropagation();
      tooltipVisible = !tooltipVisible;
      donationTooltip.style.display = tooltipVisible ? 'block' : 'none';
      if (tooltipVisible) {
        setTimeout(() => document.addEventListener('click', outsideClick), 0);
      }
    });
    donationTooltip?.addEventListener('click', (e) => e.stopPropagation());

    function outsideClick(e) {
      if (!donationInfoIcon.contains(e.target) && !donationTooltip.contains(e.target)) {
        tooltipVisible = false;
        donationTooltip.style.display = 'none';
        document.removeEventListener('click', outsideClick);
      }
    }

    donationCheckbox?.addEventListener('change', async () => {
      if (!donationCheckbox.checked) return;
      donationCheckbox.disabled = true;
      try {
        await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: parseInt(variantId, 10), quantity: 1 }),
        });
        donationWrapper.style.display = 'none';
        document.dispatchEvent(new CustomEvent('cart:refresh'));
        const updatedCart = await fetchCart();
        updateCartDisplay(updatedCart);
      } catch (err) {
        console.error('Could not add donation:', err);
        donationCheckbox.checked  = false;
        donationCheckbox.disabled = false;
      }
    });
  }
});

document.addEventListener('click', (e) => {
  const header = e.target.closest('.cart-help-accordion__header');
  if (!header) return;
  header.parentElement.classList.toggle('is-open');
});
