(function () {
  let swiperMulticolumn;
  const multicolumnSwipeEnabled = document.querySelector(".swiper--multicolumn");

  const initSlider = () => {
    const swiperContainer = document.querySelector(".swiper--multicolumn");
    if (!swiperContainer) return;

    const mobileColumns = parseInt(swiperContainer.dataset.mobileColumns) || 1;

    swiperMulticolumn = new Swiper(swiperContainer, {
      loop: false,
      speed: 1100,
      slidesPerView: mobileColumns,
      spaceBetween: mobileColumns > 1 ? 16 : 0,
      navigation: {
        nextEl: swiperContainer.querySelector(".swiper-button-next"),
        prevEl: swiperContainer.querySelector(".swiper-button-prev"),
      },
    });
  };

  const destroySlider = () => {
    if (!swiperMulticolumn) return;

    swiperMulticolumn.destroy(true, true);
    swiperMulticolumn = undefined;
  };

  const initMulticolumn = () => {
    const multicolumnSection = document.querySelector(".multicolumn-section");
    if (!multicolumnSection) return;

    const sectionResizeObserver = new ResizeObserver((entries) => {
      const [entry] = entries;

      if (entry.contentRect.width < 990) {
        if (multicolumnSwipeEnabled && !swiperMulticolumn) {
          initSlider();
        }
      } else {
        if (swiperMulticolumn) {
          destroySlider();
        }
      }
    });

    sectionResizeObserver.observe(multicolumnSection);
  };

  initMulticolumn();

  document.addEventListener("shopify:section:load", function () {
    destroySlider();
    initMulticolumn();
  });
})();
