import { BaseEditorPanelWithInspector } from '../common/editorPanelWithInspector';

export abstract class RuleEditorRpc extends BaseEditorPanelWithInspector<string> {
  public zoomIn(): Promise<void> {
    return this._rpcProvider.rpc('zoomIn');
  }

  public zoomOut(): Promise<void> {
    return this._rpcProvider.rpc('zoomOut');
  }

  public fitCanvas(maxZoom: number | null = null): Promise<void> {
    return this._rpcProvider.rpc('fitCanvas', { maxZoom });
  }

  public setZoom(value: number): Promise<void> {
    return this._rpcProvider.rpc('setZoom', { value });
  }

  public addStep(type: String, name: String | null): Promise<void> {
    return this._rpcProvider.rpc('addStep', { type, name });
  }

  public deleteSelection(): Promise<void> {
    return this._rpcProvider.rpc('deleteSelection');
  }
}
