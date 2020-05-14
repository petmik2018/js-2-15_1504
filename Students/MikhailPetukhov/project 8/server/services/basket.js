module.exports = {
	add(item, basket) {
		basket.push(item);
		return { newBasket: basket, itemName: item.name };
	},
	change(id, basket, amount) {
		let find = this._find(id, basket);
		find.quantity += amount;
		return { newBasket: basket, itemName: find.name, actionName: amount > 0 ? 'add' : 'remove' };
	},
	delete(id, basket) {
		let find = this._find(id, basket);
		basket.splice(basket.indexOf(find), 1);
		return { newBasket: basket , itemName: find.name};
	},
	_find(id, array) {
		return array.find(item => item.id == id);
	}
};