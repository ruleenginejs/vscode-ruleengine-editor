import * as vscode from 'vscode';
import { isDefined } from './common/types';
import { RuleEditorPanel } from './ruleEditor/ruleEditorPanel';
import { RuleEditorProvider } from './ruleEditor/ruleEditorProvider';
import { FunctionTemplateVariants, showScriptFileTemplateQuickPick, showStepQuickPick, StepType } from './util';
import { dirname } from "path";

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
      uri = vscode.Uri.file(newFileName).with({ scheme: 'untitled' });
    }

    vscode.commands.executeCommand('vscode.openWith', uri, RuleEditorProvider.viewType);
  }
}

export class NewScriptFileCommand {
  public static readonly id = "ruleengine.ruleEditor.newScriptFile";

  private static newUntitledId = 1;
  private static attemptCount = 100;

  public static async execute(uri?: vscode.Uri): Promise<boolean> {
    const result = await showScriptFileTemplateQuickPick();
    if (!isDefined(result)) {
      return false;
    }
    if (!uri) {
      uri = await NewScriptFileCommand.suggestScriptFileUri();
    }

    const textDocument = await vscode.workspace.openTextDocument(uri.with({ scheme: 'untitled' }));
    const editor = await vscode.window.showTextDocument(textDocument, vscode.ViewColumn.One, false);
    await editor.edit(edit => {
      const section = NewScriptFileCommand.getConfigSectionName(result!);
      const content = section ? vscode.workspace.getConfiguration("ruleengine.ruleEditor.scriptFiles.template")
        .get(section, "") : "";
      edit.insert(new vscode.Position(0, 0), content.replace(/\\n/g, "\n"));
    });
    return true;
  }

  private static getConfigSectionName(variants: FunctionTemplateVariants): string | undefined {
    switch (variants) {
      case FunctionTemplateVariants.twoArgs:
        return "twoArgs";
      case FunctionTemplateVariants.threeArgs:
        return "threeArgs";
      case FunctionTemplateVariants.fourArgs:
        return "fourArgs";
      case FunctionTemplateVariants.fiveArgs:
        return "fiveArgs";
      default:
        return undefined;
    }
  }

  private static async suggestScriptFileUri(): Promise<vscode.Uri> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const workspaceUri = workspaceFolders ? workspaceFolders[0].uri : undefined;
    const activeDocument = RuleEditorProvider.current?.activeCustomEditor?.document;
    const documentDirUri = activeDocument ? vscode.Uri.file(dirname(activeDocument.uri.fsPath)) : undefined;

    let uri: vscode.Uri | undefined = undefined;
    let c = 0;
    do {
      const newFileName = NewScriptFileCommand.createNewFileName();
      if (documentDirUri) {
        uri = vscode.Uri.joinPath(documentDirUri, newFileName);
      } else if (workspaceUri) {
        uri = vscode.Uri.joinPath(workspaceUri, newFileName);
      } else {
        uri = vscode.Uri.file(newFileName);
      }
      try {
        await vscode.workspace.fs.stat(uri);
      } catch (e) {
        console.error(e);
        break;
      }
      c++;
    } while (c < NewScriptFileCommand.attemptCount);

    return uri;
  }

  private static createNewFileName(): string {
    const extension = vscode.workspace.getConfiguration("ruleengine.ruleEditor.scriptFiles").get("newFileExtension", "");
    return `new-${NewScriptFileCommand.newUntitledId++}.${extension}`;
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

    const { type, name } = AddStepCommand.getStepTypeAndName(result!);
    if (!type) {
      return;
    }

    activeEditorPanel.addStep(type, name);
  }

  private static getStepTypeAndName(stepType: StepType): {
    type: String | null,
    name: String | null
  } {
    let type: String | null = null;
    let name: String | null = null;

    switch (stepType) {
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
        name = "New Step";
        break;
      case StepType.composite:
        type = "composite";
        name = "New Step";
        break;
    }

    return { type, name };
  }
}

export class DeleteCommand {
  public static readonly id = "ruleengine.ruleEditor.delete";

  public static async execute(): Promise<any> {
    const activeEditorPanel = findActivePanel();
    activeEditorPanel?.deleteSelection();
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
  private static readonly maxZoom = 100;

  public static async execute(): Promise<any> {
    const activeEditorPanel = findActivePanel();
    activeEditorPanel?.fitCanvas(FitCanvasCommand.maxZoom);
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
