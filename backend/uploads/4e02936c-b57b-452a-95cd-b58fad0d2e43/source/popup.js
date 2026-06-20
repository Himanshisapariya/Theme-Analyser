"use strict";

jQuery(document).ready(function ($) {
	var adpPopup = {};

	(function () {
		var $this;

		adpPopup = {
			sPrevious: window.scrollY,
			sDirection: "down",

			
			init: function (e) {
				$this = adpPopup;

				$this.popupInit(e);

				$this.events(e);
			},

			
			events: function (e) {
				$(document).on("click", ".popup-close", $this.closePopup);
				$(document).on("click", ".popup-accept", $this.acceptPopup);
				$(document).on("click", ".popup-accept", $this.closePopup);
				$(document).on(
					"click",
					".age-verification__popup-close",
					$this.agePopup
				);
				$(document).on(
					"click",
					".age-verification__popup-close",
					$this.closePopup
				);
				$(document).on(
					"click",
					".age-verification__button-no",
					$this.ageDeclined
				);

				$(document).keyup(function (e) {
					if (e.key === "Escape") {
						$('.popup-open[data-esc-close="true"]').each(function (
							index,
							popup
						) {
							$this.closePopup(popup);
						});
					}

					if (e.key === "F4") {
						$('.popup-open[data-f4-close="true"]').each(function (
							index,
							popup
						) {
							$this.closePopup(popup);
						});
					}
				});

				$(document).on("click", ".popup-overlay", function (e) {
					$('.popup-open[data-overlay-close="true"]').each(function (
						index,
						popup
					) {
						$this.closePopup(popup);
					});
				});
			},

			
			popupInit: function (e) {
				$(document).on("scroll", function () {
					let scrollCurrent = window.scrollY;

					if (scrollCurrent > $this.sPrevious) {
						$this.sDirection = "down";
					} else {
						$this.sDirection = "up";
					}

					$this.sPrevious = scrollCurrent;
				});

				$(".popup").each(function (index, popup) {
					if ("manual" === $(popup).data("open-trigger")) {
						let selector = $(popup).data("open-manual-selector");

						if (selector) {
							$(selector).addClass("popup-trigger");

							$(document).on("click", selector, function (e) {
								e.preventDefault();

								$(popup).removeClass("popup-already-opened");

								$this.openPopup(popup);

								if (e.currentTarget.classList.contains("popup")) {
									$this.closePopup(selector);
								}
							});
						}
					}

					if (
						!$this.isAllowPopup(popup) &&
						!$(popup).hasClass("age-verification")
					) {
						return;
					}

					$this.openTriggerPopup(popup);
				});
			},

			
			openTriggerPopup: function (e) {
				let popup = e.originalEvent ? this : e;

				var trigger = $(popup).data("open-trigger");

				if ("none" === trigger) {
					let ageVerification = $this.getCookie(
						"popup-age-" + $(popup).data("id") || 0
					);

					if (!ageVerification) $this.openPopup(popup);
				}

				if ("delay" === trigger) {
					setTimeout(function () {
						$this.openPopup(popup);
					}, $(popup).data("open-delay-number") * 1000);
				}

				if ("exit" === trigger) {
					var showExit = true;
					document.addEventListener("mousemove", function (e) {
						var scroll =
							window.pageYOffset || document.documentElement.scrollTop;
						if (e.pageY - scroll < 7 && showExit) {
							$this.openPopup(popup);
							showExit = false;
						}
					});
				}

				if ("scroll" === trigger) {
					var pointScrollType = $(popup).data("open-scroll-type");
					var pointScrollPosition = $(popup).data("open-scroll-position");

					$(document).on("scroll", function () {
						if ("px" === pointScrollType) {
							if (window.scrollY >= pointScrollPosition) {
								$this.openPopup(popup);
							}
						}

						if ("%" === pointScrollType) {
							if ($this.getScrollPercent() >= pointScrollPosition) {
								$this.openPopup(popup);
							}
						}
					});
				}

				if ("accept" === trigger) {
					let accept = $this.getCookie(
						"popup-accept-" + $(popup).data("id") || 0
					);

					if (!accept) {
						$this.openPopup(popup);
					}
				}
			},

			
			closeTriggerPopup: function (e) {
				let popup = e.originalEvent ? this : e;

				var trigger = $(popup).data("close-trigger");

				if ("delay" === trigger) {
					setTimeout(function () {
						$this.closePopup(popup);
					}, $(popup).data("close-delay-number") * 1000);
				}

				if ("scroll" === trigger) {
					var pointScrollType = $(popup).data("close-scroll-type");
					var pointScrollPosition = $(popup).data("close-scroll-position");
					var initScrollPx = $(popup).data("init-scroll-px");
					var initScrollPercent = $(popup).data("init-scroll-percent");

					$(document).on("scroll", function () {
						if ("px" === pointScrollType) {
							if (
								"up" === $this.sDirection &&
								window.scrollY < initScrollPx - pointScrollPosition
							) {
								$this.closePopup(popup);
							}

							if (
								"down" === $this.sDirection &&
								window.scrollY >= initScrollPx + pointScrollPosition
							) {
								$this.closePopup(popup);
							}
						}

						if ("%" === pointScrollType) {
							if (
								"up" === $this.sDirection &&
								$this.getScrollPercent() <
									initScrollPercent - pointScrollPosition
							) {
								$this.closePopup(popup);
							}

							if (
								"down" === $this.sDirection &&
								$this.getScrollPercent() >=
									initScrollPercent + pointScrollPosition
							) {
								$this.closePopup(popup);
							}
						}
					});
				}
			},

			
			openPopup: function (e) {
				let popup = e.originalEvent ? this : e;

				if ($(popup).is('[data-body-scroll-disable="true"]')) {
					$("body").addClass("popup-scroll-hidden");
				}

				let limit =
					parseInt($this.getCookie("popup-" + $(popup).data("id")) || 0) + 1;

				$this.setCookie("popup-" + $(popup).data("id"), limit, {
					expires: $(popup).data("limit-lifetime"),
				});

				if ($(popup).hasClass("popup-open")) {
					return;
				}

				if ($(popup).hasClass("popup-already-opened")) {
					return;
				}

				$(popup).addClass("popup-open");

				$(popup).data("init-scroll-px", window.scrollY);
				$(popup).data("init-scroll-percent", $this.getScrollPercent());

				let animation = $(popup).data("open-animation");

				$this.applyAnimation(popup, animation);

				$this.closeTriggerPopup(popup);
			},

			
			agePopup: function (e) {
				let $el = e.originalEvent ? this : e;

				let popup = $($el).closest(".popup");

				$this.setCookie("popup-age-" + $(popup).data("id"), 1, {
					expires: 360,
				});
			},

			

			ageDeclined: function () {
				$(".age-verification__question").removeClass("show");
				$(".age-verification__declined").addClass("show");
			},

			
			acceptPopup: function (e) {
				let $el = e.originalEvent ? this : e;

				let popup = $($el).closest(".popup");

				$this.setCookie("popup-accept-" + $(popup).data("id"), 1, {
					expires: 360,
				});
			},

			
			closePopup: function (e) {
				let $el = e.originalEvent ? this : e;

				let popup = $($el).closest(".popup");

				let animation = $(popup).data("exit-animation");

				$this.applyAnimation(popup, animation, function () {
					$(popup).addClass("popup-already-opened");

					$(popup).removeClass("popup-open");

					$("body").removeClass("popup-scroll-hidden");
				});
			},

			
			isAllowPopup: function (e) {
				let popup = e.originalEvent ? this : e;

				let limitDisplay = parseInt($(popup).data("limit-display") || 0);

				let limitDisplayCookie = parseInt(
					$this.getCookie("popup-" + $(popup).data("id"))
				);

				if (
					limitDisplay &&
					limitDisplayCookie &&
					limitDisplayCookie >= limitDisplay
				) {
					return;
				}

				return true;
			},

			
			applyAnimation: function (el, name, callback) {
				var popup = $(el).closest(".popup");

				if (typeof callback === "function") {
					var overlayName = "popupExitFade";
				} else {
					var overlayName = "popupOpenFade";
				}

				$(popup)
					.next(".popup-overlay")
					.addClass("popup-animated " + overlayName)
					.one(
						"webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
						function () {
							$(this).removeClass("popup-animated " + overlayName);
						}
					);

				$(popup)
					.find(".popup-wrap")
					.addClass("popup-animated " + name)
					.one(
						"webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
						function () {
							$(this).removeClass("popup-animated " + name);

							if (typeof callback === "function") {
								callback();
							}
						}
					);
			},

			
			getCookie: function (name) {
				var matches = document.cookie.match(
					new RegExp(
						"(?:^|; )" +
							name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
							"=([^;]*)"
					)
				);
				return matches ? decodeURIComponent(matches[1]) : undefined;
			},

			
			setCookie: function (name, value, options) {
				options = options || {};

				options.path = options.hasOwnProperty("path") ? options.path : "/";

				options.expires = parseInt(options.expires);

				if (typeof options.expires == "number" && options.expires) {
					options.expires = new Date().setDate(
						new Date().getDate() + options.expires
					);

					options.expires = new Date(options.expires).toUTCString();
				}

				value = encodeURIComponent(value);

				var updatedCookie = name + "=" + value;

				for (var propName in options) {
					updatedCookie += "; " + propName;
					var propValue = options[propName];
					if (propValue !== true) {
						updatedCookie += "=" + propValue;
					}
				}

				document.cookie = updatedCookie;
			},

			
			getScrollPercent: function () {
				var h = document.documentElement,
					b = document.body,
					st = "scrollTop",
					sh = "scrollHeight";
				return ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
			},
		};
	})();

	adpPopup.init();

	document.addEventListener("shopify:section:load", function () {
		adpPopup.init();
	});

	document.addEventListener("shopify:section:unload", function () {
		$("body").removeClass("popup-scroll-hidden");
	});
});
