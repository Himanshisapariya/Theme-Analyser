(function () {
	document.addEventListener("shopify:section:load", function () {
		const slider = new Swiper(".js-media-list", getSliderSettings);
		const subSlider = new Swiper(
			".js-media-sublist",
			getSubSliderProductSettings
		);
		setTimeout(function () {
			slider.update();
			subSlider.update();
		}, 200);
	});
})();

// Promo tag popup functionality
document.addEventListener('DOMContentLoaded', function() {
  const promoDetails = {
    '2+ for 50% off': {
      title: 'BOGO 50% Off – Honest Tees',
      description: 'Buy one Honest Tee and get the second 50% off.',
      disclaimer: 'Add two to your cart to activate. Cannot be combined with other promotions.'
    },
    '2+ for 25% off': {
      title: 'Buy 2 Fleece, Get 25% Off',
      description: 'Buy any 2 fleece items and get 25% off both items.',
      disclaimer: 'Discount automatically applied at checkout. Cannot be combined with other promotions.'
    },
    'Buy 2, Get 1 Free': {
      title: 'Buy 2 Socks, Get 1 Free',
      description: 'Add any 3 pairs of socks to your cart and the third pair is free.',
      disclaimer: 'Discount automatically applied at checkout.'
    },
    '3+ for 20% off': {
      title: 'Buy 3, Get 20% Off',
      description: 'Buy any 3 graphic tees and/or hats and receive 20% off your qualifying items.',
      disclaimer: 'Discount automatically applied at checkout. Cannot be combined with other offers.'
    },
    '2+ Truth Fits For 50% off' : {
      title: 'BOGO 50% Off – Truth Fits Tank',
      description: 'Buy one Truth Fits Tank and get the second 50% off.',
      disclaimer: 'Add two to your cart to activate.'
    }
  };

  let isMobile = window.innerWidth <= 767;
  let activePopup = null;

  function initPromoPopups() {
    document.querySelectorAll('.promo-tag-container').forEach(container => {
      const promoType = container.dataset.promoType;
      const popupContent = container.querySelector('.popup-content');
      const popup = container.querySelector('.promo-popup');
      
      if (promoType && promoDetails[promoType] && popupContent) {
        const details = promoDetails[promoType];
        popupContent.innerHTML = `
          <h4>${details.title}</h4>
          <p>${details.description}</p>
          <p>${details.disclaimer}</p>
        `;
      }

      // Mobile click — toggle .is-visible class
      if (isMobile && popup && !container.hasAttribute('data-mobile-initialized')) {
        container.setAttribute('data-mobile-initialized', 'true');

        container.addEventListener('click', function(e) {
          e.stopPropagation();
          if (activePopup && activePopup !== popup) {
            activePopup.classList.remove('is-visible');
          }
          popup.classList.toggle('is-visible');
          activePopup = popup.classList.contains('is-visible') ? popup : null;
        });

        popup.addEventListener('click', function(e) { e.stopPropagation(); });
      }
    });
  }

  // Close mobile popup on outside click
  if (isMobile) {
    document.addEventListener('click', function(e) {
      if (activePopup && !activePopup.closest('.promo-tag-container').contains(e.target)) {
        activePopup.classList.remove('is-visible');
        activePopup = null;
      }
    });
  }

  // Escape dismisses tooltip without moving focus (WCAG 1.4.13)
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return;
    const icon = document.activeElement;
    if (icon && icon.classList.contains('promo-info-icon')) {
      icon.classList.add('tooltip-esc-dismissed');
    }
  });

  // Reset dismissed state when focus leaves the icon
  document.addEventListener('focusout', function(e) {
    if (e.target.classList.contains('promo-info-icon')) {
      e.target.classList.remove('tooltip-esc-dismissed');
    }
  });

  initPromoPopups();
  document.addEventListener('shopify:section:load', initPromoPopups);
  
  // Also initialize when quickview content is loaded
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes) {
        for (let node of mutation.addedNodes) {
          if (node.nodeType === 1 && (node.querySelector('.promo-tag-container') || node.classList?.contains('promo-tag-container'))) {
            initPromoPopups();
            break;
          }
        }
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

//button-with-underline
if (window.screen.width > 990) {
	let attachedCompare = false;

	let mainProductSection = document.querySelector(".perfect-fit-description .button--with-underline--container");


	const followMouseMainProduct = (event) => {
		if (imageContainerMainProduct) {
			imageContainerMainProduct.style.left = event.pageX + "px";
			imageContainerMainProduct.style.top = event.pageY + 30 + "px";
		}
	};

	function showTextMainProduct() {
		if (!attachedCompare && imageContainerMainProduct) {
			attachedCompare = true;
			imageContainerMainProduct.style.display = "block";
			document.addEventListener("pointermove", followMouseMainProduct);
		}
	}

	function hideTextMainProduct() {
		if (imageContainerMainProduct) {
			attachedCompare = false;
			imageContainerMainProduct.style.display = "";
			document.removeEventListener("pointermove", followMouseMainProduct);
		}
	}
}
