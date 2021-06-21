import * as vscode from 'vscode';
import { AddStepCommand, NewRuleFileCommand } from './commands';
import { RuleEditorProvider } from './ruleEditor/ruleEditorProvider';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand(NewRuleFileCommand.id, NewRuleFileCommand.execute));
  context.subscriptions.push(vscode.commands.registerCommand(AddStepCommand.id, AddStepCommand.execute));
  context.subscriptions.push(RuleEditorProvider.register(context));
}
