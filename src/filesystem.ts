import * as vscode from 'vscode';
import * as path from "path";

export interface FindOptions {
  workspaceFolder?: vscode.WorkspaceFolder,
  maxResults?: number,
  excludeDirs?: string[],
  fileExtensions?: string[]
}

export async function findFiles(query: string, options: FindOptions, token?: vscode.CancellationToken): Promise<vscode.Uri[]> {
  const includePattern = _buildIncludePattern(query, options.workspaceFolder, options.fileExtensions);
  const excludePattern = options.excludeDirs ? _buildExcludePattern(options.excludeDirs) : undefined;
  const files = await vscode.workspace.findFiles(includePattern, excludePattern, options.maxResults, token);
  return files;
}

function _buildIncludePattern(query: string, workspaceFolder?: vscode.WorkspaceFolder, fileExtensions?: string[]): vscode.GlobPattern {
  const pattern = _buildPattern(query, fileExtensions);
  if (workspaceFolder) {
    return new vscode.RelativePattern(workspaceFolder, pattern);
  } else {
    return pattern;
  }
}

function _buildExcludePattern(excludeDirs: string[]): vscode.GlobPattern | undefined {
  if (excludeDirs.length === 0) {
    return undefined;
  }
  return `{${excludeDirs.join(",")}}`;
}

function _buildPattern(query: string, fileExtensions?: string[]): string {
  query = replaceBackslash(query);
  const ext = path.extname(query);
  let pattern = "**/*";
  if (query) {
    pattern += `${query}*`;
  }
  if (fileExtensions && fileExtensions.length > 0 && !ext) {
    pattern += `.{${fileExtensions.join(",")}}`;
  }
  return pattern;
}

const _backslashRegexp = new RegExp("\\\\", 'g');

export function replaceBackslash(path: string): string {
  return path.replace(_backslashRegexp, "/");
}
