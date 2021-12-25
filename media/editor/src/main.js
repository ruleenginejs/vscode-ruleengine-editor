import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vscode from "./plugins/vscode";
import RuleEngineEditor from "@ruleenginejs/editor";
import "@ruleenginejs/ui/dist/style.css";
import "@ruleenginejs/ui/dist/vscode.theme.css";
import "@ruleenginejs/editor/dist/style.css";
import "@vscode/codicons/dist/codicon.css";

const app = createApp(App);

app.use(router);
app.use(vscode);
app.use(RuleEngineEditor);

app.mount('#app');
