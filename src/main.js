import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./styles/main.css";
import "@mdi/font/css/materialdesignicons.css";

createApp(App).use(store).use(vuetify).mount("#app");
