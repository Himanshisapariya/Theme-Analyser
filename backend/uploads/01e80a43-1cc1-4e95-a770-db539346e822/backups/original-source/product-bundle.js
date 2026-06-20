(function () {
  'use strict';

  function init(sectionId, data) {
    var section = document.getElementById('ProductBundle-' + sectionId);
    if (!section) return;

    var thumbs = document.getElementById('pbThumbs-' + sectionId);
    var main   = document.getElementById('pbMain-' + sectionId);
    var pager  = document.getElementById('pbPagination-' + sectionId);
    if (!main) return;

    var products = data.products;
    var selected = {};
    Object.keys(products).forEach(function (pid) {
      selected[pid] = Object.assign({}, products[pid].selectedOptions);
    });

    function activateSlide(idx) {
      main.querySelectorAll('.pb-main-img__slide').forEach(function (s) { s.classList.remove('is-active'); });
      if (thumbs) thumbs.querySelectorAll('.pb-thumb').forEach(function (t) { t.classList.remove('is-active'); });
      if (pager)  pager.querySelectorAll('.pb-pagination__dot').forEach(function (d) { d.classList.remove('is-active'); });
      var slide = main.querySelector('[data-slide="' + idx + '"]');
      if (slide) slide.classList.add('is-active');
      if (thumbs) { var t = thumbs.querySelector('[data-slide="' + idx + '"]'); if (t) t.classList.add('is-active'); }
      if (pager)  { var d = pager.querySelector('[data-slide="' + idx + '"]');  if (d) d.classList.add('is-active'); }
    }

    if (thumbs) {
      thumbs.addEventListener('click', function (e) {
        var btn = e.target.closest('.pb-thumb');
        if (btn) activateSlide(btn.dataset.slide);
      });
    }

    if (pager && window.IntersectionObserver) {
      var slides = main.querySelectorAll('.pb-main-img__slide');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            var idx = entry.target.dataset.slide;
            pager.querySelectorAll('.pb-pagination__dot').forEach(function (d) { d.classList.remove('is-active'); });
            var dot = pager.querySelector('[data-slide="' + idx + '"]');
            if (dot) dot.classList.add('is-active');
          }
        });
      }, { root: main, threshold: 0.5 });
      slides.forEach(function (s) { io.observe(s); });

      pager.addEventListener('click', function (e) {
        var dot = e.target.closest('.pb-pagination__dot');
        if (!dot) return;
        var slide = main.querySelector('[data-slide="' + dot.dataset.slide + '"]');
        if (slide) slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      });
    }

    function resolveVariant(pid) {
      var variants = products[pid] && products[pid].variants;
      if (!variants) return null;
      var opts = selected[pid] || {};
      var vals = Object.keys(opts).sort().map(function (k) { return opts[k]; });
      return variants.find(function (v) {
        return vals.every(function (val, i) { return v['option' + (i + 1)] === val; });
      }) || null;
    }

    function fmt(cents) { return '$' + (cents / 100).toFixed(2); }

    function updateTotal() {
      var els = section.querySelectorAll('[data-total-price]');
      if (!els.length) return;
      var total = 0;
      section.querySelectorAll('.pb-resolved-variant').forEach(function (inp) {
        var v = resolveVariant(inp.dataset.product);
        if (v) total += v.price;
      });
      var text = total > 0 ? fmt(total) : '';
      els.forEach(function (el) { el.textContent = text; });
    }

    function updateVariantInput(pid) {
      var v = resolveVariant(pid);
      var inp = section.querySelector('.pb-resolved-variant[data-product="' + pid + '"]');
      if (inp) inp.value = v ? v.id : '';
      var priceEl = section.querySelector('[data-product-price="' + pid + '"]');
      if (priceEl && v) priceEl.textContent = fmt(v.price);
      updateTotal();
    }

    function updateSoldOutStates(pid) {
      var variants = products[pid] && products[pid].variants;
      if (!variants) return;
      var productEl = section.querySelector('.pb-product[data-product-id="' + pid + '"]');
      if (!productEl) return;
      var sizeWrap = productEl.querySelector('.pb-option--size .pb-sizes');
      if (!sizeWrap) return;

      var activeBecameSoldOut = false;
      sizeWrap.querySelectorAll('.pb-size-pill').forEach(function (pill) {
        var optIdx = parseInt(pill.dataset.optionIndex, 10);
        var sizeVal = pill.dataset.optionValue;
        var candidate = Object.assign({}, selected[pid]);
        candidate[optIdx] = sizeVal;
        var vals = Object.keys(candidate).sort(function (a, b) { return a - b; }).map(function (k) { return candidate[k]; });
        var variant = variants.find(function (v) {
          return vals.every(function (val, i) { return v['option' + (i + 1)] === val; });
        });
        var soldOut = !variant || !variant.available;
        pill.disabled = soldOut;
        pill.classList.toggle('is-soldout', soldOut);
        if (soldOut && pill.classList.contains('is-active')) {
          pill.classList.remove('is-active');
          activeBecameSoldOut = true;
        }
      });

      if (activeBecameSoldOut) {
        var inp = section.querySelector('.pb-resolved-variant[data-product="' + pid + '"]');
        if (inp) inp.value = '';
        updateTotal();
      }
    }

    function updateImages(pid) {
      var v = resolveVariant(pid);
      if (!v || !v.featured_image) return;
      var base = v.featured_image.src.split('?')[0];
      var ext  = base.match(/(\.[^.]+)$/)[1];
      var stem = base.slice(0, base.length - ext.length);
      function sized(w) { return stem + '_' + w + 'x' + ext; }

      var slide = main.querySelector('.pb-main-img__slide[data-product-id="' + pid + '"]');
      if (slide) {
        var img = slide.querySelector('img');
        if (img) { img.src = sized(600); img.srcset = sized(300) + ' 300w, ' + sized(600) + ' 600w'; }
      }
      if (thumbs) {
        var thumb = thumbs.querySelector('.pb-thumb[data-product-id="' + pid + '"]');
        if (thumb) {
          var ti = thumb.querySelector('img');
          if (ti) { ti.src = sized(160); ti.srcset = sized(80) + ' 80w, ' + sized(160) + ' 160w'; }
        }
      }
      var rowImg = section.querySelector('.pb-product[data-product-id="' + pid + '"] .pb-product__image img');
      if (rowImg) { rowImg.src = sized(300); rowImg.srcset = sized(200) + ' 200w, ' + sized(300) + ' 300w, ' + sized(400) + ' 400w'; }
    }

    section.addEventListener('change', function (e) {
      var swatchInput = e.target.closest('.pb-swatches-wrap input[type="radio"]');
      if (swatchInput) {
        var row = swatchInput.closest('.pb-product');
        if (!row) return;
        var pid = row.dataset.productId;
        var optNameEl = swatchInput.closest('[data-option-name]');
        var optName = optNameEl ? optNameEl.dataset.optionName : null;
        var opts = products[pid] && products[pid].options;
        if (opts && optName) {
          for (var i = 0; i < opts.length; i++) {
            if (opts[i].name === optName) {
              selected[pid] = selected[pid] || {};
              selected[pid][opts[i].index] = swatchInput.value;
              var lbl = section.querySelector('[data-color-label="' + pid + '"]');
              if (lbl) lbl.textContent = swatchInput.value;
              break;
            }
          }
        }
        updateVariantInput(pid);
        updateImages(pid);
        updateSoldOutStates(pid);
        return;
      }

      var sel = e.target.closest('.pb-select:not(.pb-qty-select)');
      if (!sel) return;
      var spid = sel.dataset.product;
      selected[spid] = selected[spid] || {};
      selected[spid][sel.dataset.optionIndex] = sel.value;
      updateVariantInput(spid);
      updateSoldOutStates(spid);
    });

    section.addEventListener('click', function (e) {
      var pill = e.target.closest('.pb-size-pill');
      if (!pill || pill.disabled) return;
      var pid = pill.dataset.product;
      pill.closest('.pb-sizes').querySelectorAll('.pb-size-pill').forEach(function (p) { p.classList.remove('is-active'); });
      pill.classList.add('is-active');
      selected[pid] = selected[pid] || {};
      selected[pid][pill.dataset.optionIndex] = pill.dataset.optionValue;
      updateVariantInput(pid);
    });

    Object.keys(products).forEach(function (pid) { updateSoldOutStates(pid); });
    updateTotal();

    var atcBtn = document.getElementById('pbAtc-' + sectionId);
    if (!atcBtn) return;
    var lblEl = atcBtn.querySelector('.pb-atc-btn__label');
    var spinEl = atcBtn.querySelector('.pb-atc-btn__spinner');
    if (lblEl) lblEl.dataset.default = lblEl.textContent;

    function setLabel(text) {
      if (lblEl) lblEl.textContent = text || lblEl.dataset.default || 'Add Bundle to Cart';
    }

    atcBtn.addEventListener('click', function () {
      var items = [];
      section.querySelectorAll('.pb-product').forEach(function (row) {
        var inp = row.querySelector('.pb-resolved-variant');
        var qty = row.querySelector('.pb-qty-select');
        var vid = inp ? parseInt(inp.value, 10) : null;
        var q   = qty ? parseInt(qty.value, 10) : 1;
        if (vid && !isNaN(vid)) items.push({ id: vid, quantity: q });
      });

      if (!items.length) { setLabel('Select Options First'); setTimeout(setLabel, 2200); return; }

      var hasSoldOut = false;
      section.querySelectorAll('.pb-resolved-variant').forEach(function (inp) {
        var v = resolveVariant(inp.dataset.product);
        if (v && !v.available) hasSoldOut = true;
      });
      if (hasSoldOut) { setLabel('Item Sold Out'); setTimeout(setLabel, 2200); return; }

      atcBtn.disabled = true;
      setLabel('Adding…');
      spinEl.classList.remove('hidden');

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify({ items: items })
      })
        .then(function (r) { if (!r.ok) return r.text().then(function (t) { throw new Error(t); }); return r.json(); })
        .then(function () {
          setLabel('Added!');
          spinEl.classList.add('hidden');
          var drawer = document.querySelector('cart-drawer');
          if (drawer) {
            var sectionIds = drawer.getSectionsToRender().map(function (s) { return s.id; }).join(',');
            fetch('/?sections=' + sectionIds)
              .then(function (r) { return r.json(); })
              .then(function (sections) { drawer.renderContents({ sections: sections }); });
          }
          publish(PUB_SUB_EVENTS.cartUpdate, { source: 'product-bundle' });
          if (window.location.pathname === '/cart') setTimeout(function () { location.reload(); }, 1000);
          setTimeout(function () { setLabel(); atcBtn.disabled = false; }, 2200);
        })
        .catch(function (err) {
          console.error('[Bundle ATC]', err);
          setLabel('Error — Try Again');
          spinEl.classList.add('hidden');
          setTimeout(function () { setLabel(); atcBtn.disabled = false; }, 2200);
        });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.PBData) return;
    Object.keys(window.PBData).forEach(function (sectionId) {
      init(sectionId, window.PBData[sectionId]);
    });
  });
})();
