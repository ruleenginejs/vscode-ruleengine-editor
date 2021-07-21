import { ref, watch, onBeforeUnmount, nextTick } from "vue"
import { ExthostRpc } from "@/utils/exthost-rpc";

const NEW_STEP_OFFSET = [20, 20];
const DEFAULT_ZOOM = 100;

const edgeScrollSizes = Object.freeze({
  edgeTopSize: { in: 10, out: 0 },
  edgeLeftSize: { in: 10, out: 0 },
  edgeRightSize: { in: 10, out: 0 },
  edgeBottomSize: { in: 10, out: 0 }
});

export default function useEditor(vscode) {
  const editor = ref(null);
  const zoom = ref(DEFAULT_ZOOM);
  const rpc = new ExthostRpc(vscode);
  let pendingInitialData = null;

  rpc.provider.registerRpcHandler("setInitialData", setInitialData);
  rpc.provider.registerRpcHandler("getFileData", getFileData);
  rpc.provider.registerRpcHandler("setFileData", setFileData);
  rpc.provider.registerRpcHandler("applyEdits", applyEdits);
  rpc.provider.registerRpcHandler("createStep", addStep);
  rpc.provider.registerRpcHandler("setZoom", setZoom);
  rpc.provider.registerRpcHandler("fitCanvas", fitCanvas);
  rpc.provider.registerRpcHandler("deleteSelection", deleteSelection);
  rpc.provider.registerRpcHandler("zoomIn", zoomIn);
  rpc.provider.registerRpcHandler("zoomOut", zoomOut);
  rpc.provider.registerSignalHandler("needUpdateInspector", needUpdateInspector);

  watch(editor, handlePendingData);

  const onChangeValue = (e) => {
    rpc.provider.signal("edit", e);
  }

  onBeforeUnmount(() => {
    rpc.destroy();
  });

  function setInitialData(payload) {
    if (editor.value) {
      setEditorData(payload);
    } else {
      pendingInitialData = { ...payload };
    }
  }

  function handlePendingData() {
    if (pendingInitialData && editor.value) {
      setEditorData(pendingInitialData);
      pendingInitialData = null;
    }
  }

  function setEditorData({ data, editOperations }) {
    editor.value.instance.setValue(data);
    editor.value.instance.applyEdits(editOperations, false);
    nextTick(() => {
      editor.value.instance.fitCanvas(editor.value.instance.getZoom());
    });
  }

  function getFileData() {
    if (!editor.value) { return ""; }
    const value = editor.value.instance.getValue();
    return JSON.stringify(value, null, 2);
  }

  function setFileData(data) {
    editor.value?.instance.setValue(data);
  }

  function applyEdits({ editOperations, notify }) {
    editor.value?.instance.applyEdits(editOperations, !!notify);

    if (!notify) {
      needUpdateInspector();
    }
  }

  function addStep({ type, name, notify }) {
    editor.value.instance.newNodeInCurrentViewWithOffset(type,
      NEW_STEP_OFFSET, { name }, notify);
  }

  function setZoom({ value }) {
    editor.value.instance.setZoom(value);
  }

  function zoomIn() {
    zoom.value = Math.ceil(zoom.value * 2);
  }

  function zoomOut() {
    zoom.value = Math.ceil(zoom.value / 2);
  }

  function fitCanvas({ maxZoom }) {
    editor.value.instance.fitCanvas(maxZoom);
  }

  function deleteSelection({ notify }) {
    editor.value.instance.deleteSelectedObject(notify);
  }

  function updateInspector(data) {
    rpc.provider.signal("updateInspector", data);
  }

  let i = 0;
  function needUpdateInspector() {
    updateInspector({ updated: i++ });
  }

  return {
    editor,
    zoom,
    edgeScrollSizes,
    onChangeValue
  }
}
