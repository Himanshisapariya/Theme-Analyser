$(document).ready(function () {
  // Header sticky
  $(window).scroll(function () {
    if ($(this).scrollTop() > 40) {
      $(".ctm_header_wrapper").addClass("menufixed");
      $("body").addClass("header-fixed");
      $("body").addClass("cart-top");
    } else {
      $(".ctm_header_wrapper").removeClass("menufixed");
      $("body").removeClass("header-fixed");
      $("body").removeClass("cart-top");
    }
  });

  $(".sidebarIconToggle").click(function () {
    $(this).toggleClass("sidebarclose");
    $(".sidebar").toggle();
    $(".sidebar").toggleClass("sidebaranimat");
    $("body").toggleClass("bodybarfixed");
  });

  //footer menu js
  $(".footer-block__headings").click(function () {
    var targetFooterBlock = $(this).closest(".footer-block");
    var targetDetailsContent = targetFooterBlock.find(
      "ul.footer-block__details-content",
    );
    $(".footer-block").not(targetFooterBlock).removeClass("show");
    $("ul.footer-block__details-content")
      .not(targetDetailsContent)
      .removeClass("show");
    targetFooterBlock.toggleClass("show");
    targetDetailsContent.toggleClass("show");
  });

  // Icon With TEXT Slider
  var mySwiper = new Swiper(".icontext_slider_block", {
    slidesPerView: 6,
    spaceBetween: 44,
    loop: false,
    centeredSlides: false,
    centeredSlidesBounds: false,
    speed: 1000,
    // autoplay: {
    //   delay: 2500,
    //   disableOnInteraction: false,
    // },
    navigation: {
      nextEl: ".icontext_next",
      prevEl: ".icontext_prev",
    },
    breakpoints: {
      1440: {
        slidesPerView: 6,
        spaceBetween: 44,
        loop: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
      },
      1280: {
        slidesPerView: 4.5,
        spaceBetween: 44,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      1024: {
        slidesPerView: 4.2,
        spaceBetween: 30,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      768: {
        slidesPerView: 4.2,
        spaceBetween: 25,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      576: {
        slidesPerView: 3.5,
        spaceBetween: 20,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      414: {
        slidesPerView: 2.2,
        spaceBetween: 20,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      0: {
        slidesPerView: 1.53,
        spaceBetween: 20,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
    },
  });

  // Fearure Collection
  var mySwiper = new Swiper(".ctm_feature_coll_slider", {
    slidesPerView: 3,
    spaceBetween: 32,
    loop: false,
    centeredSlides: false,
    centeredSlidesBounds: false,
    speed: 1000,
    // autoplay: {
    // delay: 2500,
    // disableOnInteraction: false,
    // },
    disableOnInteraction: false,
    breakpoints: {
      1440: {
        slidesPerView: 3,
        spaceBetween: 32,
        loop: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
      },
      1280: {
        slidesPerView: 3,
        spaceBetween: 32,
        loop: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 32,
        loop: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
      },
      768: {
        slidesPerView: 1.25,
        spaceBetween: 32,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      575: {
        slidesPerView: 1.3,
        spaceBetween: 32,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
        centerInsufficientSlides: true,
      },
      414: {
        slidesPerView: 1.25,
        spaceBetween: 32,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      0: {
        slidesPerView: 1.25,
        spaceBetween: 32,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
        centerInsufficientSlides: true,
      },
    },
  });

  // Beand LOGO Slider
  var mySwiper = new Swiper(".barand_logo_slider", {
    slidesPerView: 8,
    spaceBetween: 90,
    loop: false,
    centeredSlides: false,
    centeredSlidesBounds: false,
    speed: 1000,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    breakpoints: {
      1440: {
        slidesPerView: 8,
        spaceBetween: 90,
        loop: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
      },
      1280: {
        slidesPerView: 6.5,
        spaceBetween: 56,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      1024: {
        slidesPerView: 6.2,
        spaceBetween: 56,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      768: {
        slidesPerView: 4.5,
        spaceBetween: 40,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      576: {
        slidesPerView: 4.8,
        spaceBetween: 40,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      414: {
        slidesPerView: 4.5,
        spaceBetween: 40,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      0: {
        slidesPerView: 3.99,
        spaceBetween: 30,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
    },
  });

  // Icon With TEXT Slider
  var mySwiper = new Swiper(".ctm_icontext_block", {
    slidesPerView: 4,
    spaceBetween: 80,
    loop: false,
    centeredSlides: false,
    centeredSlidesBounds: false,
    speed: 1000,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      1440: {
        slidesPerView: 4,
        spaceBetween: 80,
        loop: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 40,
        loop: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 30,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 25,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      576: {
        slidesPerView: 3.5,
        spaceBetween: 20,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      414: {
        slidesPerView: 2.1,
        spaceBetween: 20,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      0: {
        slidesPerView: 1.7,
        spaceBetween: 20,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
    },
  });

  // Icon With TEXT Slider
  var mySwiper = new Swiper(".ctm_learnmore_block", {
    slidesPerView: 4,
    spaceBetween: 80,
    loop: false,
    centeredSlides: false,
    centeredSlidesBounds: false,
    speed: 1000,
    // autoplay: {
    //   delay: 2500,
    //   disableOnInteraction: false,
    // },
    navigation: {
      nextEl: ".ctm_icontext_next",
      prevEl: ".ctm_icontext_prev",
    },
    breakpoints: {
      1440: {
        slidesPerView: 4,
        spaceBetween: 80,
        loop: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 40,
        loop: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 40,
        loop: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
      },
      768: {
        slidesPerView: 2.5,
        spaceBetween: 80,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      576: {
        slidesPerView: 3.5,
        spaceBetween: 20,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      414: {
        slidesPerView: 2.1,
        spaceBetween: 20,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      0: {
        slidesPerView: 1.9,
        spaceBetween: 20,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
    },
  });

  // FAQ Accordian
  let questions = document.querySelectorAll(".faq_question");

  questions.forEach((question) => {
    let icon = question.querySelector(".icon-shape");

    question.addEventListener("click", (event) => {
      const active = document.querySelector(".faq_question.active");
      const activeIcon = document.querySelector(".icon-shape.active");

      if (active && active !== question) {
        active.classList.toggle("active");
        activeIcon.classList.toggle("active");
        active.nextElementSibling.style.maxHeight = 0;
      }

      question.classList.toggle("active");
      icon.classList.toggle("active");

      const answer = question.nextElementSibling;

      if (question.classList.contains("active")) {
        answer.style.maxHeight = answer.scrollHeight + "rem";
      } else {
        answer.style.maxHeight = 0;
      }
    });

    // Check if the question has the "open" class and add the "active" class accordingly
    if (question.classList.contains("open")) {
      question.classList.add("active");
      icon.classList.add("active");
      const answer = question.nextElementSibling;
      answer.style.maxHeight = answer.scrollHeight + "rem";
    }
  });
  // faq end

  // Homepage Award Section
  var swiper = new Swiper(".award-swiper", {
    draggable: true,
    loop: true,
    navigation: {
      nextEl: ".awardtext_next",
      prevEl: ".awardtext_prev",
    },
    pagination: {
      el: ".award_pagination",
      clickable: true,
    },
  });

  var upsell_swiper = new Swiper(".upsell-swiper", {
    draggable: true,
    loop: true,
    pagination: {
      el: ".swiper-pagination.upsell_pagination",
      clickable: true,
    },
  });

  // FEATURE BRAND LOGO
  var mySwiper = new Swiper(".featrure_brand_slider", {
    slidesPerView: 8,
    spaceBetween: 67,
    loop: false,
    centeredSlides: false,
    centeredSlidesBounds: false,
    speed: 1000,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    breakpoints: {
      1440: {
        slidesPerView: 8,
        spaceBetween: 67,
        loop: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
      },
      1280: {
        slidesPerView: 6.5,
        spaceBetween: 56,
        loop: false,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      1024: {
        slidesPerView: 5.1,
        spaceBetween: 56,
        loop: false,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      768: {
        slidesPerView: 4.5,
        spaceBetween: 40,
        loop: false,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      576: {
        slidesPerView: 4.8,
        spaceBetween: 40,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      414: {
        slidesPerView: 4.5,
        spaceBetween: 40,
        loop: false,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      0: {
        slidesPerView: 4.1,
        spaceBetween: 40,
        loop: false,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
    },
  });

  //timeline slider
  var swiper = new Swiper(".timeline_slider", {
    spaceBetween: 30,
    mousewheel: {
      forceToAxis: true,
    },
    scrollbar: {
      el: ".swiper-scrollbar",
      hide: false,
      draggable: true,
    },
    breakpoints: {
      1440: {
        slidesPerView: 5,
        spaceBetween: 65,
      },
      1199: {
        slidesPerView: 5,
      },
      1024: {
        slidesPerView: 4.5,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      500: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      320: {
        slidesPerView: 1.2,
        spaceBetween: 30,
      },
      0: {
        slidesPerView: 1.2,
        spaceBetween: 30,
      },
    },
  });

  // Upsell cart
  function refreshCart() {
    const cartDrawer = document.getElementById("CartDrawer");

    if (cartDrawer) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", window.location.href);
      xhr.onload = () => {
        if (xhr.status === 200) {
          const parser = new DOMParser();
          const responseDoc = parser.parseFromString(
            xhr.responseText,
            "text/html",
          );
          const newContent = responseDoc.querySelector("#CartDrawer");
          if (newContent) {
            cartDrawer.innerHTML = newContent.innerHTML;

            // ✅ Reinitialize swatches after cart content update
            setTimeout(() => {
              reinitializeAllUpsellSwatches();
            }, 100);
          }
        }
      };
      xhr.send();
    }
  }

  function addItemToCart(variant_id, qty, removekey) {
    var data = {
      id: variant_id,
      quantity: qty,
    };
    $.ajax({
      type: "POST",
      url: "/cart/add.js",
      data: data,
      dataType: "json",
      success: function () {
        if (!removekey) return;
        $.ajax({
          type: "POST",
          url: "/cart/change.js",
          data: {
            id: removekey,
            quantity: 0,
          },
          dataType: "json",
          success: function (cart) {
            refreshCart();
            $(".cart-count-bubble span").text(cart.item_count);
          },
          error: function (xhr, status, error) {
            console.log("--error--", eval("(" + xhr.responseText + ")"));
          },
        });
      },
    });
  }

  $(document).on("click", ".upsell-atc-button", function () {
    addItemToCart(
      $(this).attr("data-id"),
      $(this).attr("data-quantity"),
      $(this).attr("data-key"),
    );
  });

  //PDP Read More Popup
  var popup = document.getElementById("ctm-pdp-popup");
  var btnOpenPopup = document.getElementById("openPopup");
  var closeButton = document.getElementById("ctm-closePopup-pdp");
  var body = document.body; // Get the body element

  if (btnOpenPopup)
    btnOpenPopup.onclick = function () {
      popup.style.display = "block";
      body.classList.add("active-popup"); // Add class when popup opens
    };

  if (closeButton)
    closeButton.onclick = function () {
      popup.style.display = "none";
      body.classList.remove("active-popup"); // Remove class when popup closes
    };

  if (popup)
    window.onclick = function (event) {
      if (
        !event.target.closest("#ctm-pdp-popup") &&
        event.target !== btnOpenPopup
      ) {
        popup.style.display = "none";
        if (body.classList.contains("active-popup")) {
          body.classList.remove("active-popup"); // Also remove class if clicking outside to close popup
        }
      }
    };

  // FAQ Accordian
  document.addEventListener("DOMContentLoaded", function () {
    const questions = document.querySelectorAll(".faq_question");

    questions.forEach((question) => {
      const icon = question.querySelector(".icon-shape");
      const answer = question.nextElementSibling;

      question.addEventListener("click", () => {
        const isActive = question.classList.contains("active");

        questions.forEach((q) => {
          q.classList.remove("active");
          q.nextElementSibling.style.maxHeight = 0;
          q.querySelector(".icon-shape").classList.remove("active");
        });

        if (!isActive) {
          question.classList.add("active");
          icon.classList.add("active");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });

      // Check if the question has the "open" class and add the "active" class accordingly
      if (question.classList.contains("open")) {
        question.classList.add("active");
        icon.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
});

// PDP Variants
function initializeProductSwatch(productID) {
  var swatchItems = document.querySelectorAll(
    `#${productID} .custom-swatch li`,
  );

  swatchItems.forEach(function (swatchItem) {
    swatchItem.addEventListener("click", function () {
      var span = swatchItem.querySelector("span");
      var shponowBtn = document.querySelector(
        "#" + productID + " .shponow-btn",
      );
      var atcSpan = shponowBtn.querySelector("span.col-atc");
      var soldOutSpan = shponowBtn.querySelector("span.sold-out-message");

      if (span.classList.contains("variant_disabled")) {
        shponowBtn.classList.add("btn_disable");
        atcSpan.classList.add("hidden");
        soldOutSpan.classList.remove("hidden");
      } else {
        shponowBtn.classList.remove("btn_disable");
        atcSpan.classList.remove("hidden");
        soldOutSpan.classList.add("hidden");
      }

      swatchItems.forEach(function (item) {
        item.classList.remove("selected_shade");
      });

      swatchItem.classList.add("selected_shade");
      var newImage = swatchItem.getAttribute("data-href");
      var swatchTitle = swatchItem.getAttribute("data-option-title");
      var swatchPrice = swatchItem.getAttribute("data-price");
      var swatchPriceSale = swatchItem.getAttribute("data-sale");
      var swatchSku = swatchItem.getAttribute("data-sku");
      var selectOptions = document.querySelectorAll(
        'select[name^="id"] option',
      );

      selectOptions.forEach(function (option) {
        var optionTitle = option.getAttribute("data-option-size");
        var optionSku = option.getAttribute("data-sku");
        option.removeAttribute("selected");

        if (swatchTitle === optionTitle && swatchSku === optionSku) {
          option.setAttribute("selected", "selected");
        }
      });
      if (swatchPriceSale != "") {
        var originalprice = document.querySelector(
          "#" + productID + " .price__sale span",
        );
        var saleprice = document.querySelector(
          "#" + productID + " .price__sale .price-item--regular",
        );
        var savings = document.querySelector(
          "#" + productID + " .price-difference",
        );
        originalprice.innerHTML = swatchPrice;
        saleprice.innerHTML = swatchPriceSale;

        var original = parseFloat(swatchPrice.replace(/[$,]/g, ""));
        var sale = parseFloat(swatchPriceSale.replace(/[$,]/g, ""));
        var diff = sale - original;

        const formatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        savings.innerHTML = `(${formatter.format(diff)} Savings!)`;
      } else {
        var originalprice = document.querySelector(
          "#" + productID + " .price__regular .price-item--regular",
        );
        originalprice.innerHTML = swatchPrice;
      }

      return false;
    });
  });
}

// start yml section variant selector
document.addEventListener("DOMContentLoaded", function () {
  const updateOptions = (fieldsetContainer) => {
    const options = Array.from(
      fieldsetContainer.querySelectorAll("select, fieldset"),
      (element) => {
        if (element.tagName === "SELECT") {
          return element.value;
        }
        if (element.tagName === "FIELDSET") {
          return Array.from(element.querySelectorAll("input")).find(
            (radio) => radio.checked,
          )?.value;
        }
      },
    );
    return options;
  };

  const fieldsets = document.querySelectorAll(
    "fieldset.js.product-form__input--pill",
  );

  fieldsets.forEach((fieldset) => {
    fieldset.addEventListener("change", (event) => {
      const radioInputs = fieldset.querySelectorAll("input[type='radio']");

      radioInputs.forEach((input) => {
        if (input === event.target) {
          input.setAttribute("checked", "checked");
        } else {
          input.removeAttribute("checked");
        }
      });

      const checkedRadio = fieldset.querySelector(
        "input[type='radio']:checked",
      );
      if (checkedRadio) {
        const variantId = checkedRadio.getAttribute("data-variant-id");
        let variantPrice = checkedRadio.getAttribute("data-variant-price");

        variantPrice = parseFloat(variantPrice.replace(/[^0-9.]/g, ""));

        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(variantPrice);

        const productContainer = fieldset.closest(".product");
        const productId = productContainer?.dataset.productId;

        const hiddenInput = productContainer?.querySelector(".variant-id");
        if (hiddenInput) {
          hiddenInput.value = variantId;
        }

        const priceSpan = document.querySelector(`#price-${productId}`);
        if (priceSpan) {
          priceSpan.textContent = formattedPrice;
        }

        const comparePriceSpan = document.querySelector(
          `#compare-price-${productId}`,
        );
        if (comparePriceSpan) {
          let comparePrice = checkedRadio.getAttribute(
            "data-variant-compare-price",
          );
          if (comparePrice) {
            comparePrice = parseFloat(comparePrice.replace(/[^0-9.]/g, ""));
            const formattedComparePrice = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(comparePrice);
            comparePriceSpan.textContent = formattedComparePrice;
          } else {
            comparePriceSpan.textContent = "";
          }
        }

        updatePrice(variantId);
      }

      const selectedOptions = updateOptions(
        fieldset.closest(".pdp_carient_block"),
      );
    });
  });
});
// end yml section variant selector
document.querySelectorAll(".menu-caret-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const summary = button.closest("summary");
    const details = summary.closest("details");
    details.open = !details.open;
  });
});
document.querySelectorAll("details").forEach((detailsEl) => {
  const summaryEl = detailsEl.querySelector("summary");

  detailsEl.addEventListener("toggle", () => {
    if (detailsEl.open) {
      summaryEl.classList.add("menu-drawer__menu-item--active");
    } else {
      summaryEl.classList.remove("menu-drawer__menu-item--active");
    }
  });
});

function reinitializeAllUpsellSwatches() {
  const upsellElements = document.querySelectorAll(".cart-upsell");

  upsellElements.forEach((el) => {
    const id = el.getAttribute("id");
    if (id) {
      initializeProductSwatch(id);
    }
  });
}

// ✅ Initial run after DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    reinitializeAllUpsellSwatches();
  }, 300); // Delay slightly to allow DOM load
});

// ✅ Also observe DOM updates to upsell section
const upsellObserverTarget = document.querySelector(".drawer__cart_container");
if (upsellObserverTarget) {
  const observer = new MutationObserver(() => {
    reinitializeAllUpsellSwatches();
  });

  observer.observe(upsellObserverTarget, {
    childList: true,
    subtree: true,
  });
}

