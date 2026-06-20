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

      if (isMobile && popup && !container.hasAttribute('data-mobile-initialized')) {
        container.setAttribute('data-mobile-initialized', 'true');
        
        container.addEventListener('click', function(e) {
          e.stopPropagation();
          
          if (activePopup && activePopup !== popup) {
            activePopup.style.opacity = '0';
            activePopup.style.visibility = 'hidden';
          }
          
          const isOpen = popup.style.visibility === 'visible';
          popup.style.opacity = isOpen ? '0' : '1';
          popup.style.visibility = isOpen ? 'hidden' : 'visible';
          activePopup = isOpen ? null : popup;
        });

        popup.addEventListener('click', function(e) {
          e.stopPropagation();
        });
      }
    });
  }

  if (isMobile) {
    document.addEventListener('click', function(e) {
      if (activePopup && !activePopup.contains(e.target)) {
        activePopup.style.opacity = '0';
        activePopup.style.visibility = 'hidden';
        activePopup = null;
      }
    });
  }

  initPromoPopups();
  document.addEventListener('shopify:section:load', initPromoPopups);
  
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
