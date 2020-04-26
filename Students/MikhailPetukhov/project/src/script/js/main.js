 //ИМИТАЦИЯ РАБОТЫ БАЗЫ ДАННЫХ И СЕРВЕРА

 class Catalog {
    constructor(cart) {
        this.items = [];
        this.container = '.products';
        this.cart = cart;
        this._init();
    }

    _init () {
        this._handleRequest()
    }

    _handleEvents () {
        document.querySelector (this.container).addEventListener ('click', (evt) => {
            if (evt.target.name === 'buy-btn') {
                this.cart.addProduct (evt.target)
            }
        })
    }

    _getData(reqUrl) {
         return new Promise((res, rej) => {
            let req = new XMLHttpRequest(); //если не считаем IE
            req.open('GET', reqUrl, true); 
                    
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    if(req.status == 200) {
                        res(JSON.parse(req.responseText));
                    } else {
                        rej('error');
                    }
                }
            };
            req.send(); 
        }) 
    }

    _handleRequest() {
        console.log("request started");
        let url = 'https://raw.githubusercontent.com/petmik2018/shop_data/master/products/products.json';
        this._getData(url)
            .then(data => {          
                this.items = data;
                console.log(this.items);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                console.log("request completed");
                this.render ();
                this._handleEvents ();
            })
    } 


    render () {
        let str = ''
        this.items.forEach (item => {
            str += `
                <div class="product-item">
                    <img src="${item.image_link}" alt="${item.name}">
                    <!--img src="${item.image_link}" width="300" height="200" alt="${item.name}"-->
                    <div class="desc">
                        <h1>${item.name}</h1>
                        <p>${item.price}</p>
                        <button 
                        class="buy-btn" 
                        name="buy-btn"
                        data-name="${item.name}"
                        data-price="${item.price}"
                        data-id="${item.id}"
                        >Купить</button>
                    </div>
                </div>
            `
        })
        document.querySelector(this.container).innerHTML = str
     }
 }

 class Cart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.sum = 0;
        this.container = '.cart-block';
        this.quantityBlock = document.querySelector ('#quantity');
        this.priceBlock = document.querySelector ('#price');
        this._init ();
    }
    
    _init () {
        this._handleEvents ()
    }

    _handleEvents () {
        document.querySelector (this.container).addEventListener ('click', (evt) => {
            if (evt.target.name === 'del-btn') {
                this.deleteProduct (evt.target)
            }
        })
    }

    addProduct (product) {
        let id = product.dataset['id']
        let find = this.items.find (product => product.id === id)
        if (find) {
            find.quantity++
        } else {
            let prod = this._createNewProduct (product)
            this.items.push (prod)
        }
         
        this._checkTotalAndSum ()
        this.render ()
    }

    _createNewProduct (prod) {
        return {
            product_name: prod.dataset['name'],
            price: prod.dataset['price'],
            id_product: prod.dataset['id'],
            quantity: 1
        }
    }

    deleteProduct (product) {
        let id = product.dataset['id']
        let find = this.items.find (product => product.id_product === id)
        if (find.quantity > 1) {
            find.quantity--
        } else {
            this.items.splice (this.items.indexOf(find), 1)
        }
         
        this._checkTotalAndSum ()
        this.render ()
    }
    
    _checkTotalAndSum () {
        let qua = 0
        let pr = 0
        this.items.forEach (item => {
            qua += item.quantity
            pr += item.price * item.quantity
        })
        this.total = qua
        this.sum = pr
    }

    render () {
        let itemsBlock = document.querySelector (this.container).querySelector ('.cart-items')
        let str = ''
        this.items.forEach (item => {
            str += `<div class="cart-item" data-id="${item.id_product}">
                    <img src="https://placehold.it/100x80" alt="">
                    <div class="product-desc">
                        <p class="product-title">${item.product_name}</p>
                        <p class="product-quantity">${item.quantity}</p>
                        <p class="product-single-price">${item.price}</p>
                    </div>
                    <div class="right-block">
                        <button name="del-btn" class="del-btn" data-id="${item.id_product}">&times;</button>
                    </div>
                </div>`
        })
        itemsBlock.innerHTML = str
        this.quantityBlock.innerText = this.total
        this.priceBlock.innerText = this.sum
    }
 }
 
export default function app() {
    let cart = new Cart()  
    let catalog = new Catalog(cart)//тут происходит создание объекта и вся прочая магия
 
 }

