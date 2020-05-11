<template>
     <div class="cart-block">
        <div class="d-flex">
            <strong class="d-block">Всего товаров</strong> <div id="quantity">{{ computedSummary.quantity }}</div>
        </div>
        <hr>

        <item
          	v-for="item of items"
        	:item="item"
        	:key="item.id"
        	:type="'basket'"
        	@remove="remove"
        />

        <hr>

        <div class="d-flex">
            <strong class="d-block">Общая ст-ть:</strong> <div id="amount">{{ computedSummary.amount }}</div>
        </div>
    </div>	
</template>

<script>
    import item  from'../components/item.vue';
    export default {
        components: { item },
        data() {
            return {
                items: [],
                // url: 'https://raw.githubusercontent.com/petmik2018/shop_data/master/responses/getBasket.json'
                url: '/api/basket'
            }
        },
        methods: {
            add(item) {
                let find = this.items.find (product => product.id == item.id);
                if (find) {                    
                    this.$parent.put(this.url + `/${find.id}`, { amount: 1 })
                    .then(res => {
                        if (res.status) {
                            find.quantity++;
                        } else {
                            console.log('error increase item');
                        }
                    });

                } else {
                    let newItem = Object.assign({}, item, {quantity: 1});
                    this.$parent.post(this.url, newItem)
                    .then(res => {
                        if (res.status) {
                            this.items.push(newItem); 
                        } else {
                            console.log('error add new item');
                        }
                    });                                       
                }            
            },
            remove(item) {
                if (item.quantity > 1) {
                    this.$parent.put(this.url + `/${find.id}`, { amount: -1 })
                    .then(res => {
                        if (res.status) {
                            find.quantity--;
                        } else {
                            console.log('error decrease item');
                        }
                    });

                } else {
                    this.$parent.delete(this.url + `/${item.id}`)
                    .then(res => {
                        if (res.status) {
                            this.items.splice(this.items.indexOf(item), 1); 
                        } else {
                            console.log('error remove item');
                        }
                    });                                       
                }
            }
        },
        mounted() {
            this.$parent.get(this.url)
            .then(data => {
                this.items = data
            })
        },
        computed: {
            computedSummary() {
                let quantity = 0;
                let amount = 0;
                this.items.forEach (item => {
                    quantity += (+item.quantity);
                    amount += item.price * item.quantity;
                });
                return {quantity, amount}
            },
        }
    }

</script>

<style>
	
</style>