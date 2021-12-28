import { BaseInspectorWebviewView } from "../common/inspectorWebviewView";
import { RpcProvider } from 'worker-rpc';
import { suggestScriptFiles } from "../filesystem";
import { RuleEditorProvider } from "./ruleEditorProvider";
import { dirname } from "path";

export abstract class RuleInspectorRpc extends BaseInspectorWebviewView {

  protected createRpcProvider(): RpcProvider {
    const rpcProvider = super.createRpcProvider();
    rpcProvider.registerRpcHandler("suggestScriptFiles", this.suggestScriptFiles.bind(this));
    return rpcProvider;
  }

  protected suggestScriptFiles(searchQuery: string): Promise<Array<{
    text: string,
    value: string
  }>> {
    const activeDocument = RuleEditorProvider.current?.activeCustomEditor?.document;
    const baseAbsolutePath = activeDocument ? dirname(activeDocument.uri.fsPath) : undefined;
    return suggestScriptFiles(searchQuery, {
      baseAbsolutePath
    });
  }
}
