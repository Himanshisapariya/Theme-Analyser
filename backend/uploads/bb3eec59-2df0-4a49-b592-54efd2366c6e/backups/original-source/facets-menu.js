const facetsMenu = () => {
	$("html.js .no_submit").click(function (e) {
		e.preventDefault();
	});

	// fix - #562: track opener to return focus on close
	let filterOpener = null;

	const openFilterMenu = (triggerEl) => {
		filterOpener = triggerEl || null;
		$("#open_filters_menu").addClass("show_menu");
		$("body").addClass("overflow-hidden").addClass("open-filters");
		$(".shopify-section-header").addClass("low_index");
		$(".section-announcement").addClass("low_index");
		const closeBtn = document.querySelector(".facets-menu__close");
		if (closeBtn) closeBtn.focus();
	};

	const closeFilterMenu = () => {
		$("#open_filters_menu").removeClass("show_menu");
		$("body").removeClass("overflow-hidden").removeClass("open-filters");
		$(".shopify-section-header").removeClass("low_index");
		$(".section-announcement").removeClass("low_index");
		if (filterOpener) { filterOpener.focus(); filterOpener = null; }
	};

	$(".open_filters").click(function () {
		if ($("#open_filters_menu").hasClass("show_menu")) {
			closeFilterMenu();
		} else {
			openFilterMenu(this);
		}
	});

	$(".facets-menu__close,.facets__submit,.facets__reset,.form-menu__mask").click(function () {
		closeFilterMenu();
	});

	// fix - #561: trap focus inside modal while open
	const filterModal = document.querySelector('.facets-menu');
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') {
			if ($("#open_filters_menu").hasClass("show_menu")) { closeFilterMenu(); e.preventDefault(); }
			return;
		}
		if (e.key !== 'Tab' || !filterModal || !$("#open_filters_menu").hasClass("show_menu")) return;
		const focusable = Array.from(filterModal.querySelectorAll(
			'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
		)).filter(el => el.offsetParent !== null);
		if (!focusable.length) { e.preventDefault(); return; }
		const first = focusable[0], last = focusable[focusable.length - 1];
		if (!filterModal.contains(document.activeElement)) {
			e.preventDefault(); first.focus(); return;
		}
		if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
		else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
	});
};

document.addEventListener("DOMContentLoaded", function () {
	facetsMenu();
});
document.addEventListener("shopify:section:load", function () {
	facetsMenu();
});

let menu = document.querySelector(".facets-menu");

document
	.querySelector(".select__sort_by")
	.addEventListener("click", function () {
		document
			.querySelector(".facets__sort-by svg")
			.classList.toggle("rotateSvg");
	});
