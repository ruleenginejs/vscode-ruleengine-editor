import * as vscode from 'vscode';
import { RuleEditorProvider } from './ruleEditor/ruleEditorProvider';

export class NewRuleFileCommand {
  public static readonly id = "ruleEngine.ruleEditor.new";

  private static newUntitledId = 1;

  public static execute(): any {
    const newFileName = `new-${NewRuleFileCommand.newUntitledId++}.rule`;
    const workspaceFolders = vscode.workspace.workspaceFolders;

    let uri;
    if (workspaceFolders) {
      uri = vscode.Uri.joinPath(workspaceFolders[0].uri, newFileName).with({ scheme: 'untitled' });
    } else {
      uri = vscode.Uri.parse(`untitled:${newFileName}`);
    }

    vscode.commands.executeCommand('vscode.openWith', uri, RuleEditorProvider.viewType);
  }
}
