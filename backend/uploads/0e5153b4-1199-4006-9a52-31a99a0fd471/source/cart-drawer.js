addEventListener('PledgeDonationChanged', (e) => {
  $.ajax({
    url: '/?section_id=cart-drawer',
    type: 'GET',
    dataType: 'html',
    success: (cart_html) => {
      $('cart-drawer').html($(cart_html).find('cart-drawer').html());
      $('.cart-item__name').each(function() {
        var itemId = $(this).data('item-id');
        console.log(itemId);
        if (itemId === 8075999543427){
          $(".main_gift_box").hide();
        }
      });
    }
  });
});
$(document).ready(function () {    
  function cartUpsell() {
        $('.card_relatedslide_block .swiper-slide, .main_gift_box').each(function() {
            var upsellId = $(this).attr('data-upsell-id');
            var itemId = $('.cart-item__name').attr('data-item-id');
            var giftId = $('.main_gift_box').attr('data-gift-id');
            if (upsellId === itemId) {
                $(this).hide();
            }
            if (itemId === '8493242286211'){
              $(".ctm_yml_head").hide();
            }
        });
    }
function cartGift() {
$('.main_gift_box').each(function() {
        var giftId = $(this).attr('data-gift-id');
        $('.cart-item__name').each(function() {
          var itemId = $(this).data('item-id');
          console.log(itemId);
          if (itemId === '8075999543427'){
            $(".main_gift_box").hide();

          }
        });
        const _this = $(this);
        const isRemoved = Boolean(window.localStorage.getItem("gift_card_removed"))
        if(isRemoved){
            _this.remove();
            return; 
        }
        let itemInCart = false;
        $('.cart-item__name').each(function() {
            var itemId = $(this).attr('data-item-id');
            if (itemId === giftId) {
                itemInCart = true;
                _this.remove();
                window.localStorage.setItem('gift_card_removed', true)
            }
        });
    });
}
  window.localStorage.removeItem('gift_card_removed');

    cartUpsell();
    cartGift();
                               
    subscribe(PUB_SUB_EVENTS.cartUpdate, function() {
       setTimeout(() => {
    cartUpsell();
    cartGift();
    }, 100);
    });
});

class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  } 

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.open(cartLink)
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.open(cartLink);
      }
    });
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
    setTimeout(() => {this.classList.add('animate', 'active')});

    this.addEventListener('transitionend', () => {
      const containerToTrapFocusOn = this.classList.contains('is-empty') ? this.querySelector('.drawer__inner-empty') : document.getElementById('CartDrawer');
      const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
      trapFocus(containerToTrapFocusOn, focusElement);
    }, { once: true });

    $(document).on('click', '.upsell_close', function() {
        setTimeout(function() {
            $('.ctm_cart, .main_gift_box').hide();
        }, 100); // A 100ms delay to ensure rendering completes before hiding
    });
  }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if(cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    this.querySelector('.drawer__inner').classList.contains('is-empty') && this.querySelector('.drawer__inner').classList.remove('is-empty');
    this.productId = parsedState.id;
    this.getSectionsToRender().forEach((section => {
      const sectionElement = section.selector ? document.querySelector(section.selector) : document.getElementById(section.id);
      sectionElement.innerHTML =
          this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
    }));

    setTimeout(() => {
      this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
      this.open();
    });
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer'
      },
      {
        id: 'cart-icon-bubble'
      }
    ];
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.drawer__inner'
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      }
    ];
  }
}

customElements.define('cart-drawer-items', CartDrawerItems);


