import { createApp } from "vue";
import { createPinia } from "pinia";
import { router } from "./router";
import App from "./App.vue";
import "virtual:svg-icons-register";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import Icons from "./components/ui/Icons.vue";
import "vuetify/styles";
import naive from 'naive-ui'

import "@/assets/css/input.css";


import Tooltip from "@programic/vue3-tooltip";
import "@programic/vue3-tooltip/dist/index.css";



const pinia = createPinia();
const app = createApp(App);

pinia.use(piniaPluginPersistedstate);
app.component("Icons", Icons);
app.use(pinia);
app.use(naive);
app.use(router);
app.mount("#app");
app.use(Tooltip);
