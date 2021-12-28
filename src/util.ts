import * as vscode from 'vscode';
import { isDefined } from './common/types';
import * as path from "path";

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

export function getStepTypeAndName(stepType: StepType): { type: String | null, name: String | null } {
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

export async function suggestScriptFiles(searchQuery: string | null, options: { baseAbsolutePath: string }, _token: vscode.CancellationToken):
  Promise<Array<{ text: string, value: string }>> {

  if (!isDefined(searchQuery)
    || typeof searchQuery !== "string"
    || searchQuery.length === 0
  ) {
    return [];
  }

  const isAbsolute = path.isAbsolute(searchQuery);
  let searchPath;
  if (isAbsolute) {
    searchPath = searchQuery;
  } else if (isDefined(options?.baseAbsolutePath) && typeof options?.baseAbsolutePath === "string") {
    searchPath = path.join(options.baseAbsolutePath, searchQuery);
  } else {
    return [];
  }

  let fileItems: Array<[string, vscode.FileType]> = [];
  const searchDir = path.dirname(searchPath);
  const query = path.basename(searchPath);
  const searchUri = vscode.Uri.file(searchDir);
  try {
    const stat = await vscode.workspace.fs.stat(searchUri);
    if (_token.isCancellationRequested) {
      return [];
    }
    if (stat.type === vscode.FileType.Directory) {
      fileItems = await vscode.workspace.fs.readDirectory(searchUri);
    }
  } catch (err) {
    console.error("error: ", err);
    return [];
  }

  fileItems = fileItems.filter(fileItem => fileItem[0].indexOf(query) !== -1);
  const baseDir = isAbsolute ? searchDir : path.relative(options.baseAbsolutePath, searchDir);
  const result = fileItems.map(fileItem => ({
    text: fileItem[0],
    value: `${baseDir}${path.sep}${fileItem[0]}`
  }));

  return result;
}
