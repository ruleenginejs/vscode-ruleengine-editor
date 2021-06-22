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
    const activeEditorPanel = findActivePanel();
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

    activeEditorPanel.createStep(type, name, true);
  }
}

export class DeleteCommand {
  public static readonly id = "ruleengine.ruleEditor.delete";

  public static async execute(): Promise<any> {
    const activeEditorPanel = findActivePanel();
    activeEditorPanel?.deleteSelection(true);
  }
}

export class Zoom50Command {
  public static readonly id = "ruleengine.ruleEditor.zoom50";

  public static async execute(): Promise<any> {
    const activeEditorPanel = findActivePanel();
    activeEditorPanel?.setZoom(50);
  }
}

export class Zoom100Command {
  public static readonly id = "ruleengine.ruleEditor.zoom100";

  public static async execute(): Promise<any> {
    const activeEditorPanel = findActivePanel();
    activeEditorPanel?.setZoom(100);
  }
}

export class Zoom200Command {
  public static readonly id = "ruleengine.ruleEditor.zoom200";

  public static async execute(): Promise<any> {
    const activeEditorPanel = findActivePanel();
    activeEditorPanel?.setZoom(200);
  }
}

export class FitCanvasCommand {
  public static readonly id = "ruleengine.ruleEditor.fitCanvas";

  public static async execute(): Promise<any> {
    const activeEditorPanel = findActivePanel();
    activeEditorPanel?.fitCanvas();
  }
}

export class ZoomInCommand {
  public static readonly id = "ruleengine.ruleEditor.zoomIn";

  public static async execute(): Promise<any> {
    const activeEditorPanel = findActivePanel();
    activeEditorPanel?.zoomIn();
  }
}

export class ZoomOutCommand {
  public static readonly id = "ruleengine.ruleEditor.zoomOut";

  public static async execute(): Promise<any> {
    const activeEditorPanel = findActivePanel();
    activeEditorPanel?.zoomOut();
  }
}

function findActivePanel(): RuleEditorPanel | undefined {
  return RuleEditorProvider.current?.activeCustomEditor?.getActivePanel();
}
