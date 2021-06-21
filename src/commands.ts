import * as vscode from 'vscode';
import { isDefined } from './common/types';
import { RuleEditorPanel } from './ruleEditor/ruleEditorPanel';
import { RuleEditorProvider } from './ruleEditor/ruleEditorProvider';
import { showStepQuickPick, StepType } from './util';

export class NewRuleFileCommand {
  public static readonly id = "ruleengine.ruleEditor.newFile";

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

export class AddStepCommand {
  public static readonly id = "ruleengine.ruleEditor.addStep";

  public static async execute(): Promise<any> {
    const activeEditorPanel = RuleEditorProvider.current?.activeCustomEditor?.getActivePanel();
    if (!activeEditorPanel) {
      return;
    }

    const result = await showStepQuickPick();
    if (!isDefined(result)) {
      return;
    }

    let type: String | null = null;
    let name: String | null = null;

    switch (result) {
      case StepType.start:
        type = "start";
        break;
      case StepType.end:
        type = "end";
        break;
      case StepType.error:
        type = "error";
        break;
      case StepType.single:
        type = "single";
        name = "New Single";
        break;
      case StepType.composite:
        type = "composite";
        name = "New Composite";
        break;
    }

    if (!type) {
      return;
    }

    createStep(activeEditorPanel, type, name, true);
  }
}

async function createStep(panel: RuleEditorPanel, type: String, name: String | null, notify: boolean) {
  try {
    await panel.createStep(type, name, notify);
  } catch (err) {
    vscode.window.showErrorMessage(`Failed to create '${type}' step: ${err.message}`);
  }
}
