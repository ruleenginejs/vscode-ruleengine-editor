import type * as vscode from 'vscode';
import { BaseEditor } from '../common/editor';
import { RuleDocument } from './ruleDocument';
import { RuleEditorPanel } from './ruleEditorPanel';

export class RuleEditor extends BaseEditor<RuleDocument, RuleEditorPanel> {

  public static create(extensionUri: vscode.Uri, document: RuleDocument): RuleEditor {
    return new RuleEditor(extensionUri, document);
  }

  protected createEditorPanel(webviewPanel: vscode.WebviewPanel): RuleEditorPanel {
    return new RuleEditorPanel(webviewPanel, this.extensionUri);
  }
}
