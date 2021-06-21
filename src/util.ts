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
    description: "navigation",
    detail: "This step indicates start of rule. Only one for rule."
  },
  {
    label: StepType.end,
    description: "navigation",
    detail: "This step indicates end of rule. Everyone port must end with this step."
  },
  {
    label: StepType.error,
    description: "navigation",
    detail: "This step run when error occurs in handlers. Only one for rule."
  },
  {
    label: StepType.single,
    description: "handler",
    detail: "This step run handler if specified."
  },
  {
    label: StepType.composite,
    description: "handler",
    detail: "This step contains other steps."
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
