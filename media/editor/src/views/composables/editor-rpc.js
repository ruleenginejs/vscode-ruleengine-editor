import { watch, nextTick } from "vue";
import { ExthostRpc } from "@/utils/exthost-rpc";
import { sidebarModelSerializer } from "@ruleenginejs/editor";
import { NEW_NODE_CASCADE_OFFSET, NEW_NODE_START_OFFSET } from "./const";

export class EditorRpc extends ExthostRpc {
  constructor(vscode, { zoom, editor, selectedModel }) {
    super(vscode);

    this.zoom = zoom;
    this.editor = editor;
    this.selectedModel = selectedModel;
    this.pendingInitialData = null;

    this.setInitialData = this.setInitialData.bind(this);
    this.getFileData = this.getFileData.bind(this);
    this.setFileData = this.setFileData.bind(this);
    this.applyEdits = this.applyEdits.bind(this);
    this.addStep = this.addStep.bind(this);
    this.setZoom = this.setZoom.bind(this);
    this.fitCanvas = this.fitCanvas.bind(this);
    this.deleteSelection = this.deleteSelection.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.needUpdateInspector = this.needUpdateInspector.bind(this);
    this.onChangeModelContent = this.onChangeModelContent.bind(this);

    this._initWatchers();
    this._registerHandlers();
  }

  _initWatchers() {
    watch(this.editor, () => {
      if (this.pendingInitialData && this.editor.value) {
        this._setEditorInitialData(this.pendingInitialData);
        this.pendingInitialData = null;
      }

      this.editorModel?.addChangeListener(this.onChangeModelContent);
    });

    watch(this.selectedModel, () => {
      this.needUpdateInspector();
    })
  }

  _registerHandlers() {
    this.provider.registerRpcHandler("setInitialData", this.setInitialData);
    this.provider.registerRpcHandler("getFileData", this.getFileData);
    this.provider.registerRpcHandler("setFileData", this.setFileData);
    this.provider.registerRpcHandler("applyEdits", this.applyEdits);
    this.provider.registerRpcHandler("addStep", this.addStep);
    this.provider.registerRpcHandler("setZoom", this.setZoom);
    this.provider.registerRpcHandler("fitCanvas", this.fitCanvas);
    this.provider.registerRpcHandler("deleteSelection", this.deleteSelection);
    this.provider.registerRpcHandler("zoomIn", this.zoomIn);
    this.provider.registerRpcHandler("zoomOut", this.zoomOut);
    this.provider.registerSignalHandler("needUpdateInspector", this.needUpdateInspector);
  }

  get editorInstance() {
    return this.editor.value?.instance;
  }

  get editorModel() {
    return this.editor.value?.instance?.model.value;
  }

  setInitialData(payload) {
    if (this.editor.value) {
      this._setEditorInitialData(payload);
    } else {
      this.pendingInitialData = { ...payload };
    }
  }

  _setEditorInitialData({ data, editOperations }) {
    this.editorInstance?.setValue(data);
    this.editorInstance?.applyEdits(editOperations, false);

    nextTick(() => {
      this.editorInstance?.fitCanvas(this.editorInstance?.getZoom());
    });
  }

  getFileData() {
    if (!this.editorInstance) { return ""; }
    const value = this.editorInstance.getValue();
    return JSON.stringify(value, null, 2);
  }

  setFileData(data) {
    this.editorInstance?.setValue(data);
  }

  applyEdits({ editOperations, notify }) {
    this.editorInstance?.applyEdits(editOperations, !!notify);

    if (!notify) {
      this.needUpdateInspector();
    }
  }

  addStep({ type, name }) {
    this.editorInstance?.newNodeInCurrentViewWithCascade(
      type,
      NEW_NODE_START_OFFSET,
      NEW_NODE_CASCADE_OFFSET,
      { name },
      true
    );
  }

  setZoom({ value }) {
    this.editorInstance?.setZoom(value);
  }

  zoomIn() {
    this.zoom.value = Math.ceil(this.zoom.value * 2);
  }

  zoomOut() {
    this.zoom.value = Math.ceil(this.zoom.value / 2);
  }

  fitCanvas({ maxZoom }) {
    this.editorInstance?.fitCanvas(maxZoom);
  }

  deleteSelection() {
    this.editorInstance?.deleteSelectedObject(true);
  }

  updateInspector(data) {
    this.provider.signal("updateInspector", data);
  }

  needUpdateInspector() {
    if (this.editorModel) {
      this.updateInspector(
        sidebarModelSerializer(this.editorModel, this.selectedModel.value)
      );
    } else {
      this.updateInspector(null);
    }
  }

  sendEditSignal(data) {
    this.provider.signal("edit", data);
  }

  onChangeModelContent() {
    this.needUpdateInspector();
  }

  destroy() {
    this.editorModel?.removeChangeListener(this.onChangeModelContent);
    super.destroy();
  }
}
