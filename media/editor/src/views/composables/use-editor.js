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

  rpc.provider.registerRpcHandler("setInitialData", handleSetInitialData);
  rpc.provider.registerRpcHandler("getFileData", handleGetFileData);
  rpc.provider.registerRpcHandler("setFileData", handleSetFileData);
  rpc.provider.registerRpcHandler("applyEdits", handleApplyEdits);
  rpc.provider.registerRpcHandler("createStep", handleCreateStep);
  rpc.provider.registerRpcHandler("setZoom", handleSetZoom);
  rpc.provider.registerRpcHandler("fitCanvas", handleFitCanvas);
  rpc.provider.registerRpcHandler("deleteSelection", handleDeleteSelection);
  rpc.provider.registerRpcHandler("zoomIn", handleZoomIn);
  rpc.provider.registerRpcHandler("zoomOut", handleZoomOut);

  watch(editor, handlePendingData);

  const onChangeValue = (e) => {
    rpc.provider.signal("edit", e);
  }

  onBeforeUnmount(() => {
    rpc.destroy();
  });

  function handleGetFileData() {
    if (!editor.value) {
      return "";
    }
    const value = editor.value.instance.getValue();
    return JSON.stringify(value, null, 2);
  }

  function handleSetFileData(data) {
    editor.value?.instance.setValue(data);
  }

  function handleApplyEdits({ editOperations, notify }) {
    editor.value?.instance.applyEdits(editOperations, notify);
  }

  function handleSetInitialData(payload) {
    if (editor.value) {
      setInitialData(payload);
    } else {
      pendingInitialData = { ...payload };
    }
  }

  function handlePendingData() {
    if (pendingInitialData && editor.value) {
      setInitialData(pendingInitialData);
      pendingInitialData = null;
    }
  }

  function setInitialData({ data, editOperations }) {
    editor.value.instance.setValue(data);
    editor.value.instance.applyEdits(editOperations, false);
    nextTick(() => {
      editor.value.instance.fitCanvas(editor.value.instance.getZoom());
    });
  }

  function handleCreateStep({ type, name, notify }) {
    editor.value.instance.newNodeInCurrentViewWithOffset(
      type,
      NEW_STEP_OFFSET,
      { name },
      notify
    );
  }

  function handleSetZoom({ value }) {
    editor.value.instance.setZoom(value);
  }

  function handleZoomIn() {
    zoom.value = Math.ceil(zoom.value * 2);
  }

  function handleZoomOut() {
    zoom.value = Math.ceil(zoom.value / 2);
  }

  function handleFitCanvas({ maxZoom }) {
    editor.value.instance.fitCanvas(maxZoom);
  }

  function handleDeleteSelection({ notify }) {
    editor.value.instance.deleteSelectedObject(notify);
  }

  return {
    editor,
    zoom,
    edgeScrollSizes,
    onChangeValue
  }
}
