import * as vscode from 'vscode';
import { BaseEditorProvider, EditorProviderOptions } from '../common/editorProvider';
import { RuleDocument } from './ruleDocument';
import { RuleEditor } from './ruleEditor';

export class RuleEditorProvider extends BaseEditorProvider<RuleDocument, RuleEditor> {
  public static readonly viewType = "ruleEngine.ruleEditor";

  private static options: EditorProviderOptions = {
    webviewOptions: {
      retainContextWhenHidden: true
    },
    supportsMultipleEditorsPerDocument: false
  };

  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(
      RuleEditorProvider.viewType,
      new RuleEditorProvider(context),
      RuleEditorProvider.options
    );
  }

  protected createDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext): Promise<RuleDocument> {
    return RuleDocument.create(uri, openContext.backupId);
  }

  protected createEditor(extensionUri: vscode.Uri, document: RuleDocument): RuleEditor {
    return RuleEditor.create(extensionUri, document);
  }
}
