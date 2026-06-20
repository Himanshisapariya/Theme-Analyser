if (!customElements.get("quick-add-modal")) {
	customElements.define(
	  "quick-add-modal",
	  class QuickAddModal extends ModalDialog {
		constructor() {
		  super();
		  this.modalContent = this.querySelector('[id^="QuickAddInfo-"]');
		}
  
		hide(preventFocus = false) {
		  const cartDrawer = document.querySelector("cart-drawer");
		  if (cartDrawer) cartDrawer.setActiveElement(this.openedBy);
		  
		  // Check if this quick view was opened from promo drawer
		  const isFromPromoDrawer = this.openedBy && this.openedBy.closest('#promo-drawer');
		  
		  this.modalContent.innerHTML = "";
		  window.pauseAllMedia();
		  if (preventFocus) this.openedBy = null;
		  super.hide();
		  
		  // Reopen promo drawer and Rebuy cart if they were closed
		  if (isFromPromoDrawer) {
			// Reopen promo drawer
			const promoDrawer = document.getElementById('promo-drawer');
			if (promoDrawer) {
			  promoDrawer.classList.add('promo-drawer--open');
			}
			
			// Reopen Rebuy cart
			if (typeof Rebuy !== 'undefined' && Rebuy.SmartCart) {
			  Rebuy.SmartCart.show();
			}
		  }
		}
  
		show(opener) {
		  // Check if quickview is called from promo drawer
		  const promoDrawer = opener.closest('#promo-drawer');
		  const isFromPromoDrawer = !!promoDrawer;
		  
		  if (isFromPromoDrawer) {
			console.log('Quickview is called from the promo drawer');
			
			// Close promo drawer
			promoDrawer.classList.remove('promo-drawer--open');
			
			// Close Rebuy cart
			if (typeof Rebuy !== 'undefined' && Rebuy.SmartCart) {
			  Rebuy.SmartCart.hide();
			}
		  }
		  
		  opener.setAttribute("aria-disabled", true);
		  opener.classList.add("loading");
  
		  if (opener.querySelector(".loading-overlay__spinner")) {
			opener
			  .querySelector(".loading-overlay__spinner")
			  .classList.remove("hidden");
		  }
  
		  fetch(opener.getAttribute("data-product-url"))
			.then((response) => response.text())
			.then((responseText) => {
			  const responseHTML = new DOMParser().parseFromString(
				responseText,
				"text/html"
			  );
			  this.productElement = responseHTML.querySelector(
				'section[id^="MainProduct-"]'
			  );
			  this.preventDuplicatedIDs();
			  this.removeDOMElements();
			  this.setInnerHTML(this.modalContent, this.productElement.innerHTML);
			  if (typeof window.handleAddLimitedEdition === 'function') {
			  	window.handleAddLimitedEdition();
			  }

           /** Code added by starapps **/
              const productInfoElement = this.querySelector(".product__info-wrapper");
              if(productInfoElement) productInfoElement.setAttribute("data-product-url", opener.getAttribute("data-product-url"))
              /** end **/
              
			  if (window.Shopify && Shopify.PaymentButton) {
				Shopify.PaymentButton.init();
			  }
  
			  if (window.ProductModel) window.ProductModel.loadShopifyXR();
  
			  this.removeGalleryListSemantic();
			  this.updateImageSizes();
			  this.preventVariantURLSwitching();
			  super.show(opener);
			  
			  window.dispatchEvent(new Event("quickview:load"));
			})
			.finally(() => {
			  opener.removeAttribute("aria-disabled");
			  opener.classList.remove("loading");
  
			  if (opener.querySelector(".loading-overlay__spinner")) {
				opener
				  .querySelector(".loading-overlay__spinner")
				  .classList.add("hidden");
			  }
  
			  var slider = new Swiper(".js-media-list", {
				slidesPerView: 1,
				navigation: {
				  nextEl: ".swiper-btn--next",
				  prevEl: ".swiper-btn--prev",
				},
			  });
			});
		}
  
		setInnerHTML(element, html) {
		  element.innerHTML = html;
  
		  // Reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
		  element.querySelectorAll("script").forEach((oldScriptTag) => {
			const newScriptTag = document.createElement("script");
			Array.from(oldScriptTag.attributes).forEach((attribute) => {
			  newScriptTag.setAttribute(attribute.name, attribute.value);
			});
			newScriptTag.appendChild(
			  document.createTextNode(oldScriptTag.innerHTML)
			);
			oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
		  });
		}
  
		removeDOMElements() {
		  const pickupAvailability = this.productElement.querySelector(
			"pickup-availability"
		  );
		  if (pickupAvailability) pickupAvailability.remove();
  
		  const productModal = this.productElement.querySelector("product-modal");
		  if (productModal) productModal.remove();
  
		  const gift = this.productElement.querySelector(".customer");
		  if (gift) gift.remove();
		}
  
		preventDuplicatedIDs() {
		  const sectionId = this.productElement.dataset.section;
		  this.productElement.innerHTML =
			this.productElement.innerHTML.replaceAll(
			  sectionId,
			  `quickadd-${sectionId}`
			);
		  this.productElement
			.querySelectorAll("variant-selects, variant-radios")
			.forEach((variantSelect) => {
			  variantSelect.dataset.originalSection = sectionId;
			});
		}
  
		preventVariantURLSwitching() {
		  if (this.modalContent.querySelector("variant-radios,variant-selects")) {
			this.modalContent
			  .querySelector("variant-radios,variant-selects")
			  .setAttribute("data-update-url", "false");
		  }
		}
  
		removeGalleryListSemantic() {
		  const galleryList = this.modalContent.querySelector(
			'[id^="Slider-Gallery"]'
		  );
		  if (!galleryList) return;
  
		  galleryList.setAttribute("role", "presentation");
		  galleryList
			.querySelectorAll('[id^="Slide-"]')
			.forEach((li) => li.setAttribute("role", "presentation"));
		}
  
		updateImageSizes() {
		  const product = this.modalContent.querySelector(".product");
		  const desktopColumns = product.classList.contains("product--columns");
		  if (!desktopColumns) return;
  
		  const mediaImages = product.querySelectorAll(".product__media img");
		  if (!mediaImages.length) return;
  
		  let mediaImageSizes =
			"(min-width: 1000px) 715px, (min-width: 750px) calc((100vw - 11.5rem) / 2), calc(100vw - 4rem)";
  
		  if (product.classList.contains("product--medium")) {
			mediaImageSizes = mediaImageSizes.replace("715px", "605px");
		  } else if (product.classList.contains("product--small")) {
			mediaImageSizes = mediaImageSizes.replace("715px", "495px");
		  }
  
		  mediaImages.forEach((img) =>
			img.setAttribute("sizes", mediaImageSizes)
		  );
		}
	  }
	);

// Quick view JS 
(function ($) {
	const initProductAccordion = () => {
		$(".about__accordion-title").off("click").on("click", function () {
			const $clickedTitle = $(this);
			const $allItems = $(".about__accordion-item");
			const $currentItem = $clickedTitle.closest(".about__accordion-item");

			const isActive = $clickedTitle.hasClass("active");

			if (!isActive) {
				$(".about__accordion-title.active").removeClass("active");
				$(this).addClass("active");
				$(".about__accordion-description").stop().slideUp(300);
				 $(this)
                    .siblings(".about__accordion-description")
                    .eq($(this).index())
                    .stop()
                    .slideDown(300);
			} else {
				$clickedTitle.removeClass("active");
				$clickedTitle.siblings(".about__accordion-description").stop().slideUp(300);
			}

			$allItems.each(function () {
				const isCurrent = $(this).is($currentItem);
				$(this).attr("aria-expanded", isCurrent ? !isActive : false);
			});
		});
	};

    // Wait until ".about__accordion-title" element is found
    const waitForAccordionTitle = function () {
        return new Promise(function (resolve, reject) {
            const startTime = Date.now();
            const checkElement = function () {
                if ($(".about__accordion-title").length) {
                    resolve();
                } else if (Date.now() - startTime > 5000) {
                    reject(new Error("Accordion title element not found"));
                } else {
                    requestAnimationFrame(checkElement);
                }
            };
            checkElement();
        });
    };

    // Initialize accordion on Shopify section load
    $(document).on("shopify:section:load", function () {
        initProductAccordion();
    });

    // Re-initialize accordion when quick view is opened
    $(document).on('click', '.card__link.button--secondary.js-color-swatches-link', function () {
        setTimeout(function () {
            waitForAccordionTitle().then(function () {
                initProductAccordion();
            }).catch(function (error) {
            });
        }, 3000);  // Delay to ensure quick view content is loaded
    });

    // Initial load
    $(document).ready(function () {
        waitForAccordionTitle().then(function () {
            initProductAccordion();
        }).catch(function (error) {
        });
    });

})(jQuery);

}
   