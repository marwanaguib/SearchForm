//// form filter
function FilterForm(formElement,itemsClass) {
	this.form = document.querySelector(formElement)
	this.values = [];
	this.itemsClassName = itemsClass;
	this._constructor()
}

FilterForm.prototype._constructor = function () {
	this._submitForm() // bind submit event to form
}


FilterForm.prototype._submitForm = function () {
	const _this = this;
	this.form.onsubmit = function (e) {
		e.preventDefault();
		_this._getFieldsValues()
		console.log(_this.values)
		_this._filterItems();
	}
}


FilterForm.prototype._getFieldsValues = function () {
	const _this = this;
	[...this.form.elements].forEach((item, index) => {
		if (item.type.includes('select') || item.type.includes('radio') || item.type.includes('checkbox')) {
			// if (item.type.includes('checkbox')) {
				if (item.checked) {
					if (!_this.values.find((x) => x.id == item.getAttribute('id')))
						_this.values.push({
							id: item.getAttribute('id'),
							type: item.getAttribute('data-filter'),
							value: item.value
						});
				} else {
					if (_this.values.find((x) => x.id == item.getAttribute('id')))
						_this.values.splice(_this.values.indexOf(_this.values.find((x) => x.id == item.getAttribute('id'))), 1)
				}
			// }
		} else if (item.type != "submit") {
			if (!_this.values.find((x) => x.id == item.getAttribute('id'))) {
				if (item.value != "")
					_this.values.push({
						id: item.getAttribute('id'),
						type: item.getAttribute('data-filter'),
						value: item.value
					});
			} else {
				if (item.value != "")
					_this.values.find((x) => x.id == item.getAttribute('id')).value = item.value
				else
					_this.values.splice(_this.values.indexOf(_this.values.find((x) => x.id == item.getAttribute('id'))), 1)
			}
		}
	})
}


FilterForm.prototype._filterItems = function () {
	const _this = this;
	[...document.querySelectorAll(_this.itemsClassName)].forEach((item)=>{
		// console.log(_this.values.some((x)=>item.getAttribute(x.type).includes(x.value)))
		if(_this.values.every((x)=>item.getAttribute(x.type).toLowerCase().includes(x.value.toLowerCase()))){
			item.style.display = "block"
		}else{
			item.style.display = "none"
		}
	}
	)
}

var filterForm = new FilterForm('#filterForm','.filterItems')