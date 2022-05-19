import * as vscode from 'vscode';
import { BaseInspectorView } from '../common/inspectorView';
import { InspectorWebviewView } from '../common/inspectorWebviewView';
import { RuleInspectorWebviewView } from './ruleInspectorWebviewView';

export class RuleInspectorView extends BaseInspectorView {
  public static readonly viewType = 'ruleengine.inpsectorView';

  public static current: RuleInspectorView | undefined;

  public static register(context: vscode.ExtensionContext): { dispose(): any } {
    RuleInspectorView.current = new RuleInspectorView(
      context.extensionUri,
      RuleInspectorView.viewType
    );

    const disposable = vscode.window.registerWebviewViewProvider(
      RuleInspectorView.viewType,
      RuleInspectorView.current
    );

    return {
      dispose: () => {
        RuleInspectorView.current = undefined;
        disposable.dispose();
      }
    };
  }

  public get isAutoReveal(): boolean {
    return vscode.workspace
      .getConfiguration('ruleengine.ruleEditor.inspector')
      .get('autoReveal', false);
  }

  public get revealDelay(): number {
    return vscode.workspace
      .getConfiguration('ruleengine.ruleEditor.inspector')
      .get('revealDelay', 0);
  }

  protected createView(
    webviewView: vscode.WebviewView,
    extensionUri: vscode.Uri
  ): InspectorWebviewView {
    return new RuleInspectorWebviewView(webviewView, extensionUri);
  }
}
