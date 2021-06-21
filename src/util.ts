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
    detail: "From this step the rule will run. Only one for the rule."
  },
  {
    label: StepType.end,
    description: "navigation",
    detail: "Indicates the end of the rule. Everyone port must end with this step."
  },
  {
    label: StepType.error,
    description: "navigation",
    detail: "If any error occurs in handlers this step is run. Only one for the rule."
  },
  {
    label: StepType.single,
    description: "handler",
    detail: "This step run the handler if specified."
  },
  {
    label: StepType.composite,
    description: "handler",
    detail: "This step may contain other steps."
  }
];

export async function showStepQuickPick(): Promise<StepType | undefined> {
  const result = await vscode.window.showQuickPick(stepQuickPickItems, {
    placeHolder: 'Please select the type of step'
  });
  if (!result) {
    return undefined;
  }
  return result.label as StepType;
}
