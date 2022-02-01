import * as vscode from 'vscode';

export enum StepType {
  start = "Start Step",
  end = "End Step",
  error = "Error Step",
  single = "Single Step",
  composite = "Composite Step"
}

export enum NamingConvention {
  kebabCase = "kebab-case",
  camelCase = "camelCase"
}

const stepItems: Array<vscode.QuickPickItem> = [
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
  const result = await vscode.window.showQuickPick(stepItems, {
    placeHolder: 'Select Step'
  });
  if (!result) {
    return undefined;
  }
  return result.label as StepType;
}

export function splitByChar(str: string, char: string): string[] {
  if (typeof str !== "string") {
    return str;
  }
  return str.split(char)
    .map(s => s.trim())
    .filter(s => !!s);
}

export function splitByComma(str: string): string[] {
  return splitByChar(str, ",");
}

export function kebabCase(str: string): string {
  return require('lodash.kebabcase')(str);
}

export function camelCase(str: string): string {
  return require('lodash.camelcase')(str);
}
