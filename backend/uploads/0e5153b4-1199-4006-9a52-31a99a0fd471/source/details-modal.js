class DetailsModal extends HTMLElement {
	constructor() {
		super();
		this.toggleButton = this.querySelector("button.modal__toggle");
		this.modal = this.querySelector('[role="dialog"]');

		if (!this.toggleButton || !this.modal) return;

		this.toggleButton.addEventListener(
			"keyup",
			(event) => event.code === "ESCAPE" && this.close()
		);
		this.toggleButton.addEventListener(
			"click",
			this.onToggleClick.bind(this)
		);

		this.querySelectorAll('button[type="button"]:not(.modal__toggle)').forEach((e) => {
			e.addEventListener("click", this.close.bind(this));
		});
	}

	isOpen() {
		return !this.modal.hasAttribute("hidden");
	}

	onToggleClick(event) {
		event.preventDefault();
		this.isOpen() ? this.close() : this.open(event);
	}

	onBodyClick(event) {
		if (
			document
				.querySelector("header")
				.classList.contains("search-header--opened")
		) {
			return;
		}
		if (!this.contains(event.target)) this.close(false);
	}

	open(event) {
		this.onBodyClickEvent =
			this.onBodyClickEvent || this.onBodyClick.bind(this);
		this.modal.removeAttribute("hidden");
		this.toggleButton.setAttribute("aria-expanded", "true");
		document.body.addEventListener("click", this.onBodyClickEvent);

		trapFocus(
			this.modal.querySelector('[tabindex="-1"]'),
			this.modal.querySelector('input:not([type="hidden"])')
		);
	}

	close(focusToggle = true) {
		removeTrapFocus(focusToggle ? this.toggleButton : null);
		this.modal.setAttribute("hidden", "");
		this.toggleButton.setAttribute("aria-expanded", "false");
		document.body.removeEventListener("click", this.onBodyClickEvent);
		document.body.classList.remove("overflow-hidden");
		document.body.classList.remove("search-overflow-hidden");
	}
}

customElements.define("details-modal", DetailsModal);