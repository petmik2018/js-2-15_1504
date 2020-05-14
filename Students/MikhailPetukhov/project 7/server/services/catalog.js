module.exports = {
	add(item, array) {
		let newObject = JSON.parse(JSON.stringify(item));
        newObject.id = Date.now();
        array.push(newObject);
        return { newCatalog: array, newId: newObject.id };
	}
};