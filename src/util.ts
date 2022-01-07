import * as vscode from 'vscode';

export enum StepType {
  start = "Start Step",
  end = "End Step",
  error = "Error Step",
  single = "Single Step",
  composite = "Composite Step"
}

export enum FunctionTemplateVariants {
  twoArgs = "Function With Two Args",
  threeArgs = "Function With Three Args",
  fourArgs = "Function With Four Args",
  fiveArgs = "Function With Five Args"
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

const sriptFileTemplateItems: Array<vscode.QuickPickItem> = [
  {
    label: FunctionTemplateVariants.twoArgs,
    detail: "(context, next)"
  },
  {
    label: FunctionTemplateVariants.threeArgs,
    detail: "(context, port, next)"
  },
  {
    label: FunctionTemplateVariants.fourArgs,
    detail: "(context, port, props, next)"
  },
  {
    label: FunctionTemplateVariants.fiveArgs,
    detail: "(err, context, port, props, next)"
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

export async function showScriptFileTemplateQuickPick(): Promise<FunctionTemplateVariants | undefined> {
  const result = await vscode.window.showQuickPick(sriptFileTemplateItems, {
    placeHolder: 'Select File Template'
  });
  if (!result) {
    return undefined;
  }
  return result.label as FunctionTemplateVariants;
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
