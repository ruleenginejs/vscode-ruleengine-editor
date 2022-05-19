import * as vscode from 'vscode';
import {
  AddStepCommand,
  DeleteCommand,
  FitCanvasCommand,
  NewRuleFileCommand,
  NewScriptFileCommand,
  Zoom100Command,
  Zoom200Command,
  Zoom50Command,
  ZoomInCommand,
  ZoomOutCommand
} from './commands';
import { RuleEditorProvider } from './ruleEditor/ruleEditorProvider';
import { RuleInspectorView } from './ruleEditor/ruleInspectorView';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      NewRuleFileCommand.id,
      NewRuleFileCommand.execute
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      NewScriptFileCommand.id,
      NewScriptFileCommand.execute
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(AddStepCommand.id, AddStepCommand.execute)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(DeleteCommand.id, DeleteCommand.execute)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(ZoomInCommand.id, ZoomInCommand.execute)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(ZoomOutCommand.id, ZoomOutCommand.execute)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(Zoom50Command.id, Zoom50Command.execute)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(Zoom100Command.id, Zoom100Command.execute)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(Zoom200Command.id, Zoom200Command.execute)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      FitCanvasCommand.id,
      FitCanvasCommand.execute
    )
  );
  context.subscriptions.push(RuleInspectorView.register(context));
  context.subscriptions.push(
    RuleEditorProvider.register(context, RuleInspectorView.current!)
  );
}
