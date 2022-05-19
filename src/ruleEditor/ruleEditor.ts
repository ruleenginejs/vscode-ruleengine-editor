import type * as vscode from 'vscode';
import { BaseEditorWithInspector } from '../common/editorWithInspector';
import { InspectorView } from '../common/inspectorView';
import { RuleDocument } from './ruleDocument';
import { RuleEditorPanel } from './ruleEditorPanel';

export class RuleEditor extends BaseEditorWithInspector<
  RuleDocument,
  RuleEditorPanel
> {
  public static create(
    extensionUri: vscode.Uri,
    document: RuleDocument,
    inspectorView: InspectorView
  ): RuleEditor {
    return new RuleEditor(extensionUri, document, inspectorView);
  }

  protected createEditorPanel(
    webviewPanel: vscode.WebviewPanel
  ): RuleEditorPanel {
    return new RuleEditorPanel(webviewPanel, this.extensionUri);
  }
}
