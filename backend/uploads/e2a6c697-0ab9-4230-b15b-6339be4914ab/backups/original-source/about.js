(function () {
	const initProductAccordion = () => {
		$(".about__accordion-title").click(function () {
			if (!$(this).hasClass("active")) {
				$(".about__accordion-title.active").removeClass("active");
				$(this).addClass("active");
				$(".about__accordion-description").stop().slideUp(300);
				$(this)
					.siblings(".about__accordion-description")
					.eq($(this).index())
					.stop()
					.slideDown(300);
			} else {
				$(this).removeClass("active");
				$(this).siblings(".about__accordion-description").stop().slideUp(300);
			}
		});
	};

	document.addEventListener("shopify:section:load", function () {
		initProductAccordion();
	});

	initProductAccordion();
})();
