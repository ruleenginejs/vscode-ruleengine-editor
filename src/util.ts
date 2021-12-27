import * as vscode from 'vscode';

export enum StepType {
  start = "Start Step",
  end = "End Step",
  error = "Error Step",
  single = "Single Step",
  composite = "Composite Step"
}

const stepQuickPickItems: Array<vscode.QuickPickItem> = [
  {
    label: StepType.start,
    detail: "This step indicates start of rule."
  },
  {
    label: StepType.error,
    detail: "This step run when error occurs."
  },
  {
    label: StepType.single,
    detail: "This step run handler."
  },
  {
    label: StepType.end,
    detail: "This step indicates end of rule."
  }
];

export async function showStepQuickPick(): Promise<StepType | undefined> {
  const result = await vscode.window.showQuickPick(stepQuickPickItems, {
    placeHolder: 'Select Step'
  });
  if (!result) {
    return undefined;
  }
  return result.label as StepType;
}
