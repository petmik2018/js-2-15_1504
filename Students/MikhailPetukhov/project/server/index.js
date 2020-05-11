let express = require('express');
let fs = require('fs');
let writer = require('./utils/writer.js');
let catalog = require('./services/catalog.js');
let basket = require('./services/basket.js');

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

server.post('/basket/add', (req, res) => {
    fs.readFile('./server/db/basket.json', 'utf-8', (err, data) => {
        if(!err) {
            let dataBasket = JSON.parse(data);
            let search = JSON.parse(JSON.stringify(req.body));
            let find = dataBasket.find (product => product.id == search.id);

            if (find) {
				find.quantity++;
            } else {
	            search.quantity = 1;
	            dataBasket.push(search);
            }         
            fs.writeFile('./server/db/basket.json', JSON.stringify(dataBasket, null, ' '), err => {
                if(err) {
                    console.log(err);
                }
            })
        }
    })
});

server.post('/basket/remove', (req, res) => {
    fs.readFile('./server/db/basket.json', 'utf-8', (err, data) => {
        if(!err) {
            let dataBasket = JSON.parse(data);
            let search = req.body;
            let find = dataBasket.find (product => product.id == search.id);
            
            if (find.quantity > 1) {
					find.quantity--;
                } else {
					dataBasket.splice (dataBasket.indexOf(find), 1);
                }            
            fs.writeFile('./server/db/basket.json', JSON.stringify(dataBasket, null, ' '), err => {
                if(err) {
                    console.log(err);
                }
            })
        }
    })
});

server.post('/basket', (req, res) => {
	//добавление нового товара
    fs.readFile('./server/db/basket.json', 'utf-8', (err, data) => {
        if(!err) {        	
            let newBasket = basket.add(req.body, JSON.parse(data));
            writer('./server/db/basket.json', JSON.stringify(newBasket, null, ' '))
	            .then(report => {
	            	if (report) {
	            		res.json({ status: 1 });
	            	}
	            });
        }
    })
});

server.delete('/basket/:id', (req, res) => {
	//удаление товара
});

server.put('/basket/:id', (req, res) => {
	//Изменение количества товара
});


server.listen(3000, () => {
	console.log("Server runs at 3000...");
});
