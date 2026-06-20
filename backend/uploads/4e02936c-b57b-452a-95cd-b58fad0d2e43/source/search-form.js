class SearchForm extends HTMLElement {
	constructor() {
		super();
		this.input = this.querySelector('input[type="search"]');

		if (this.input) {
			this.input.form.addEventListener("reset", this.onFormReset.bind(this));
			this.input.addEventListener(
				"input",
				debounce((event) => {
					this.onChange(event);
				}, 300).bind(this)
			);
		}
	}

	shouldResetForm() {
		return !document.querySelector('[aria-selected="true"] a');
	}

	onFormReset(event) {
		event.preventDefault();
		if (this.shouldResetForm()) {
			this.input.value = "";
			this.input.focus();
		}
	}
}

customElements.define("search-form", SearchForm);
