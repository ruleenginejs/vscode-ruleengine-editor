import * as vscode from 'vscode';
import * as path from 'path';
import { isDefined } from './common/types';

const BACKSLASH_REGEX = new RegExp('\\\\', 'g');

const SLASH = '/';
const DOT = '.';
const RELATIVE_PATH = DOT + SLASH;

export interface FindOptions {
  workspaceFolder?: vscode.WorkspaceFolder;
  maxResults?: number;
  excludeDirs?: string[];
  fileExtensions?: string[];
  subFolder?: string;
}

export async function findFiles(
  query: string,
  options: FindOptions,
  token?: vscode.CancellationToken
): Promise<vscode.Uri[]> {
  const includePattern = _buildIncludePattern(
    query,
    options.workspaceFolder,
    options.fileExtensions,
    options.subFolder
  );
  const excludePattern = options.excludeDirs
    ? _buildExcludePattern(options.excludeDirs)
    : undefined;
  const files = await vscode.workspace.findFiles(
    includePattern,
    excludePattern,
    options.maxResults,
    token
  );
  return files;
}

function _buildIncludePattern(
  query: string,
  workspaceFolder?: vscode.WorkspaceFolder,
  fileExtensions?: string[],
  subFolder?: string
): vscode.GlobPattern {
  const pattern = _buildPattern(query, fileExtensions, subFolder);
  if (workspaceFolder) {
    return new vscode.RelativePattern(workspaceFolder, pattern);
  } else {
    return pattern;
  }
}

function _buildExcludePattern(
  excludeDirs: string[]
): vscode.GlobPattern | undefined {
  if (excludeDirs.length === 0) {
    return undefined;
  }
  return `{${excludeDirs.join(',')}}`;
}

function _buildPattern(
  query: string,
  fileExtensions?: string[],
  subFolder?: string
): string {
  query = replaceBackslash(query);
  query = _expandRelativePath(query, subFolder);
  const inFolder = query.endsWith(SLASH);
  const dirname = inFolder ? query : path.dirname(query);
  const basename = inFolder ? '' : path.basename(query);
  let pattern = '';
  if (dirname !== DOT && dirname !== SLASH) {
    pattern += trimEndSlash(dirname) + SLASH;
  }
  pattern += '**/*';
  if (basename && query !== DOT) {
    pattern += basename + '*';
  }
  pattern += _addExtensionPattern(query, fileExtensions);
  return pattern;
}

function _expandRelativePath(query: string, subFolder?: string) {
  if (query.startsWith(RELATIVE_PATH) && isDefined(subFolder)) {
    query = query.slice(RELATIVE_PATH.length);
    query = trimEndSlash(replaceBackslash(subFolder!)) + SLASH + query;
  }
  return query;
}

function _addExtensionPattern(query: string, fileExtensions?: string[]) {
  const ext = path.extname(query);
  if (!ext && fileExtensions && fileExtensions.length > 0) {
    return `.{${fileExtensions.join(',')}}`;
  }
  return '';
}

export function replaceBackslash(path: string): string {
  return path.replace(BACKSLASH_REGEX, '/');
}

function trimEndSlash(path: string): string {
  if (path.endsWith(SLASH)) {
    path = path.slice(0, -SLASH.length);
  }
  return path;
}
