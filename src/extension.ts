import * as vscode from 'vscode';
import { NewRuleFileCommand } from './commands';
import { RuleEditorProvider } from './ruleEditor/ruleEditorProvider';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand(NewRuleFileCommand.id, NewRuleFileCommand.execute));
  context.subscriptions.push(RuleEditorProvider.register(context));
}
