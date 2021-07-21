import * as vscode from 'vscode';
import { BaseEditorPanelWithInspector } from '../common/editorPanelWithInspector';
import { getNonce } from '../common/util';

export class RuleEditorPanel extends BaseEditorPanelWithInspector<string> {

  public createStep(type: String, name: String | null, notify: boolean = false): Promise<void> {
    return this._rpcProvider.rpc("createStep", { type, name, notify });
  }

  public deleteSelection(notify: boolean = false): Promise<void> {
    return this._rpcProvider.rpc("deleteSelection", { notify });
  }

  public fitCanvas(maxZoom: number | null = null): Promise<void> {
    return this._rpcProvider.rpc("fitCanvas", { maxZoom });
  }

  public setZoom(value: number): Promise<void> {
    return this._rpcProvider.rpc("setZoom", { value });
  }

  public zoomIn(): Promise<void> {
    return this._rpcProvider.rpc("zoomIn");
  }

  public zoomOut(): Promise<void> {
    return this._rpcProvider.rpc("zoomOut");
  }

  protected getWebviewOptions(): vscode.WebviewOptions {
    return {
      ...super.getWebviewOptions(),
      enableCommandUris: true
    };
  }

  protected getHtmlForWebview(webview: vscode.Webview): string {
    const scriptPathOnDisk = vscode.Uri.joinPath(this.extensionUri, this.mediaFolderName, 'editor', 'dist', 'assets', 'js', 'app.js');
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

    const stylesPathOnDisk = vscode.Uri.joinPath(this.extensionUri, this.mediaFolderName, 'editor', 'dist', 'assets', 'css', 'app.css');
    const stylesUri = webview.asWebviewUri(stylesPathOnDisk);

    const nonce = getNonce();

    return `
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource}; font-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rule Editor</title>

        <script defer="defer" nonce="${nonce}" src="${scriptUri}"></script>
        <link href="${stylesUri}" rel="stylesheet">
      </head>
      <body>
        <div id="app"></div>
      </body>
      </html>
    `;
  }
}
