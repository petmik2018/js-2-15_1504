import bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './layout/styles/normalize.css';
import './layout/styles/style.css';
import './layout/styles/my_style.css';

import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
