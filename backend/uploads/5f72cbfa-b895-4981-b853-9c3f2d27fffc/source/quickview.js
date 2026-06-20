$(document).ready(function () {
	quickView();
});

function quickView() {
	$(".quick-view").click(function (e) {
		let content;
		e.preventDefault();
		
		var product_handle = $(this).data("handle");
		$("#quick-view").addClass(product_handle);
		$.ajax({
			url: "/products/" + product_handle,
		}).done(function (text) {
			const newDiv = document.createElement("div");
			newDiv.innerHTML = text;

			$(newDiv).find(".product__additional-wrapper").remove();
			$(newDiv).find(".share-buttons").remove();
			$(newDiv).find(".product__pickup-availabilities").remove();
			$(newDiv).find(".pickup-availability-preview").remove();
			$(newDiv).find(".product__text").remove();
			$(newDiv).find(".product__tags").remove();
			$(newDiv).find(".product__info-wrapper .modals").remove();
			$(newDiv).find(".js-media-sublist").remove();
			$(newDiv).find(".product__media-toggle").remove();
			$(newDiv).find(".product__media-icon").remove();
			$(newDiv).find(".product-recommendations--single").remove();
			let scripts = $(newDiv).find("script");

			for (let i = 0; i < scripts.length; i++) {
				let source = "" + $(scripts[i]).attr("src");

				if (source) {
					if (
						source.indexOf("copy.js") > -1 ||
						source.indexOf("pickup-availability.js") > -1
					) {
						$(scripts[i]).remove();
					}
				}
			}

			$(newDiv).find(".product-form__submit").addClass("button--secondary");

			content = $(newDiv).find(".product-section");
			$("#quick-view .qv-wrapper").append(content);
		});
	});
}

document.addEventListener("shopify:section:load", function () {
	quickView();
});
