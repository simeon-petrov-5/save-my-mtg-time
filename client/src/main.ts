import { createApp } from 'vue';
import './styles/styles.scss';
import { Tooltip } from 'floating-vue';
import App from './App.vue';
import 'floating-vue/dist/style.css';

const app = createApp(App);
app.component('VTooltip', Tooltip);
app.mount('#app');
