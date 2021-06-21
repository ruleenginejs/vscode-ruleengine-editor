import { createApp } from 'vue'
import App from './App.vue'
import globalComponents from "./utils/global-components"
import vscode from "./plugins/vscode";
import RuleEngineEditor from "@ruleenginejs/ruleengine-editor-vue";
import "vscode-codicons/dist/codicon.css";

const app = createApp(App);

app.use(globalComponents);
app.use(vscode);
app.use(RuleEngineEditor);

app.mount('#app');
