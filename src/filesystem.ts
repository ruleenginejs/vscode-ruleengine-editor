import * as vscode from 'vscode';
import * as path from "path";
import { isDefined } from './common/types';

export async function suggestScriptFiles(searchQuery: string | null, options: { baseAbsolutePath: string | undefined }, _token?: vscode.CancellationToken):
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
    if (_token?.isCancellationRequested) {
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
  const baseDir = isAbsolute ? searchDir : path.relative(options.baseAbsolutePath!, searchDir);
  const result = fileItems.map(fileItem => ({
    text: fileItem[0],
    value: `${baseDir}${path.sep}${fileItem[0]}`
  }));

  return result;
}
