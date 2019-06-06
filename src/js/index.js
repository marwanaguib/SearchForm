import '../styles'
//// form filter
function FilterForm(formElement, itemsClass) {
	this.form = document.querySelector(formElement) // get form element by id = formElement
	this.itemsClassName = itemsClass; // class name for articles to be filtered
	this.values = []; // array will store on it user selections
	this._constructor(); // call function on form init
}

FilterForm.prototype._constructor = function () {
	this._submitForm() // bind submit event to form
}


FilterForm.prototype._submitForm = function () {
	const _this = this;
	this.form.onsubmit = function (e) {
		e.preventDefault();
		_this._resetValues(); // empty values array
		_this._getFieldsValues(); // store all user selections in values array
		_this._filterItems(); // filter articles with values array
		console.log(_this.values)
	}
}


FilterForm.prototype._resetValues = function () { // empty values array
	this.values.splice(0, this.values.length);
}


FilterForm.prototype._getFieldsValues = function () { // store all user selections in values array
	const _this = this;
	[...this.form.elements].forEach((item) => { // foreach field in the form
		if (item.type.includes('radio') || item.type.includes('checkbox')) {
			// add all checkboxes with same data-filter to one object in values array
			if (item.type.includes('checkbox')) {
				if (item.checked) {
					if (!_this.values.find((x) => x.type == item.getAttribute('data-filter'))) {
						_this.values.push({
							id: "checkboxElement",
							type: item.getAttribute('data-filter'),
							value: item.value
						});
					} else {
						_this.values.find((x) => x.type == item.getAttribute('data-filter')).value = _this.values.find((x) => x.type == item.getAttribute('data-filter')).value + "," + item.value;
					}
				}
			} else {
				// if radio input is checked add it to values array
				if (item.checked) {
					_this.values.push({
						id: item.getAttribute('id'),
						type: item.getAttribute('data-filter'),
						value: item.value
					});
				}
			}
		} else if (item.type != "submit") {
			// if textbox or textarea has value add it to values array
			if (item.value != "")
				_this.values.push({
					id: item.getAttribute('id'),
					type: item.getAttribute('data-filter'),
					value: item.value
				});
		}
	})
}


FilterForm.prototype._filterItems = function () {
	const _this = this;
	[...document.querySelectorAll(_this.itemsClassName)].forEach((item) => {
		if (_this.values.every((x) => {
				if (x.id == "checkboxElement") {
					// if it's checkbox then split attribute value and display article if value has any of checked items
					return item.getAttribute(x.type).split(',').some(y => x.value.split(',').includes(y.trim()))
				} else {
					return item.getAttribute(x.type).toLowerCase().includes(x.value.toLowerCase())
				}
			})) {
			item.style.display = "block"
		} else {
			item.style.display = "none"
		}
	})
}

var filterForm = new FilterForm('#filterForm', '.filterItems')