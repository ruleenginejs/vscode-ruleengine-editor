import * as vscode from 'vscode';
import { BaseInspectorWebviewView } from "../common/inspectorWebviewView";
import { RpcProvider } from 'worker-rpc';
import { findFiles, replaceBackslash } from "../filesystem";
import { RuleEditorProvider } from "./ruleEditorProvider";
import { dirname, basename, relative } from "path";
import { splitByComma } from '../util';

export abstract class RuleInspectorRpc extends BaseInspectorWebviewView {

  protected createRpcProvider(): RpcProvider {
    const rpcProvider = super.createRpcProvider();
    rpcProvider.registerRpcHandler("suggestScriptFiles", this.suggestScriptFiles.bind(this));
    return rpcProvider;
  }

  private _findCancellationSource?: vscode.CancellationTokenSource;

  protected async suggestScriptFiles(searchQuery: string): Promise<Array<{
    text: string,
    value: string
  }>> {
    this._findCancellationSource?.cancel();
    this._findCancellationSource = new vscode.CancellationTokenSource();
    const activeDocument = RuleEditorProvider.current?.activeCustomEditor?.document;
    const workspaceFolder = activeDocument ? vscode.workspace.getWorkspaceFolder(activeDocument.uri) : undefined;
    if (!activeDocument || !workspaceFolder) {
      return [];
    }
    const documentDir = dirname(activeDocument.uri.fsPath);
    const workspacePath = workspaceFolder.uri.fsPath;

    const files = await findFiles(searchQuery, {
      workspaceFolder,
      excludeDirs: this.excludeDirs,
      fileExtensions: this.fileExtensions,
      maxResults: this.maxResults
    }, this._findCancellationSource.token);

    return files.map(fileUri => {
      const filePath = fileUri.fsPath;
      const fileName = basename(filePath);
      const fileDir = dirname(filePath);
      const relativePath = relative(documentDir, filePath);
      const displayPath = relative(workspacePath, fileDir);
      const text = `${fileName} ${replaceBackslash(displayPath)}`;
      const value = replaceBackslash(relativePath);
      return { text, value };
    });
  }

  private get excludeDirs(): string[] {
    return splitByComma(vscode.workspace.getConfiguration("ruleengine.ruleEditor.findFiles").get("excludeDirs", ""));
  }

  private get fileExtensions(): string[] {
    return splitByComma(vscode.workspace.getConfiguration("ruleengine.ruleEditor.findFiles").get("fileExtensions", ""));
  }

  private get maxResults(): number {
    return vscode.workspace.getConfiguration("ruleengine.ruleEditor.findFiles").get("maxResults", 50);
  }
}
