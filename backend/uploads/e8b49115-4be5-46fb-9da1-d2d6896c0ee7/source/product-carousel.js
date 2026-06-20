(function () {
	let prodcarousel = () => {
		$(".product-carousel-section").each(function () {
			let slideEl = $(this).find(".product-carousel__wrapper");
			let carousel = $(this).find(".swiper-carousel");
			let slide = $(this).find(".swiper-slide");
			let buttonNext = $(this).find(".swiper-button-next");
			let prodCountHalf = parseFloat(slideEl.data("count")) + 0.1;
			
			// Get mobile slides per view from data attribute
			let mobileSlidesPerView = parseFloat(carousel.data("mobile-slides")) || 1.2;
			
			if ($(this).hasClass("slider_started")) {
				return "";
			}

			$(this).addClass("slider_started");
			let id = $(this).attr("id");

			let prodSwiperParams = {
				centeredSlides: false,
				slidesPerView: mobileSlidesPerView,
				waitForTransition: false,
				watchSlidesProgress: true,
				updateOnWindowResize: true,
				preloadImages: true,
				allowTouchMove: true,
				spaceBetween: 4,
				a11y: false,
				breakpoints: {
					575: {
						slidesPerView: 2.5,
					},
					768: {
						slidesPerView: 2,
					},
					990: {
						slidesPerView: 2.1,
					},
					1200: {
						slidesPerView: 3.1,
					},
					1360: {
						slidesPerView: 5.5,
					},
				},
				on: {
					slideChange: function () {
						if (this.activeIndex === 0) {
							Array.from(slide).forEach((element) => {
								element.classList.remove("slide_change-postion");
							});
							Array.from(carousel).forEach((element) => {
								element.classList.add("carousel_change-postion_next");
								element.classList.remove("carousel_change-postion_prev");
								element.classList.remove("carousel_change-postion_next-2");
							});
							this.update();
						} else {
							if (this.activeIndex > this.previousIndex) {
								Array.from(carousel).forEach((element) => {
									element.classList.remove("carousel_change-postion_next");
									element.classList.remove("carousel_change-postion_next-2");
									element.classList.add("carousel_change-postion_prev");
								});
								Array.from(slide).forEach((element) => {
									if (buttonNext.hasClass("swiper-button-disabled")) {
										element.classList.remove("slide_change-postion");
									} else {
										element.classList.add("slide_change-postion");
									}
								});
							} else {
								Array.from(carousel).forEach((element) => {
									element.classList.add("carousel_change-postion_next-2");
									element.classList.remove("carousel_change-postion_prev");
								});
								Array.from(slide).forEach((element) => {
									element.classList.remove("slide_change-postion");
								});
							}
							this.update();
						}
					},
				},
			};

			let swiperSlider = new Swiper(`#${id} .swiper-carousel`, {
				navigation: {
					nextEl: `#${id} .swiper-button-next__prod`,
					prevEl: `#${id} .swiper-button-prev__prod`,
				},
				...prodSwiperParams,
			});
		});
	};

	document.addEventListener("DOMContentLoaded", function () {
		prodcarousel();
	});

	document.addEventListener("shopify:section:load", function () {
		prodcarousel();
	});

	document.addEventListener("resize", function () {
		prodcarousel();
	});

	document.addEventListener("visibilitychange", function () {
		prodcarousel();
	});

	prodcarousel();
})();

//button-with-underline
if (window.screen.width > 990) {
	let attachedProductCarousel = false;

	let carouselSection = document.querySelector(".product-carousel-section");

	let imageContainerCarousel = carouselSection ? carouselSection.querySelector(
		".button--with-underline--container"
	) : null;

	let followMouseCarousel = (event) => {
		if (imageContainerCarousel) {
			imageContainerCarousel.style.left = event.pageX + "px";
			imageContainerCarousel.style.top = event.pageY + 30 + "px";
		}
	};

	window.showTextCarousel = function() {
		if (!attachedProductCarousel && imageContainerCarousel) {
			attachedProductCarousel = true;
			imageContainerCarousel.style.display = "block";
			document.addEventListener("pointermove", followMouseCarousel);
		}
	}

	window.hideTextCarousel = function() {
		if (imageContainerCarousel) {
			attachedProductCarousel = false;
			imageContainerCarousel.style.display = "";
			document.removeEventListener("pointermove", followMouseCarousel);
		}
	}
}