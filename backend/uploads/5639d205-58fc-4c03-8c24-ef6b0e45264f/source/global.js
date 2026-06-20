function getSliderSettings() {
	return {
		slidesPerView: 1,
		navigation: {
			nextEl: ".swiper-btn--next",
			prevEl: ".swiper-btn--prev",
		},
	};
}

let main = document.querySelector("main");
let pageHeader = document.querySelector("header");

let mainSection = document.querySelector("main section");

if (mainSection) {
	if (mainSection.id.includes("lookbook")) {
		main.classList.add("page-lookbook");
	} else if (mainSection.id.includes("about")) {
		main.classList.add("page-about");
	}

	setTimeout(() => {
		if (
			mainSection.id.includes("pages") ||
			mainSection.className.includes("product-section")
		) {
			main.classList.remove("header_overlay");
			pageHeader.classList.remove("overlay");
			pageHeader.classList.remove("header-color-background-5");
			pageHeader.classList.remove("theme-dark");
		}
	});
}

function getSubSliderProductSettings() {
	return {
		slidesPerView: 3,
		direction: "vertical",
		navigation: false,
	};
}

function updatethumbnail() {
	let productList = document.querySelector(".product__media-list img");
	let mediaThumbHeight = document.querySelector(".product__media-sublist");

	if (productList) {
		productList.addEventListener('load', () => {
			let mediaHeight = productList.offsetHeight;
			if (mediaThumbHeight) {
				if (window.innerWidth > 1200) {
					mediaThumbHeight.style.height = mediaHeight + "px";
				}
				if (window.innerWidth < 1200) {
					mediaThumbHeight.style.height = "100%";
				}
			}
		});
	}

	// For cached images (already loaded):
	if (productList?.complete) {
		productList?.dispatchEvent(new Event('load'));
	}
}

const sliderInit = (isUpdate) => {
	if (
		document.querySelectorAll(".product-section .js-media-list") &&
		document.querySelectorAll(".product-section .js-media-list").length > 0
	) {
		let slider = new Swiper(".js-media-list", {
			slidesPerView: 1,
			navigation: {
				nextEl: ".swiper-btn--next",
				prevEl: ".swiper-btn--prev",
			},
			a11y: false,
			thumbs: {
				swiper: document.querySelector(".js-media-sublist").swiper,
			},
			on: {
				slideChangeTransitionStart: function () {
					document
						.querySelector(".js-media-sublist")
						.swiper.slideTo(
							document.querySelector(".js-media-list").swiper.activeIndex
						);
				},
				slideChange: function () {
					window.pauseAllMedia();
					this.params.noSwiping = false;
				},
				slideChangeTransitionEnd: function () {
					if (this.slides[this.activeIndex].querySelector("model-viewer")) {
						this.slides[this.activeIndex]
							.querySelector(".shopify-model-viewer-ui__button--poster")
							.removeAttribute("hidden");
					}
				},
				touchStart: function (s, e) {
					if (this.slides[this.activeIndex].querySelector("model-viewer")) {
						if (
							!this.slides[this.activeIndex]
								.querySelector("model-viewer")
								.classList.contains("shopify-model-viewer-ui__disabled")
						) {
							this.params.noSwiping = true;
							this.params.noSwipingClass = "swiper-slide";
						} else {
							this.params.noSwiping = false;
						}
					}
				},
			},
		});

		if (isUpdate) {
			setTimeout(function () {
				slider.update();
				updatethumbnail();
			}, 50);
		}
	}
};

const subSliderInit = (isUpdate) => {
	if (
		document.querySelectorAll(".product-section .js-media-sublist") &&
		document.querySelectorAll(".product-section .js-media-sublist").length > 0
	) {
		let subSlider = new Swiper(".js-media-sublist", {
			centeredSlides: true,
			centeredSlidesBounds: true,
			slideToClickedSlide: true,
			watchSlidesProgress: true,
			updateOnWindowResize: true,
			slidesPerView: 3,
			spaceBetween: 4,
			direction: "horizontal",
			navigation: false,
			freeMode: false,
			preloadImages: false,
			lazy: true,
			a11y: false,
			breakpoints: {
				1200: {
					direction: "vertical",
					slidesPerView: 3,
					allowTouchMove: true,
				},
			},
			on: {
				touchEnd: function (s, e) {
					let range = 5;
					let diff = (s.touches.diff = s.isHorizontal()
						? s.touches.currentX - s.touches.startX
						: s.touches.currentY - s.touches.startY);
					if (diff < range || diff > -range) s.allowClick = true;
				},
			},
			transitionStart: function () {
				document
					.querySelector(".js-media-list")
					.swiper.slideTo(
						document.querySelector(".js-media-sublist").swiper.activeIndex
					);
			},
		});

		if (subSlider && subSlider.slides && subSlider.slides.length <= 3) {
			subSlider.params.centeredSlides = false;
			subSlider.update();
		}

		if (isUpdate) {
			setTimeout(function () {
				subSlider.update();
			}, 50);
		}
	}
};

let allSections = document.querySelectorAll("section");

window.addEventListener("resize", () => {
	allSections.forEach((prodSection) => {
		if (prodSection.classList.contains("product-section")) {
			setTimeout(() => {
				updatethumbnail();
			}, 50);
		}
	});
});

document.addEventListener("visibilitychange", function () {
	allSections.forEach((prodSection) => {
		if (prodSection.classList.contains("product-section")) {
			setTimeout(() => {
				updatethumbnail();
			}, 50);
		}
	});
});

document.addEventListener("DOMContentLoaded", function () {
	allSections.forEach((prodSection) => {
		if (prodSection.classList.contains("product-section")) {
			setTimeout(() => {
				updatethumbnail();
			}, 50);
		}
	});
});

function getFocusableElements(container) {
	return Array.from(
		container.querySelectorAll(
			"summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
		)
	);
}

document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
	summary.setAttribute("role", "button");
	summary.setAttribute("aria-expanded", "false");

	if (summary.nextElementSibling.getAttribute("id")) {
		summary.setAttribute("aria-controls", summary.nextElementSibling.id);
	}

	summary.addEventListener("click", (event) => {
		event.currentTarget.setAttribute(
			"aria-expanded",
			!event.currentTarget.closest("details").hasAttribute("open")
		);
	});

	if (summary.closest("header-drawer")) return;
	summary.parentElement.addEventListener("keyup", onKeyUpEscape);
});

function onKeyUpEscape(event) {
	if (event.code.toUpperCase() !== "ESCAPE") return;

	const openDetailsElement = event.target.closest("details[open]");
	if (!openDetailsElement) return;

	const summaryElement = openDetailsElement.querySelector("summary");
	openDetailsElement.removeAttribute("open");
	summaryElement.setAttribute("aria-expanded", false);
	summaryElement.focus();
}

const trapFocusHandlers = {};

function trapFocus(container, elementToFocus = container) {
	var elements = getFocusableElements(container);
	var first = elements[0];
	var last = elements[elements.length - 1];

	removeTrapFocus();

	trapFocusHandlers.focusin = (event) => {
		if (
			event.target !== container &&
			event.target !== last &&
			event.target !== first
		)
			return;

		document.addEventListener("keydown", trapFocusHandlers.keydown);
	};

	trapFocusHandlers.focusout = function () {
		document.removeEventListener("keydown", trapFocusHandlers.keydown);
	};

	trapFocusHandlers.keydown = function (event) {
		if (event.code.toUpperCase() !== "TAB") return; // If not TAB key
		// On the last focusable element and tab forward, focus the first element.
		if (event.target === last && !event.shiftKey) {
			event.preventDefault();
			first.focus();
		}

		//  On the first focusable element and tab backward, focus the last element.
		if (
			(event.target === container || event.target === first) &&
			event.shiftKey
		) {
			event.preventDefault();
			last.focus();
		}
	};

	document.addEventListener("focusout", trapFocusHandlers.focusout);
	document.addEventListener("focusin", trapFocusHandlers.focusin);

	elementToFocus.focus();
}

function pauseAllMedia() {
	document.querySelectorAll(".js-youtube").forEach((video) => {
		video.contentWindow.postMessage(
			'{"event":"command","func":"' + "pauseVideo" + '","args":""}',
			"*"
		);
	});
	document.querySelectorAll(".js-vimeo").forEach((video) => {
		video.contentWindow.postMessage('{"method":"pause"}', "*");
	});
	document.querySelectorAll("video").forEach((video) => video.pause());
	document.querySelectorAll("product-model").forEach((model) => {
		if (model.modelViewerUI) model.modelViewerUI.pause();
	});
}

function removeTrapFocus(elementToFocus = null) {
	document.removeEventListener("focusin", trapFocusHandlers.focusin);
	document.removeEventListener("focusout", trapFocusHandlers.focusout);
	document.removeEventListener("keydown", trapFocusHandlers.keydown);

	if (elementToFocus) elementToFocus.focus();
}

class QuantityInput extends HTMLElement {
	constructor() {
		super();
		this.input = this.querySelector("input");
		this.changeEvent = new Event("change", { bubbles: true });

		this.querySelectorAll("button").forEach((button) =>
			button.addEventListener("click", this.onButtonClick.bind(this))
		);

		var eventList = ["paste", "input"];

		for (event of eventList) {
			this.input.addEventListener(event, function (e) {
				const numberRegex = /^0*?[1-9]\d*$/;

				if (
					numberRegex.test(e.currentTarget.value) ||
					e.currentTarget.value === ""
				) {
					e.currentTarget.value;
				} else {
					e.currentTarget.value = 1;
				}
			});
		}

		this.input.addEventListener("focusout", function (e) {
			if (e.currentTarget.value === "") {
				e.currentTarget.value = 1;
			}
		});
	}

	onButtonClick(event) {
		event.preventDefault();
		const previousValue = this.input.value;

		event.target.name === "plus" ? this.input.stepUp() : this.input.stepDown();
		if (previousValue !== this.input.value)
			this.input.dispatchEvent(this.changeEvent);
	}
}

customElements.define("quantity-input", QuantityInput);

function debounce(fn, wait) {
	let t;
	return (...args) => {
		clearTimeout(t);
		t = setTimeout(() => fn.apply(this, args), wait);
	};
}

const serializeForm = (form) => {
	const obj = {};
	const formData = new FormData(form);
	for (const key of formData.keys()) {
		obj[key] = formData.get(key);
	}
	return JSON.stringify(obj);
};

function fetchConfig(type = "json") {
	return {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: `application/${type}`,
		},
	};
}


if (typeof window.Shopify == "undefined") {
	window.Shopify = {};
}

Shopify.bind = function (fn, scope) {
	return function () {
		return fn.apply(scope, arguments);
	};
};

Shopify.setSelectorByValue = function (selector, value) {
	for (var i = 0, count = selector.options.length; i < count; i++) {
		var option = selector.options[i];
		if (value == option.value || value == option.innerHTML) {
			selector.selectedIndex = i;
			return i;
		}
	}
};

Shopify.addListener = function (target, eventName, callback) {
	target.addEventListener
		? target.addEventListener(eventName, callback, false)
		: target.attachEvent("on" + eventName, callback);
};

Shopify.postLink = function (path, options) {
	options = options || {};
	var method = options["method"] || "post";
	var params = options["parameters"] || {};

	var form = document.createElement("form");
	form.setAttribute("method", method);
	form.setAttribute("action", path);

	for (var key in params) {
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", key);
		hiddenField.setAttribute("value", params[key]);
		form.appendChild(hiddenField);
	}
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function (
	country_domid,
	province_domid,
	options
) {
	this.countryEl = document.getElementById(country_domid);
	this.provinceEl = document.getElementById(province_domid);
	this.provinceContainer = document.getElementById(
		options["hideElement"] || province_domid
	);

	Shopify.addListener(
		this.countryEl,
		"change",
		Shopify.bind(this.countryHandler, this)
	);

	this.initCountry();
	this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
	initCountry: function () {
		var value = this.countryEl.getAttribute("data-default");
		Shopify.setSelectorByValue(this.countryEl, value);
		this.countryHandler();
	},

	initProvince: function () {
		var value = this.provinceEl.getAttribute("data-default");
		if (value && this.provinceEl.options.length > 0) {
			Shopify.setSelectorByValue(this.provinceEl, value);
		}
	},

	countryHandler: function (e) {
		var opt = this.countryEl.options[this.countryEl.selectedIndex];
		var raw = opt.getAttribute("data-provinces");
		var provinces = JSON.parse(raw);

		this.clearOptions(this.provinceEl);
		if (provinces && provinces.length == 0) {
			this.provinceContainer.style.display = "none";
		} else {
			for (var i = 0; i < provinces.length; i++) {
				var opt = document.createElement("option");
				opt.value = provinces[i][0];
				opt.innerHTML = provinces[i][1];
				this.provinceEl.appendChild(opt);
			}

			this.provinceContainer.style.display = "";
		}
	},

	clearOptions: function (selector) {
		while (selector.firstChild) {
			selector.removeChild(selector.firstChild);
		}
	},

	setOptions: function (selector, values) {
		for (var i = 0, count = values.length; i < values.length; i++) {
			var opt = document.createElement("option");
			opt.value = values[i];
			opt.innerHTML = values[i];
			selector.appendChild(opt);
		}
	},
};

class MenuDrawer extends HTMLElement {
	constructor() {
		super();

		this.mainDetailsToggle = this.querySelector("details");
		const summaryElements = this.querySelectorAll("summary");
		this.addAccessibilityAttributes(summaryElements);

		if (navigator.platform === "iPhone")
			document.documentElement.style.setProperty(
				"--viewport-height",
				`${window.innerHeight}px`
			);

		this.addEventListener("keyup", this.onKeyUp.bind(this));
		this.addEventListener("focusout", this.onFocusOut.bind(this));
		this.bindEvents();
	}

	bindEvents() {
		this.querySelectorAll("summary").forEach((summary) =>
			summary.addEventListener("click", this.onSummaryClick.bind(this))
		);
		this.querySelectorAll("button").forEach((button) => {
			if (this.querySelector(".header__localization-button") === button) return;
			if (this.querySelector(".header__localization-lang-button") === button)
				return;
			button.addEventListener("click", this.onCloseButtonClick.bind(this));
		});
	}

	addAccessibilityAttributes(summaryElements) {
		summaryElements.forEach((element) => {
			element.setAttribute("role", "button");
			element.setAttribute("aria-expanded", false);
			element.setAttribute("aria-controls", element.nextElementSibling.id);
		});
	}

	onKeyUp(event) {
		if (event.code.toUpperCase() !== "ESCAPE") return;

		const openDetailsElement = event.target.closest("details[open]");
		if (!openDetailsElement) return;

		openDetailsElement === this.mainDetailsToggle
			? this.closeMenuDrawer(this.mainDetailsToggle.querySelector("summary"))
			: this.closeSubmenu(openDetailsElement);
	}

	onSummaryClick(event) {
		const summaryElement = event.currentTarget;
		const detailsElement = summaryElement.parentNode;
		const isOpen = detailsElement.hasAttribute("open");

		if (detailsElement === this.mainDetailsToggle) {
			if (isOpen) event.preventDefault();
			isOpen
				? this.closeMenuDrawer(summaryElement)
				: this.openMenuDrawer(summaryElement);
		} else {
			trapFocus(
				summaryElement.nextElementSibling,
				detailsElement.querySelector("button")
			);

			setTimeout(() => {
				detailsElement.classList.add("menu-opening");
			});
		}
	}

	openMenuDrawer(summaryElement) {
		setTimeout(() => {
			this.mainDetailsToggle.classList.add("menu-opening");
		});
		summaryElement.setAttribute("aria-expanded", true);
		trapFocus(this.mainDetailsToggle, summaryElement);
		document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
	}

	closeMenuDrawer(event, elementToFocus = false) {
		if (event !== undefined) {
			this.mainDetailsToggle.classList.remove("menu-opening");
			this.mainDetailsToggle.querySelectorAll("details").forEach((details) => {
				details.removeAttribute("open");
				details.classList.remove("menu-opening");
			});
			this.mainDetailsToggle
				.querySelector("summary")
				.setAttribute("aria-expanded", false);
			document.body.classList.remove(
				`overflow-hidden-${this.dataset.breakpoint}`
			);
			removeTrapFocus(elementToFocus);
			this.closeAnimation(this.mainDetailsToggle);
		}
	}

	onFocusOut(event) {
		setTimeout(() => {
			if (
				this.mainDetailsToggle.hasAttribute("open") &&
				!this.mainDetailsToggle.contains(document.activeElement)
			)
				this.closeMenuDrawer();
		});
	}

	onCloseButtonClick(event) {
		const detailsElement = event.currentTarget.closest("details");
		this.closeSubmenu(detailsElement);
	}

	closeSubmenu(detailsElement) {
		detailsElement.classList.remove("menu-opening");
		removeTrapFocus();
		this.closeAnimation(detailsElement);
	}

	closeAnimation(detailsElement) {
		let animationStart;

		const handleAnimation = (time) => {
			if (animationStart === undefined) {
				animationStart = time;
			}

			const elapsedTime = time - animationStart;

			if (elapsedTime < 400) {
				window.requestAnimationFrame(handleAnimation);
			} else {
				detailsElement.removeAttribute("open");
				if (detailsElement.closest("details[open]")) {
					trapFocus(
						detailsElement.closest("details[open]"),
						detailsElement.querySelector("summary")
					);
				}
			}
		};

		window.requestAnimationFrame(handleAnimation);
	}
}

customElements.define("menu-drawer", MenuDrawer);

class HeaderDrawer extends MenuDrawer {
	constructor() {
		super();
	}

	openMenuDrawer(summaryElement) {
		this.header =
			this.header || document.querySelector(".shopify-section-header");
		this.borderOffset =
			this.borderOffset ||
			this.closest(".header-wrapper").classList.contains(
				"header-wrapper--border-bottom"
			)
				? 1
				: 0;
		document.documentElement.style.setProperty(
			"--header-bottom-position",
			`${parseInt(
				this.header.getBoundingClientRect().bottom - this.borderOffset
			)}px`
		);

		setTimeout(() => {
			this.mainDetailsToggle.classList.add("menu-opening");
		});

		summaryElement.setAttribute("aria-expanded", true);
		trapFocus(this.mainDetailsToggle, summaryElement);
		document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
	}
}

customElements.define("header-drawer", HeaderDrawer);
class ModalDialog extends HTMLElement {
	constructor() {
		super();
		this.querySelector('[id^="ModalClose-"]').addEventListener(
			"click",
			this.hide.bind(this, false)
		);
		this.addEventListener("keyup", (event) => {
			if (event.code.toUpperCase() === "ESCAPE") this.hide();
		});
		if (this.classList.contains("media-modal")) {
			this.addEventListener("pointerup", (event) => {
				if (
					event.pointerType === "mouse" &&
					!event.target.closest("deferred-media, product-model")
				)
					this.hide();
			});
		} else {
			this.addEventListener("click", (event) => {
				if (event.target === this) this.hide();
			});
		}
	}

	connectedCallback() {
		if (this.moved) return;
		this.moved = true;
		document.body.appendChild(this);
	}

	show(opener) {
		this.openedBy = opener;
		const popup = this.querySelector(".template-popup");
		document.body.classList.add("overflow-hidden");
		this.setAttribute("open", "");
		if (popup) popup.loadContent();
		trapFocus(this, this.querySelector('[role="dialog"]'));
		window.pauseAllMedia();
	}

	hide() {
		let isOpen = false;

		this.removeAttribute("open");
		removeTrapFocus(this.openedBy);
		window.pauseAllMedia();

		document.querySelectorAll("body > quick-add-modal").forEach((el) => {
			if (el.hasAttribute("open")) {
				isOpen = true;
				document.body.classList.add("overflow-hidden");
			}
		});

		if (!isOpen) {
			document.body.classList.remove("overflow-hidden");
			document.body.classList.remove("quickview-overflow-hidden");
			document.body.dispatchEvent(new CustomEvent("modalClosed"));
		}
	}
}

customElements.define("modal-dialog", ModalDialog);

function initializeQuickView(container) {
	const swiperEl = container.querySelector(".product__media-list.swiper");
	const modelSizeTextEl = container.querySelector(".size_model-main .main-text-model");
	const colorSwatches = container.querySelectorAll(".color-swatch-input");
	const mediaItems = container.querySelectorAll(".product__media-item, .product__media-subitem");

	if (!colorSwatches.length || !mediaItems.length) return;

	const localSwiper = new Swiper(swiperEl, {
		loop: false,
		slidesPerView: 1,
		autoHeight: true,
		navigation: {
			nextEl: container.querySelector(".swiper-btn--next"),
			prevEl: container.querySelector(".swiper-btn--prev"),
		},
		pagination: {
			el: container.querySelector(".swiper-pagination"),
			clickable: true,
		},
	});

	function extractVariantParts(altText) {
		if (!altText) return [];
		const raw = altText.toLowerCase();
		const parts = raw.split("||").map(p => p.trim());
		let variantSegment = parts.find(p => p.startsWith("variants:"));
		if (variantSegment) {
			return variantSegment.replace("variants:", "").split("*").map(v => v.trim());
		}
		return parts[0].split("*").map(v => v.trim());
	}

	function extractTextAfterDoublePipe(altText) {
		const parts = (altText || "").split("||");
		return parts.length > 1 ? parts[1].trim() : "";
	}

	function capitalizeFirstAndLast(text) {
		if (!text) return "";
		if (text.length === 1) return text.toUpperCase();
		return text.charAt(0).toUpperCase() + text.slice(1, -1) + text.charAt(text.length - 1).toUpperCase();
	}

	function updateModelSizeFromActiveSlide() {
		const activeIndex = localSwiper.activeIndex;
		const activeSlide = mediaItems[activeIndex];
		if (activeSlide) {
			const altText = activeSlide.getAttribute("data-media-alt") || "";
			const textAfterDoublePipe = extractTextAfterDoublePipe(altText);
			if (modelSizeTextEl) modelSizeTextEl.textContent = capitalizeFirstAndLast(textAfterDoublePipe);
		} else {
			if (modelSizeTextEl) modelSizeTextEl.textContent = "";
		}
	}

	function updateMediaDisplay() {
		const checkedSwatch = Array.from(colorSwatches).find(input => input.checked);
		if (!checkedSwatch) return;

		const defaultVariantValue = checkedSwatch.getAttribute("data-variant-value");
		if (!defaultVariantValue) return;

		let matchingIndexes = [];
		let firstVisibleIndex = -1;

		mediaItems.forEach((media, index) => {
			const mediaAltRaw = media.getAttribute("data-media-alt") || "";
			const variantParts = extractVariantParts(mediaAltRaw);
			const match = variantParts.some(
				part => part.trim().toLowerCase() === defaultVariantValue.toLowerCase()
			);
			if (match) {
				matchingIndexes.push(index);
				if (firstVisibleIndex === -1) {
					firstVisibleIndex = index;
				}
			}
		});

		const showAll = matchingIndexes.length === 0;

		mediaItems.forEach((media, index) => {
			const mediaAltRaw = media.getAttribute("data-media-alt") || "";
			const variantParts = extractVariantParts(mediaAltRaw);
			const match = variantParts.some(
				part => part.trim().toLowerCase() === defaultVariantValue.toLowerCase()
			);
			const shouldShow = showAll || match;
			media.style.display = shouldShow ? "" : "none";
		});

		localSwiper.update();
		if (firstVisibleIndex !== -1) {
			localSwiper.slideTo(firstVisibleIndex);
		}
		setTimeout(updateModelSizeFromActiveSlide, 50);
	}

	updateMediaDisplay();
	colorSwatches.forEach(swatch => {
		swatch.addEventListener("change", updateMediaDisplay);
	});
	localSwiper.on("slideChange", updateModelSizeFromActiveSlide);
}

class ModalOpener extends HTMLElement {
	constructor() {
		super();

		const button = this.querySelector("button");

		if (!button) return;
		button.addEventListener("click", async () => {
			
			const modal = document.querySelector(this.getAttribute("data-modal"));
			if (modal) modal.show(button);
			document.body.classList.add("quickview-overflow-hidden");

            const contentWrapper = modal.querySelector(".quick-add-modal__content-info");
			if (!contentWrapper) return;

			const waitForContent = () =>
				new Promise(resolve => {
					const check = () => {
						if (contentWrapper.children.length > 0) {
							resolve();
						} else {
							setTimeout(check, 100);
						}
					};
					check();
				});

			await waitForContent();

			initializeQuickView(modal);

		});
	}
}

customElements.define("modal-opener", ModalOpener);

class DeferredMedia extends HTMLElement {
	constructor() {
		super();
		this.querySelector('[id^="Deferred-Poster-"]')?.addEventListener(
			"click",
			this.loadContent.bind(this)
		);
		if (this.getAttribute("data-autoplay")) {
			this.loadContent();
		}
	}

	loadContent() {
		if (!this.getAttribute("loaded")) {
			const content = document.createElement("div");
			content.appendChild(
				this.querySelector("template").content.firstElementChild.cloneNode(true)
			);

			this.setAttribute("loaded", true);
			window.pauseAllMedia();
			const deferredElement = this.appendChild(
				content.querySelector("video, model-viewer, iframe")
			);
			// if (focus) deferredElement.focus();
			if (
				deferredElement.nodeName == "VIDEO" ||
				deferredElement.nodeName == "IFRAME"
			) {
				// force autoplay for safari
				deferredElement.play();
			}

			if (
				this.closest(".swiper")?.swiper.slides[
					this.closest(".swiper").swiper.activeIndex
				].querySelector("model-viewer")
			) {
				if (
					!this.closest(".swiper")
						.swiper.slides[
							this.closest(".swiper").swiper.activeIndex
						].querySelector("model-viewer")
						.classList.contains("shopify-model-viewer-ui__disabled")
				) {
					this.closest(".swiper").swiper.params.noSwiping = true;
					this.closest(".swiper").swiper.params.noSwipingClass = "swiper-slide";
				}
			}
		}
	}
}

customElements.define("deferred-media", DeferredMedia);

class SliderComponent extends HTMLElement {
	constructor() {
		super();
		this.slider = this.querySelector(".slider");
		this.sliderItems = this.querySelectorAll(".slider__slide");
		this.pageCount = this.querySelector(".slider-counter--current");
		this.pageTotal = this.querySelector(".slider-counter--total");
		this.prevButton = this.querySelector('button[name="previous"]');
		this.nextButton = this.querySelector('button[name="next"]');

		if (!this.slider || !this.nextButton) return;

		const resizeObserver = new ResizeObserver((entries) => this.initPages());
		resizeObserver.observe(this.slider);

		this.slider.addEventListener("scroll", this.update.bind(this));
		this.prevButton.addEventListener("click", this.onButtonClick.bind(this));
		this.nextButton.addEventListener("click", this.onButtonClick.bind(this));
	}

	initPages() {
		if (!this.sliderItems.length === 0) return;
		this.slidesPerPage = Math.floor(
			this.slider.clientWidth / this.sliderItems[0].clientWidth
		);
		this.totalPages = this.sliderItems.length - this.slidesPerPage + 1;
		this.update();
	}

	update() {
		if (!this.pageCount || !this.pageTotal) return;
		this.currentPage =
			Math.round(this.slider.scrollLeft / this.sliderItems[0].clientWidth) + 1;

		if (this.currentPage === 1) {
			this.prevButton.setAttribute("disabled", true);
		} else {
			this.prevButton.removeAttribute("disabled");
		}

		if (this.currentPage === this.totalPages) {
			this.nextButton.setAttribute("disabled", true);
		} else {
			this.nextButton.removeAttribute("disabled");
		}

		this.pageCount.textContent = this.currentPage;
		this.pageTotal.textContent = this.totalPages;
	}

	onButtonClick(event) {
		event.preventDefault();
		const slideScrollPosition =
			event.currentTarget.name === "next"
				? this.slider.scrollLeft + this.sliderItems[0].clientWidth
				: this.slider.scrollLeft - this.sliderItems[0].clientWidth;
		this.slider.scrollTo({
			left: slideScrollPosition,
		});
	}
}

customElements.define("slider-component", SliderComponent);

class VariantSelects extends HTMLElement {
	constructor() {
		super();
		this.addEventListener("change", this.onVariantChange);
		
		// Initialize variant data first
		this.getVariantData();
		
		// Initialize waitlist message and variant statuses on page load
		this.updateOptions();
		this.updateMasterId();
		this.updateWaitlistMessage();
		this.updateVariantStatuses();
		
		// Add a fallback to ensure button visibility is correct after DOM is ready
		setTimeout(() => {
			this.updateWaitlistMessage();
		}, 100);
	}

	onVariantChange() {
		this.updateOptions();
		this.updateMasterId();
		this.toggleAddButton(true, "", false);
		this.updatePickupAvailability();
		this.updateVariantStatuses();
		this.updateWaitlistMessage();

		if (!this.currentVariant) {
			this.toggleAddButton(true, "", true);
			this.setUnavailable();
		} else {
			this.updateMediaSub();
			this.updateMedia();
			this.updateURL();
			this.updateVariantInput();
			this.renderProductInfo();
			toggleGloboPreorderBox(this.currentVariant.id);
		}
	}

	updateOptions() {
		const fieldsets = Array.from(this.querySelectorAll(".js-radio-colors"));

		this.options = Array.from(
			this.querySelectorAll("select"),
			(select) => select.value
		).concat(
			fieldsets.map((fieldset) => {
				return Array.from(fieldset.querySelectorAll("input")).find(
					(radio) => radio.checked
				).value;
			})
		);
	}

	updateMasterId() {
		if (this.variantData || this.querySelector('[type="application/json"]')) {
			this.currentVariant = this.getVariantData().find((variant) => {
				this.options.sort();
				variant.options.sort();

				return !variant.options
					.map((option, index) => {
						return this.options[index] === option;
					})
					.includes(false);
			});
		}
	}

	updateMedia() {
		if (!this.currentVariant || !this.currentVariant?.featured_media) return;

		const newMedia = document.querySelector(
			`[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`
		);

		if (!newMedia) return;

		const parent = newMedia.parentElement;

		parent.prepend(newMedia);

		window.setTimeout(() => {
			parent.scroll(0, 50);
		});

		if (document.querySelector(".js-media-list")) {
			sliderInit();
		}
	}

	updateMediaSub() {
		if (!this.currentVariant || !this.currentVariant?.featured_media) return;

		const newMediaSub = document.querySelector(
			`[data-media-sub-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`
		);

		if (
			document.querySelector(".js-media-sublist") &&
			document.querySelector(".js-media-sublist").swiper != null &&
			document.querySelector(".featured-product") == null
		) {
			document.querySelector(".js-media-sublist").swiper.destroy();
		}

		if (!newMediaSub) return;

		const parentSub = newMediaSub.parentElement;

		parentSub.prepend(newMediaSub);

		window.setTimeout(() => {
			parentSub.scroll(0, 50);
		});

		if (document.querySelector(".js-media-sublist")) {
			subSliderInit();
			updatethumbnail();
		}
	}

	updateURL() {
		if (!this.currentVariant || this.dataset.updateUrl === "false") return;
		window.history.replaceState(
			{},
			"",
			`${this.dataset.url}?variant=${this.currentVariant.id}`
		);
	}

	updateVariantInput() {
		const productForms = document.querySelectorAll(
			`#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`
		);
		productForms.forEach((productForm) => {
			const input = productForm.querySelector('input[name="id"]');
			input.value = this.currentVariant.id;
			input.dispatchEvent(new Event("change", { bubbles: true }));
		});
	}

	updateVariantStatuses() {
		const inputWrappers = [...this.querySelectorAll(".product-form__input")];
		inputWrappers.forEach((option, index) => {
			if (index === 0) return;
			const optionInputs = [
				...option.querySelectorAll('input[type="radio"], option'),
			];
			
			// Get all previously selected options
			const previouslySelectedOptions = [];
			for (let i = 0; i < index; i++) {
				const selectedValue = inputWrappers[i].querySelector(":checked")?.value;
				if (selectedValue) {
					previouslySelectedOptions.push(selectedValue);
				}
			}
			
			// Filter variants that match all previously selected options and are available
			const availableOptionInputsValue = this.variantData
				.filter((variant) => {
					// Check if variant matches all previously selected options
					const matchesPreviousOptions = previouslySelectedOptions.every((selectedValue, i) => {
						return variant[`option${i + 1}`] === selectedValue;
					});
					
					// Check if variant is available and matches the current option position
					return matchesPreviousOptions && variant.available && variant[`option${index + 1}`];
				})
				.map((variantOption) => variantOption[`option${index + 1}`]);
			
			this.setInputAvailability(optionInputs, availableOptionInputsValue);
		});
	}

	setInputAvailability(listOfOptions, listOfAvailableOptions) {
		listOfOptions.forEach((input) => {
			if (listOfAvailableOptions.includes(input.getAttribute("value"))) {
				if (input.tagName === "OPTION") {
					input.innerText = input.getAttribute("value");
				} else if (input.tagName === "INPUT") {
					input.classList.remove("disabled");
				}
			} else {
				if (input.tagName === "OPTION") {
					input.innerText =
						window.variantStrings.unavailable_with_option.replace(
							"[value]",
							input.getAttribute("value")
						);
				} else if (input.tagName === "INPUT") {
					input.classList.add("disabled");
				}
			}
		});
	}

	updatePickupAvailability() {
		const pickUpAvailability = document.querySelector("pickup-availability");
		if (!pickUpAvailability) return;

		if (this.currentVariant && this.currentVariant.available) {
			pickUpAvailability.fetchAvailability(this.currentVariant.id);
		} else {
			pickUpAvailability.removeAttribute("available");
			pickUpAvailability.innerHTML = "";
		}
	}

	renderProductInfo() {
		const requestedVariantId = this.currentVariant.id;
		const sectionId = this.dataset.originalSection
			? this.dataset.originalSection
			: this.dataset.section;

		fetch(
			`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${
				this.dataset.originalSection
					? this.dataset.originalSection
					: this.dataset.section
			}`
		)
			.then((response) => response.text())
			.then((responseText) => {
				if (this.currentVariant.id !== requestedVariantId) return;

				const html = new DOMParser().parseFromString(responseText, "text/html");
				const destination = document.getElementById(
					`price-${this.dataset.section}`
				);
				const source = html.getElementById(
					`price-${
						this.dataset.originalSection
							? this.dataset.originalSection
							: this.dataset.section
					}`
				);

				const skuSource = html.getElementById(
					`Sku-${
						this.dataset.originalSection
							? this.dataset.originalSection
							: this.dataset.section
					}`
				);
				const skuDestination = document.getElementById(
					`Sku-${this.dataset.section}`
				);
				const inventorySource = html.getElementById(
					`Inventory-${
						this.dataset.originalSection
							? this.dataset.originalSection
							: this.dataset.section
					}`
				);
				const inventoryDestination = document.getElementById(
					`Inventory-${this.dataset.section}`
				);

				if (source && destination) {
					destination.innerHTML = source.innerHTML;
					
					// Also update mobile price if it exists
					const mobileDestination = document.getElementById(`price-${this.dataset.section}-mobile`);
					if (mobileDestination) {
						mobileDestination.innerHTML = source.innerHTML;
					}
				}

				if (inventorySource && inventoryDestination)
					inventoryDestination.innerHTML = inventorySource.innerHTML;
				if (skuSource && skuDestination) {
					skuDestination.innerHTML = skuSource.innerHTML;
					skuDestination.classList.toggle(
						"visibility-hidden",
						skuSource.classList.contains("visibility-hidden")
					);
				}

				const price = document.getElementById(`price-${this.dataset.section}`);
				const mobilePrice = document.getElementById(`price-${this.dataset.section}-mobile`);

				if (price) price.classList.remove("visibility-hidden");
				if (mobilePrice) mobilePrice.classList.remove("visibility-hidden");

				if (inventoryDestination)
					inventoryDestination.classList.toggle(
						"visibility-hidden",
						inventorySource.innerText === ""
					);

				const addButtonUpdated = html.getElementById(
					`ProductSubmitButton-${sectionId}`
				);

				this.toggleAddButton(
					addButtonUpdated ? addButtonUpdated.hasAttribute("disabled") : true,
					window.variantStrings.soldOut
				);

				if(typeof Globo != 'undefined' && typeof Globo.Preorder != 'undefined'){
					Globo.Preorder.initPreorder();
				}

				// Update waitlist message after DOM is updated
				this.updateWaitlistMessage();
			});
	}

	toggleAddButton(disable = true, text, modifyClass = true) {
		const productForm = document.getElementById(
			`product-form-${this.dataset.section}`
		);
		if (!productForm) return;
		const addButton = productForm.querySelector('[name="add"]');
		const addButtonText = productForm.querySelectorAll('[name="add"] > span');
		if (!addButton) return;

		if (disable) {
			addButton.setAttribute("disabled", "disabled");

			if (text) {
				addButtonText.forEach((elem) => {
					elem.innerHTML = `${text}<svg class="icon icon-cart" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 17" fill="none">
<path d="M3.25 6V4.5C3.25 3.50544 3.64509 2.55161 4.34835 1.84835C5.05161 1.14509 6.00544 0.75 7 0.75C7.99456 0.75 8.94839 1.14509 9.65165 1.84835C10.3549 2.55161 10.75 3.50544 10.75 4.5V6H13C13.1989 6 13.3897 6.07902 13.5303 6.21967C13.671 6.36032 13.75 6.55109 13.75 6.75V15.75C13.75 15.9489 13.671 16.1397 13.5303 16.2803C13.3897 16.421 13.1989 16.5 13 16.5H1C0.801088 16.5 0.610322 16.421 0.46967 16.2803C0.329018 16.1397 0.25 15.9489 0.25 15.75V6.75C0.25 6.55109 0.329018 6.36032 0.46967 6.21967C0.610322 6.07902 0.801088 6 1 6H3.25ZM3.25 7.5H1.75V15H12.25V7.5H10.75V9H9.25V7.5H4.75V9H3.25V7.5ZM4.75 6H9.25V4.5C9.25 3.90326 9.01295 3.33097 8.59099 2.90901C8.16903 2.48705 7.59674 2.25 7 2.25C6.40326 2.25 5.83097 2.48705 5.40901 2.90901C4.98705 3.33097 4.75 3.90326 4.75 4.5V6Z" fill="currentColor"/>
</svg>`;
				});
			}
		} else {
			addButton.removeAttribute("disabled");
			addButtonText.forEach((elem) => {
				elem.innerHTML = `${window.variantStrings.addToCart}<svg class="icon icon-cart" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 17" fill="none">
<path d="M3.25 6V4.5C3.25 3.50544 3.64509 2.55161 4.34835 1.84835C5.05161 1.14509 6.00544 0.75 7 0.75C7.99456 0.75 8.94839 1.14509 9.65165 1.84835C10.3549 2.55161 10.75 3.50544 10.75 4.5V6H13C13.1989 6 13.3897 6.07902 13.5303 6.21967C13.671 6.36032 13.75 6.55109 13.75 6.75V15.75C13.75 15.9489 13.671 16.1397 13.5303 16.2803C13.3897 16.421 13.1989 16.5 13 16.5H1C0.801088 16.5 0.610322 16.421 0.46967 16.2803C0.329018 16.1397 0.25 15.9489 0.25 15.75V6.75C0.25 6.55109 0.329018 6.36032 0.46967 6.21967C0.610322 6.07902 0.801088 6 1 6H3.25ZM3.25 7.5H1.75V15H12.25V7.5H10.75V9H9.25V7.5H4.75V9H3.25V7.5ZM4.75 6H9.25V4.5C9.25 3.90326 9.01295 3.33097 8.59099 2.90901C8.16903 2.48705 7.59674 2.25 7 2.25C6.40326 2.25 5.83097 2.48705 5.40901 2.90901C4.98705 3.33097 4.75 3.90326 4.75 4.5V6Z" fill="currentColor"/>
</svg>`;
			});
		}

		if (!modifyClass) return;
	}

	setUnavailable() {
		const button = document.getElementById(
			`product-form-${this.dataset.section}`
		);
		const addButton = button.querySelector('[name="add"]');
		const addButtonText = button.querySelectorAll('[name="add"] > span');
		const price = document.getElementById(`price-${this.dataset.section}`);
		const inventory = document.getElementById(
			`Inventory-${this.dataset.section}`
		);
		const sku = document.getElementById(`Sku-${this.dataset.section}`); //const price = document.getElementById(`price-${this.dataset.section}`);
		if (!addButton) return;
		addButtonText.forEach((elem) => {
			elem.innerHTML = `${window.variantStrings.unavailable}<svg class="icon icon-cart" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 17" fill="none">
<path d="M3.25 6V4.5C3.25 3.50544 3.64509 2.55161 4.34835 1.84835C5.05161 1.14509 6.00544 0.75 7 0.75C7.99456 0.75 8.94839 1.14509 9.65165 1.84835C10.3549 2.55161 10.75 3.50544 10.75 4.5V6H13C13.1989 6 13.3897 6.07902 13.5303 6.21967C13.671 6.36032 13.75 6.55109 13.75 6.75V15.75C13.75 15.9489 13.671 16.1397 13.5303 16.2803C13.3897 16.421 13.1989 16.5 13 16.5H1C0.801088 16.5 0.610322 16.421 0.46967 16.2803C0.329018 16.1397 0.25 15.9489 0.25 15.75V6.75C0.25 6.55109 0.329018 6.36032 0.46967 6.21967C0.610322 6.07902 0.801088 6 1 6H3.25ZM3.25 7.5H1.75V15H12.25V7.5H10.75V9H9.25V7.5H4.75V9H3.25V7.5ZM4.75 6H9.25V4.5C9.25 3.90326 9.01295 3.33097 8.59099 2.90901C8.16903 2.48705 7.59674 2.25 7 2.25C6.40326 2.25 5.83097 2.48705 5.40901 2.90901C4.98705 3.33097 4.75 3.90326 4.75 4.5V6Z" fill="currentColor"/>
</svg>`;
		});
		if (price) price.classList.add("visibility-hidden");
		if (inventory) inventory.classList.add("visibility-hidden");
		if (sku) sku.classList.add("visibility-hidden");
	}

	updateWaitlistMessage() {
		// Cache DOM elements to avoid repeated queries
		if (!this._cachedElements) {
			this._cachedElements = {
				waitlistMessage: document.querySelector(`#product-form-${this.dataset.section} .waitlist-message`),
				submitButton: document.querySelector(`#product-form-${this.dataset.section} .product-form__submit`)
			};
		}
		
		const { waitlistMessage, submitButton } = this._cachedElements;
		if (!waitlistMessage || !submitButton) return;

		const isSoldOut = this.currentVariant && !this.currentVariant.available;
		
		// Use the shared utility function to check if variant is limited edition
		const variantData = this.getVariantData();
		const isLimitedEdition = isVariantLimitedEdition(this.currentVariant?.id, variantData);
		
		// Hide waitlist message if variant is limited edition, otherwise show based on stock status
		const shouldShowWaitlist = isSoldOut && !isLimitedEdition;
		
		// Update waitlist message visibility
		waitlistMessage.style.display = shouldShowWaitlist ? 'block' : 'none';
		
		// Update submit button visibility
		if (shouldShowWaitlist) {
			// Hide sold out button for normal variants when waitlist is visible
			submitButton.style.display = 'none';
			submitButton.setAttribute('hidden', '');
			submitButton.classList.add('force-hidden');
		} else {
			// Show sold out button for limited edition variants or in-stock items
			submitButton.style.display = '';
			submitButton.removeAttribute('hidden');
			submitButton.classList.remove('force-hidden');
		}
	}

	getVariantData() {
		this.variantData =
			this.variantData ||
			JSON.parse(this.querySelector('[type="application/json"]').textContent);
		return this.variantData;
	}
}

customElements.define("variant-selects", VariantSelects);

class VariantRadios extends VariantSelects {
	constructor() {
		super();
	}

	setInputAvailability(listOfOptions, listOfAvailableOptions) {
		listOfOptions.forEach((input) => {
			if (listOfAvailableOptions.includes(input.getAttribute("value"))) {
				input.classList.remove("disabled");
			} else {
				input.classList.add("disabled");
			}
		});
	}

	updateOptions() {
		const fieldsets = Array.from(this.querySelectorAll("fieldset"));
		this.options = fieldsets.map((fieldset) => {
			return Array.from(fieldset.querySelectorAll("input")).find(
				(radio) => radio.checked
			).value;
		});
	}
}

customElements.define("variant-radios", VariantRadios);

class ProductModel extends DeferredMedia {
	constructor() {
		super();
	}

	loadContent() {
		super.loadContent();

		Shopify.loadFeatures([
			{
				name: "model-viewer-ui",
				version: "1.0",
				onLoad: this.setupModelViewerUI.bind(this),
			},
		]);
	}

	setupModelViewerUI(errors) {
		if (errors) return;

		this.modelViewerUI = new Shopify.ModelViewerUI(
			this.querySelector("model-viewer")
		);

		const $this = this;

		this.querySelector(".shopify-model-viewer-ui__button").addEventListener(
			"click",
			function () {
				if (
					$this
						.closest(".swiper")
						.swiper.slides[
							$this.closest(".swiper").swiper.activeIndex
						].querySelector("model-viewer")
				) {
					if (
						!$this
							.closest(".swiper")
							.swiper.slides[
								$this.closest(".swiper").swiper.activeIndex
							].querySelector("model-viewer")
							.classList.contains("shopify-model-viewer-ui__disabled")
					) {
						if (
							$this
								.querySelector(".shopify-model-viewer-ui__button")
								.hasAttribute("hidden")
						) {
							$this.closest(".swiper").swiper.params.noSwiping = true;
							$this.closest(".swiper").swiper.params.noSwipingClass =
								"swiper-slide";
						}
					}
				}
			}
		);

		this.querySelector(
			".shopify-model-viewer-ui__controls-overlay"
		).addEventListener("click", function () {
			if (
				!$this
					.querySelector(".shopify-model-viewer-ui__button")
					.hasAttribute("hidden")
			) {
				$this.closest(".swiper").swiper.params.noSwiping = false;
			}
		});
	}
}
customElements.define("product-model", ProductModel);

(function () {
	const imageMouseParallax = (options) => {
		options = options || {};
		this.nameSpaces = {
			wrapper: options.wrapper || ".parallax",
			layers: options.layers || ".parallax-layer",
			deep: options.deep || "data-parallax-deep",
		};

		this.init = function () {
			var self = this;
			var parallaxWrappers = document.querySelectorAll(this.nameSpaces.wrapper);

			for (var i = 0; i < parallaxWrappers.length; i++) {
				(function (i) {
					parallaxWrappers[i].addEventListener("mousemove", function (e) {
						var x = e.clientX;
						var y = e.clientY;
						var layers = parallaxWrappers[i].querySelectorAll(
							self.nameSpaces.layers
						);

						for (var j = 0; j < layers.length; j++) {
							(function (j) {
								var deep = layers[j].getAttribute(self.nameSpaces.deep);
								var disallow = layers[j].getAttribute("data-parallax-disallow");
								var itemX = disallow && disallow === "x" ? 0 : x / deep;
								var itemY = disallow && disallow === "y" ? 0 : y / deep;

								if (disallow && disallow === "both") return;
								layers[j].style.transform =
									"translateX(" + itemX + "%) translateY(" + itemY + "%)";
							})(j);
						}
					});
				})(i);
			}
		};
		this.init();
		return this;
	};

	document.addEventListener("shopify:section:load", imageMouseParallax);

	imageMouseParallax();
})();

/* Light header on dark bg */
(function () {
	let setLightHeader = () => {
		let articleElement = document.querySelector(".article-template");
		let headerArticle = document.querySelector(".article-template__header");
		let headerWrapper = document.querySelector(".header");
		let headerLogo =
			document.querySelector(
				".header > .header__heading-link .header__heading-logo:not(.header__heading-logo--overlay)"
			) ||
			document.querySelector(
				".header > .header__heading .header__heading-link .header__heading-logo:not(.header__heading-logo--overlay)"
			);
		let headerLogoOverlay = document.querySelector(
			".header__heading-logo--overlay"
		);

		if (headerLogoOverlay) {
			if (headerLogo) {
				headerLogo.classList.add("hide");
			}
			headerLogoOverlay.classList.add("show");
		} else {
			if (headerLogo) {
				headerLogo.classList.remove("hide");
			}
		}

		if (
			articleElement &&
			articleElement.classList.contains("section-template--overlay")
		) {
			if (headerWrapper) {
				headerWrapper.classList.add("overlay");
				headerWrapper.classList.add("theme-dark");
				headerWrapper.classList.add("header-color-background-5");
			}
		}

		let heroMedia = document.querySelector(".article-template__hero > .media");

		if (heroMedia) {
			if (heroMedia.classList.contains("article-template__hero-large")) {
				headerArticle.classList.add("article-template__header-large");
			} else {
				headerArticle.classList.remove("article-template__header-large");
			}
		}

		// Checking Interactive section
		const main = document.getElementById("MainContent");
		const sections = main.querySelectorAll(".shopify-section");
		const elementOverlay = sections[0].querySelector(".section--has-overlay");

		sections.forEach((section) => {
			const sectionFirstChild = sections[0].querySelector("div");
			if (
				sectionFirstChild && // Add null check for sectionFirstChild
				(
					(sections[0].classList.contains("section--overlay") &&
					sectionFirstChild.classList.contains("color-background-3")) ||
					sectionFirstChild.classList.contains("color-background-4") ||
					elementOverlay
				)
			) {
				headerWrapper.classList.add("overlay");
				headerWrapper.classList.add("theme-dark");
				headerWrapper.classList.add("header-color-background-5");
				if (headerLogoOverlay) {
					if (headerLogo) {
						headerLogo.classList.add("hide");
					}
					headerLogoOverlay.classList.add("show");
				} else {
					if (headerLogo) {
						headerLogo.classList.remove("hide");
					}
				}
			}
		});
	};

	document.addEventListener("shopify:section:load", function () {
		setLightHeader();
	});

	window.addEventListener("resize", function () {
		setLightHeader();
	});

	setLightHeader();
})();

// ====================== start position determination-function for logoSlideshow ======================
const events = [
	"shopify:block:deselect",
	"shopify:block:select",
	"shopify:section:reorder",
	"shopify:section:deselect",
	"shopify:section:select",
	"shopify:section:unload",
	"shopify:section:load",
	"shopify:inspector:deactivate",
	"shopify:inspector:activate",
];
(function () {
	let logoSlideshow = () => {
		let allChildNodes = document.body.childNodes;
		let sectionLogoSlideshow = document.querySelector(
			".logo-slideshow-section"
		);
		let shopifySectionHeader = document.querySelector(
			".shopify-section-header"
		);
		let sectionAnnouncement = document.querySelector(".section-announcement");
		let fixedSectionLogoSlideshow = document.querySelector(
			".logo-slideshow .fixed-section"
		);
		let sectionLogoSlideshowI;
		let shopifySectionHeaderI;
		let sectionAnnouncementI;
		for (let i = 0; i < allChildNodes.length; i++) {
			if (allChildNodes[i] == sectionLogoSlideshow) {
				sectionLogoSlideshowI = i;
			} else if (allChildNodes[i] == shopifySectionHeader) {
				shopifySectionHeaderI = i;
			} else if (allChildNodes[i] == sectionAnnouncement) {
				sectionAnnouncementI = i;
			} else {
			}
		}
		if (fixedSectionLogoSlideshow) {
			let effect = document.querySelector(".scroll-logo");
			// ====================== start position determination-function ======================
			function firstSection() {
				if (
					(sectionLogoSlideshowI < shopifySectionHeaderI &&
						sectionLogoSlideshowI < sectionAnnouncementI) ||
					sectionLogoSlideshowI < shopifySectionHeaderI ||
					sectionLogoSlideshowI < sectionAnnouncementI ||
					sectionLogoSlideshowI <= 6
				) {
					sectionLogoSlideshow.classList.add("first-logo-slideshow");
					window.addEventListener("scroll", scrollEffect);
					// ====================== start scroll-function ======================
					function scrollEffect() {
						if (effect) {
							let opacityValue = window.scrollY * 0.005;
							effect.style.opacity = 1 - opacityValue;
							if (window.scrollY >= 350) {
								effect.style.display = "none";
							} else {
								effect.style.display = "block";
							}
						}
					}
					// ====================== end scroll-function ======================

					scrollEffect();
				} else {
					sectionLogoSlideshow.classList.remove("first-logo-slideshow");
				}
			}
			// ====================== end position determination-function ======================
			firstSection();
		}
	};
	logoSlideshow();
	events.forEach(function (item) {
		document.addEventListener(item, function () {
			logoSlideshow();
		});
	});
})();

// ====================== end position determination-function for logoSlideshow ======================
// cart pdp slider js start 
document.addEventListener('DOMContentLoaded', function () {
	subscribe(PUB_SUB_EVENTS.cartUpdate, async function (e) {
		setTimeout(()=>{
		 var swiper;
	  function initializeSwiper() {
		swiper = new Swiper(".cart_pdp_slider", {
		  slidesPerView: 3.2,
		  spaceBetween: 10,
		});
	  }
	  initializeSwiper();
	  },500)
		});
	  var swiper;
	  function initializeSwiper() {
		swiper = new Swiper(".cart_pdp_slider", {
		  slidesPerView: 3.2,
		  spaceBetween: 10,
		});
	  }
	  initializeSwiper();
	  document.addEventListener('DOMContentLoaded', function () {
		const cartDrawerButton = document.querySelector('.cart-drawer-button');
		if (cartDrawerButton) {
		  cartDrawerButton.addEventListener('click', function () {
			initializeSwiper();
		  });
		}
	  });

	});
	
	// cart pdp slider js end

// Shared utility function to check if variant is limited edition
function isVariantLimitedEdition(variantId, variantData = null) {
	// Cache DOM queries
	const cachedElements = {
		variantInput: null,
		selectedColorSwatch: null,
		productInfo: null
	};
	
	// Method 1: Check variant metafields (most reliable)
	if (variantId && variantData) {
		const variant = variantData.find(v => v.id == variantId);
		if (variant) {
			const isLimitedByMetafield = variant.metafields?.custom?.limited_edition_varinats === true ||
									   variant.metafields?.custom?.limited_edition_variants === true ||
									   variant.limited_edition === true ||
									   variant.is_limited_edition === true;
			if (isLimitedByMetafield) return true;
		}
	}
	
	// Method 2: Check variant input for limited edition attributes
	if (!cachedElements.variantInput) {
		cachedElements.variantInput = document.querySelector(`input[value="${variantId}"]`);
	}
	if (cachedElements.variantInput) {
		const isLimited = cachedElements.variantInput.classList.contains('limited-edition-variant') ||
						 cachedElements.variantInput.dataset.limitedEdition === 'true' ||
						 cachedElements.variantInput.closest('[data-variant-type="limited-edition"]') ||
						 cachedElements.variantInput.getAttribute('data-variant-type') === 'limited-edition';
		if (isLimited) return true;
	}
	
	// Method 3: Check selected color swatch for variant type
	if (!cachedElements.selectedColorSwatch) {
		cachedElements.selectedColorSwatch = document.querySelector('.color-swatch-input:checked');
	}
	if (cachedElements.selectedColorSwatch) {
		const variantType = cachedElements.selectedColorSwatch.getAttribute('data-variant-type');
		if (variantType === 'limited-edition') return true;
	}
	
	// Method 4: Check product-level limited edition data
	if (!cachedElements.productInfo) {
		cachedElements.productInfo = document.querySelector('.product__info-container');
	}
	if (cachedElements.productInfo && variantData) {
		const limitedColors = cachedElements.productInfo.getAttribute('data-limited');
		if (limitedColors) {
			const variant = variantData.find(v => v.id == variantId);
			if (variant) {
				const currentColor = variant.option1;
				if (limitedColors.includes(currentColor)) return true;
			}
		}
	}
	
	// Method 5: Check for variant-specific limited edition labels
	const variantSpecificLabel = document.querySelector(`.limited-edition-variant[data-variant-id="${variantId}"] .limited-edition-label`);
	if (variantSpecificLabel) return true;
	
	return false;
}

function toggleGloboPreorderBox(variantId) {
    const globoBox = document.getElementById('Globo-Back-In-Stock');
    if (!globoBox) return;
    
    const variantData = this?.getVariantData?.() || [];
    const isLimited = isVariantLimitedEdition(variantId, variantData);
    
    globoBox.style.display = isLimited ? 'none' : 'block';
}

// Enhanced check for page load
function checkCurrentSelectedVariant() {
    const globoBox = document.getElementById('Globo-Back-In-Stock');
    if (!globoBox) return;
    
    // Try multiple methods to determine current variant
    let currentVariantId = null;
    
    // Method 1: From URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    currentVariantId = urlParams.get('variant');
    
    // Method 2: From selected variant input
    if (!currentVariantId) {
        const selectedInput = document.querySelector('input[name="id"]:checked, input[name="id"][value]');
        if (selectedInput) {
            currentVariantId = selectedInput.value;
        }
    }
    
    // Method 3: From variant selects data
    if (!currentVariantId && window.productVariants) {
        const selectedOptions = Array.from(document.querySelectorAll('select[name^="options"], input[name^="options"]:checked'))
            .map(el => el.value);
        const variant = window.productVariants.find(v => 
            v.options.every((opt, i) => opt === selectedOptions[i])
        );
        if (variant) {
            currentVariantId = variant.id;
        }
    }
    
    if (currentVariantId) {
        toggleGloboPreorderBox(currentVariantId);
    } else {
        // Default to showing the button if we can't determine variant
        globoBox.style.display = 'block';
    }
}

// Also call after DOM is ready and after variant changes
document.addEventListener('DOMContentLoaded', function() {
    // Initial check
    setTimeout(checkCurrentSelectedVariant, 100);
    
    // Also check after a delay to ensure Globo button is loaded
    setTimeout(checkCurrentSelectedVariant, 1000);
    
    // Set up a mutation observer to handle dynamic content changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === 1 && (node.id === 'Globo-Back-In-Stock' || node.querySelector?.('#Globo-Back-In-Stock'))) {
                        setTimeout(checkCurrentSelectedVariant, 100);
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


// Preorder box show in variant End

const breakpoints = {
	mobile: 1200,
	tablet: 1500
  };
  if (!customElements.get("e-iconwithtext")) {
	  class EIconWithText extends HTMLElement {
		  constructor() {
			  super();
			  this.showMobileSlider = this.dataset.showMobileSlider === "true";
			  this.breakpoints = window.matchMedia('(max-width: 1400px)');
		  }
		  connectedCallback() {
			  this.initializeComponent();
		  }
		  initializeComponent() {
			  this.updateSwiperClasses();
			  this.breakpoints.addEventListener('change', () => this.updateSwiperClasses());
			  window.addEventListener('resize', () => this.updateSwiperClasses());
		  } 
		  updateSwiperClasses() {
			  const container = this.querySelector('.grid-boxes');
			  if (!container) return;
  
			  const items = this.querySelectorAll('.grid-box.grid__item');
			  if (this.showMobileSlider && this.breakpoints.matches) {
				  container.classList.add('swiper-wrapper');
				  items.forEach(item => item.classList.add('swiper-slide'));
				  this.initializeSwiper();
			  } else {
				  container.classList.remove('swiper-wrapper');
				  items.forEach(item => item.classList.remove('swiper-slide'));
			  }
		  }
		  initializeSwiper() {
			  new Swiper(".icon-with-text-slider", {
				pagination: {
				  el: ".swiper-pagination",
				},
			  });
		  }
	  }
	  customElements.define("e-iconwithtext", EIconWithText);
  }
