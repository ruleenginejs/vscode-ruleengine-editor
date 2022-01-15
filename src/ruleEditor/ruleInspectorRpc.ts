import * as vscode from 'vscode';
import { BaseInspectorWebviewView } from "../common/inspectorWebviewView";
import { RpcProvider } from 'worker-rpc';
import { findFiles, replaceBackslash } from "../filesystem";
import { RuleEditorProvider } from "./ruleEditorProvider";
import { dirname, basename, relative, isAbsolute, join } from "path";
import { camelCase, kebabCase, NamingConvention, splitByComma } from '../util';
import { isDefined } from '../common/types';
import { RuleDocument } from './ruleDocument';
import { NewScriptFileCommand } from '../commands';

export abstract class RuleInspectorRpc extends BaseInspectorWebviewView {

  protected createRpcProvider(): RpcProvider {
    const rpcProvider = super.createRpcProvider();
    rpcProvider.registerRpcHandler("suggestScriptFiles", this.suggestScriptFiles.bind(this));
    rpcProvider.registerRpcHandler("openScriptFile", this.openScriptFile.bind(this));
    rpcProvider.registerRpcHandler("scriptFileExists", this.scriptFileExists.bind(this));
    rpcProvider.registerRpcHandler("newScriptFile", this.newScriptFile.bind(this));
    return rpcProvider;
  }

  private _searchCancellationSource?: vscode.CancellationTokenSource;
  private static packagePrefix = "~";

  protected async suggestScriptFiles(searchQuery: string): Promise<Array<{
    text: string,
    value: string
  }>> {
    searchQuery = searchQuery || "";
    if (searchQuery.startsWith(RuleInspectorRpc.packagePrefix)) {
      return [];
    }

    this._searchCancellationSource?.cancel();
    this._searchCancellationSource = new vscode.CancellationTokenSource();
    const activeDocument = RuleEditorProvider.current?.activeCustomEditor?.document;
    if (!activeDocument) {
      return [];
    }
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeDocument.uri.with({ scheme: "file" }));
    if (!workspaceFolder) {
      return [];
    }
    const documentDir = dirname(activeDocument.uri.fsPath);
    const workspacePath = workspaceFolder.uri.fsPath;
    const subFolder = relative(workspacePath, documentDir);

    const files = await findFiles(searchQuery, {
      workspaceFolder,
      subFolder,
      excludeDirs: this.excludeDirs,
      fileExtensions: this.fileExtensions,
      maxResults: this.maxResults
    }, this._searchCancellationSource.token);

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

  protected async newScriptFile(opt: { nodeId: number, name: string, filePath: string }): Promise<string | null | undefined> {
    const activeDocument = RuleEditorProvider.current?.activeCustomEditor?.document;
    if (!activeDocument || !opt) {
      return undefined;
    }

    if (opt.filePath) {
      const uri = this.getScriptFileUri(activeDocument, opt.filePath);
      if (uri) {
        vscode.commands.executeCommand(NewScriptFileCommand.id, uri);
      }
    } else {
      const documentDir = dirname(activeDocument.uri.fsPath);
      let uri = await this.suggestNewFileUri(documentDir, opt.name);
      if (uri) {
        vscode.commands.executeCommand(NewScriptFileCommand.id, uri);
        return relative(documentDir, uri.fsPath);
      }
    }
    return undefined;
  }

  protected async openScriptFile(filePath: string): Promise<boolean> {
    const activeDocument = RuleEditorProvider.current?.activeCustomEditor?.document;
    if (!activeDocument || !filePath) {
      return false;
    }
    const uri = this.getScriptFileUri(activeDocument, filePath);
    if (uri) {
      vscode.commands.executeCommand('vscode.open', uri);
      return true;
    }
    return false;
  }

  protected async scriptFileExists(filePath: string): Promise<boolean> {
    const activeDocument = RuleEditorProvider.current?.activeCustomEditor?.document;
    if (!activeDocument || !filePath) {
      return false;
    }
    const uri = this.getScriptFileUri(activeDocument, filePath);
    if (!uri) {
      return false;
    }
    try {
      const stat = await vscode.workspace.fs.stat(uri);
      return stat.type !== vscode.FileType.Directory;
    } catch (e) {
      return false;
    }
  }

  private getScriptFileUri(activeDocument: RuleDocument, filePath: string): vscode.Uri | undefined {
    let uri;
    if (typeof filePath !== "string" || filePath.length === 0) {
      uri = undefined;
    } else if (filePath.startsWith(RuleInspectorRpc.packagePrefix)) {
      uri = undefined;
    } else if (isAbsolute(filePath)) {
      uri = vscode.Uri.file(filePath);
    } else {
      const documentDir = dirname(activeDocument.uri.fsPath);
      uri = vscode.Uri.joinPath(vscode.Uri.file(documentDir), filePath);
    }
    return uri;
  }

  private static newUntitledId = 1;
  private static guessFilenameAttemptCount = 100;

  private async suggestNewFileUri(baseDir: string, name?: string): Promise<vscode.Uri | undefined> {
    let addSuffix = false;
    let uri: vscode.Uri | undefined = undefined;
    let c = 0;
    do {
      uri = vscode.Uri.file(join(baseDir, this.guessNewFileName(name, addSuffix)));
      try {
        await vscode.workspace.fs.stat(uri);
        uri = undefined;
      } catch (e) {
        break;
      }
      c++;
      addSuffix = true;
    } while (c < RuleInspectorRpc.guessFilenameAttemptCount);

    return uri;
  }

  private guessNewFileName(name?: string, addSuffix: boolean = false): string {
    let fileNamePrefix;
    if (name && typeof name === "string") {
      let separator;
      if (this.newFileNamingConvention === NamingConvention.kebabCase) {
        fileNamePrefix = kebabCase(name);
        separator = "-";
      } else if (this.newFileNamingConvention === NamingConvention.camelCase) {
        fileNamePrefix = camelCase(name);
        separator = "";
      } else {
        fileNamePrefix = name;
        separator = " ";
      }
      if (addSuffix) {
        fileNamePrefix += `${separator}${RuleInspectorRpc.newUntitledId++}`;
      }
    } else {
      fileNamePrefix = `new-${RuleInspectorRpc.newUntitledId++}`;
    }
    return `${fileNamePrefix}.${this.newFileExtension}`;
  }

  private _configCache: {
    excludeDirs?: string[],
    fileExtensions?: string[],
    maxResults?: number,
    newFileExtension?: string,
    newFileNamingConvention?: string
  } = {};

  private get excludeDirs(): string[] {
    if (!isDefined(this._configCache.excludeDirs)) {
      this._configCache.excludeDirs = splitByComma(this.getConf("findFiles", "excludeDirs", ""));
    }
    return this._configCache.excludeDirs!;
  }

  private get fileExtensions(): string[] {
    if (!isDefined(this._configCache.fileExtensions)) {
      this._configCache.fileExtensions = splitByComma(this.getConf("findFiles", "fileExtensions", ""));
    }
    return this._configCache.fileExtensions!;
  }

  private get maxResults(): number {
    if (!isDefined(this._configCache.maxResults)) {
      this._configCache.maxResults = this.getConf("findFiles", "maxResults", 50);
    }
    return this._configCache.maxResults!;
  }

  private get newFileExtension(): string {
    if (!isDefined(this._configCache.newFileExtension)) {
      this._configCache.newFileExtension = this.getConf("scriptFiles", "newFileExtension", "");
    }
    return this._configCache.newFileExtension!;
  }

  private get newFileNamingConvention(): string {
    if (!isDefined(this._configCache.newFileNamingConvention)) {
      this._configCache.newFileNamingConvention = this.getConf("scriptFiles", "newFileNamingConvention", "");
    }
    return this._configCache.newFileNamingConvention!;
  }

  private getConf<T>(section: string, name: string, defaultValue: T): T {
    return vscode.workspace
      .getConfiguration(`ruleengine.ruleEditor.${section}`)
      .get(name, defaultValue);
  }
}
