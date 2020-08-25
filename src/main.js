import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueTableDynamic from 'vue-table-dynamic'
import VueEllipseProgress from 'vue-ellipse-progress';

Vue.use(VueTableDynamic)
Vue.use(VueEllipseProgress);
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
