import { BaseInspectorWebviewView } from "../common/inspectorWebviewView";
import { RpcProvider } from 'worker-rpc';

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
    return Promise.resolve([
      {
        text: searchQuery,
        value: `./${searchQuery}`
      }
    ]);
  }
}
