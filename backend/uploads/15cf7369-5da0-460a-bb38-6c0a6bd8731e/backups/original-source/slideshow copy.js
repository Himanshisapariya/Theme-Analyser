(function () {
	const slideshow = () => {
		$(document).ready(function () {
			$(".js-slideshow-container").each(function () {
				const $this = $(this);
				const id = $this.attr("id");
				const sliderS = `#${id} .js-slideshow`;
				const nextEl = `#${id} .swiper-button-next`;
				const prevEl = `#${id} .swiper-button-prev`;
				const paginationEl = `#${id} .swiper-pagination`;
				let swipBtns = document.querySelector(`#${id} .swip-btns`);
				let swipPagin = document.querySelector(
					`#${id} .js-slideshow-pagination`
				);
				// ---
				let isHoverStopAutoplay = $this.data().isHoverStopAutoplay;
				const isAutoplay = $this.data().isAutoplay;
				const delaySlideing = $this.data().delaySlideing * 1000;
				const speedSlideing = $this.data().speedSlideing * 1000;
				isHoverStopAutoplay =
					isAutoplay === false ? false : isHoverStopAutoplay;

				const insertAutoplay = () =>
					isAutoplay === true
						? {
								autoplay: {
									delay: delaySlideing,
									disableOnInteraction: false,
								},
						  }
						: {};

				const swiperSlideshow = new Swiper(sliderS, {
					parallax: true,
					speed: speedSlideing,
					loop: false,
					...insertAutoplay(),
					navigation: {
						nextEl: nextEl,
						prevEl: prevEl,
					},
					pagination: {
						el: paginationEl,
						clickable: true,
					},
					keyboard: false,
					watchSlidesProgress: true,
				});

				swiperSlideshow.on("slideChange", colorSchemeChange);

				window.onload = (event) => {
					colorSchemeChange();
				};

				$(`${sliderS}`).mouseenter(function () {
					if (isHoverStopAutoplay === true) {
						stopSlide();
					}
				});

				$(`${sliderS}`).mouseleave(function () {
					if (isHoverStopAutoplay === true) {
						startSlide();
					}
				});

				let slideshowItems = document.querySelectorAll(
					`#${id}.slideshow .swiper-slide`
				);
				// ====================== functions ======================
				function colorSchemeChange() {
					if (
						slideshowItems[swiperSlideshow.activeIndex].classList.contains(
							"theme-dark"
						)
					) {
						swipBtns.classList.add("theme-dark");
						swipPagin.classList.add("theme-dark");
					} else {
						swipBtns.classList.remove("theme-dark");
						swipPagin.classList.remove("theme-dark");
					}
				}
				function startSlide() {
					if (isAutoplay === true) {
						swiperSlideshow.autoplay.start();
					}
				}

				function stopSlide() {
					swiperSlideshow.autoplay.stop();
				}
			});
		});
	};

	document.addEventListener("DOMContentLoaded", function () {
		slideshow();
		document.addEventListener("shopify:section:load", function () {
			slideshow();
		});
	});
})();
