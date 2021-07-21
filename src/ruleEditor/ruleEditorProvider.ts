import * as vscode from 'vscode';
import { EditorProviderOptions } from '../common/editorProvider';
import { BaseEditorProviderWithInspector } from '../common/editorProviderWithInspector';
import { InspectorView } from '../common/inspectorView';
import { RuleDocument } from './ruleDocument';
import { RuleEditor } from './ruleEditor';

export class RuleEditorProvider extends BaseEditorProviderWithInspector<RuleDocument, RuleEditor> {
  public static readonly viewType = "ruleengine.ruleEditor";
  public static current: RuleEditorProvider | undefined;

  private static options: EditorProviderOptions = {
    webviewOptions: {
      retainContextWhenHidden: true
    },
    supportsMultipleEditorsPerDocument: false
  };

  public static register(context: vscode.ExtensionContext, inspectorView: InspectorView): vscode.Disposable {
    RuleEditorProvider.current = new RuleEditorProvider(context, inspectorView);

    const provider = vscode.window.registerCustomEditorProvider(
      RuleEditorProvider.viewType,
      RuleEditorProvider.current,
      RuleEditorProvider.options
    );

    return {
      dispose: () => {
        RuleEditorProvider.current = undefined;
        provider.dispose();
      }
    };
  }

  protected createDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext): Promise<RuleDocument> {
    return RuleDocument.create(uri, openContext.backupId);
  }

  protected createEditor(extensionUri: vscode.Uri, document: RuleDocument): RuleEditor {
    return RuleEditor.create(extensionUri, document, this.inspectorView);
  }
}
