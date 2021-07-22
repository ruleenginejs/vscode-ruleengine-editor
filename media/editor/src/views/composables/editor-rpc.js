import { watch, nextTick } from "vue";
import { ExthostRpc } from "@/utils/exthost-rpc";
import { modelSerializer } from "@ruleenginejs/ruleengine-editor-vue";

const NEW_STEP_OFFSET = [20, 20];

export class EditorRpc extends ExthostRpc {
  constructor(vscode, { zoom, editor, selectedModel }) {
    debugger;
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
      debugger;
      if (this.pendingInitialData && this.editor.value) {
        this._setEditorInitialData(this.pendingInitialData);
        this.pendingInitialData = null;
      }

      this.editorModel?.addChangeListener(this.onChangeModelContent);
    });

    watch(this.selectedModel, () => {
      debugger;
      this.needUpdateInspector();
    })
  }

  _registerHandlers() {
    debugger;
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
    debugger;
    if (this.editor.value) {
      this._setEditorInitialData(payload);
    } else {
      this.pendingInitialData = { ...payload };
    }
  }

  getFileData() {
    debugger;
    if (!this.editorInstance) { return ""; }
    const value = this.editorInstance.getValue();
    return JSON.stringify(value, null, 2);
  }

  setFileData(data) {
    debugger;
    this.editorInstance?.setValue(data);
  }

  applyEdits({ editOperations, notify }) {
    debugger;
    this.editorInstance?.applyEdits(editOperations, !!notify);

    if (!notify) {
      this.needUpdateInspector();
    }
  }

  addStep({ type, name }) {
    debugger;
    this.editorInstance?.newNodeInCurrentViewWithOffset(
      type,
      NEW_STEP_OFFSET,
      { name },
      true
    );
  }

  setZoom({ value }) {
    debugger;
    this.editorInstance?.setZoom(value);
  }

  zoomIn() {
    debugger;
    this.zoom.value = Math.ceil(this.zoom.value * 2);
  }

  zoomOut() {
    debugger;
    this.zoom.value = Math.ceil(this.zoom.value / 2);
  }

  fitCanvas({ maxZoom }) {
    debugger;
    this.editorInstance?.fitCanvas(maxZoom);
  }

  deleteSelection() {
    debugger
    this.editorInstance?.deleteSelectedObject(true);
  }

  updateInspector(data) {
    debugger
    this.provider.signal("updateInspector", data);
  }

  needUpdateInspector() {
    debugger;
    this.updateInspector(modelSerializer(this.selectedModel.value));
  }

  sendEditSignal(data) {
    debugger;
    this.provider.signal("edit", data);
  }

  _setEditorInitialData({ data, editOperations }) {
    debugger;
    this.editorInstance?.setValue(data);
    this.editorInstance?.applyEdits(editOperations, false);
    nextTick(() => {
      this.editorInstance?.fitCanvas(this.editorInstance?.getZoom());
    });
  }

  onChangeModelContent() {
    debugger;
    this.needUpdateInspector();
  }

  destroy() {
    debugger;
    this.editorModel?.removeChangeListener(this.onChangeModelContent);
    super.destroy();
  }
}
