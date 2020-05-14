let express = require('express');
let fs = require('fs');
let writer = require('./utils/writer.js');
let catalog = require('./services/catalog.js');
let basket = require('./services/basket.js');
let logger = require('./utils/logger.js');
let server = express();

server.use(express.json());

// Production
// server.use('/', express.static('server/public'));

// HTML

server.get('/catalog', (request, response) => {
	fs.readFile('./server/db/catalog.json', 'utf-8', (err, data) => {
		if (!err) {
			response.send(data);
		}
	})
});

server.get('/basket', (request, response) => {

	fs.readFile('./server/db/basket.json', 'utf-8', (err, data) => {
		if (!err) {
			response.send(data);
		}
	})
});

server.post('/catalog', (req, res) => {
    fs.readFile('./server/db/catalog.json', 'utf-8', (err, data) => {
        if(!err) {        	
            let { newCatalog, id } = catalog.add(req.body, JSON.parse(data));
            writer('./server/db/catalog.json', JSON.stringify(newCatalog, null, ' '))
	            .then(report => {
	            	if (report) {
	            		res.json({ id: id });
	            	}
	            });
        }
    })
});


server.post('/basket', (req, res) => {
	//добавление нового товара
    fs.readFile('./server/db/basket.json', 'utf-8', (err, data) => {
        if(!err) {        	
            let  { newBasket, itemName } = basket.add(req.body, JSON.parse(data));
            writer('./server/db/basket.json', JSON.stringify(newBasket, null, ' '))
	            .then(report => {
	            	if (report) {
	            		logger('add', itemName);
	            		res.json({ status: 1 });
	            	}
	            });
        }
    });
});

server.delete('/basket/:id', (req, res) => {
	//удаление товара
    fs.readFile('./server/db/basket.json', 'utf-8', (err, data) => {
        if(!err) {        	
            let  { newBasket, itemName } = basket.delete(req.params.id, JSON.parse(data));
            writer('./server/db/basket.json', JSON.stringify(newBasket, null, ' '))
	            .then(report => {
	            	if (report) {
	            		logger('delete', itemName);
	            		res.json({ status: 1 });
	            	}
	            });
        }
    });
});

server.put('/basket/:id', (req, res) => {
	//Изменение количества товара
    fs.readFile('./server/db/basket.json', 'utf-8', (err, data) => {
        if(!err) {    
            let { newBasket, itemName, actionName } = basket.change(req.params.id, JSON.parse(data), req.body.amount);
            writer('./server/db/basket.json', JSON.stringify(newBasket, null, ' '))
	            .then(report => {
	            	if (report) {
	            		logger(actionName, itemName);
	            		res.json({ status: 1 });
	            	}
	            });
        }
    });
});


server.listen(3000, () => {
	console.log("Server runs at 3000...");
});
