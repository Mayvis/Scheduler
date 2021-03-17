import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import PortalVue from "portal-vue";
require("default-passive-events");

Vue.use(ElementUI);
Vue.use(PortalVue);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
