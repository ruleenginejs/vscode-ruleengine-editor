import * as vscode from 'vscode';
import * as path from "path";
import { isDefined } from './common/types';

const SLASH = "/";
const DOT = ".";
const RELATIVE_PATH = DOT + SLASH;

export interface FindOptions {
  workspaceFolder?: vscode.WorkspaceFolder,
  maxResults?: number,
  excludeDirs?: string[],
  fileExtensions?: string[],
  subFolder?: string
}

export async function findFiles(query: string, options: FindOptions, token?: vscode.CancellationToken): Promise<vscode.Uri[]> {
  const includePattern = _buildIncludePattern(query, options.workspaceFolder, options.fileExtensions, options.subFolder);
  const excludePattern = options.excludeDirs ? _buildExcludePattern(options.excludeDirs) : undefined;
  const files = await vscode.workspace.findFiles(includePattern, excludePattern, options.maxResults, token);
  return files;
}

function _buildIncludePattern(query: string, workspaceFolder?: vscode.WorkspaceFolder, fileExtensions?: string[], subFolder?: string): vscode.GlobPattern {
  const pattern = _buildPattern(query, fileExtensions, subFolder);
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

function _buildPattern(query: string, fileExtensions?: string[], subFolder?: string): string {
  let pattern = "";
  query = replaceBackslash(query);

  if (query.startsWith(RELATIVE_PATH)) {
    query = query.slice(RELATIVE_PATH.length);
    if (isDefined(subFolder)) {
      pattern += trimEndSlash(replaceBackslash(subFolder!)) + SLASH;
    }
  }

  if (query) {
    query = replaceBackslash(path.normalize(query));
  }

  const endSlash = query.endsWith(SLASH);
  const dirName = endSlash ? query : path.dirname(query);
  const baseName = endSlash ? "" : path.basename(query);
  const ext = path.extname(query);

  if (dirName !== DOT) {
    pattern += trimEndSlash(dirName) + SLASH;
  }

  pattern += "**/*";
  if (baseName) {
    pattern += baseName + "*";
  }
  if (!ext && fileExtensions && fileExtensions.length > 0) {
    pattern += `.{${fileExtensions.join(",")}}`;
  }
  console.log("search pattern:", pattern);
  return pattern;
}

const BACKSLASH = new RegExp("\\\\", 'g');

export function replaceBackslash(path: string): string {
  return path.replace(BACKSLASH, "/");
}

function trimEndSlash(path: string): string {
  if (path.endsWith(SLASH)) {
    path = path.slice(0, -SLASH.length);
  }
  return path;
}
