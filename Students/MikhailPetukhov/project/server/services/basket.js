module.exports = {
	add(item, array) {
		array.push(item);
		return array;
	},
	change(id, array, amount) {
		let find = this._find(id, array);
		find.quantity += amount;
		return array;
	},
	delete(id, array) {
		let find = this._find(id, array);
		array.splice(array.indexOf(find), 1);
		return array;
	},
	_find(id, array) {
		return array.find(item => item.id == id);
	}
};