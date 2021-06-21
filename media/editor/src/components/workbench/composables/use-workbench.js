import { ref, watch, onBeforeUnmount, nextTick } from "vue"
import { WorkbenchRpc } from './workbench-rpc';

export default function useWorkbench(vscode) {
  const editor = ref(null);
  const rpc = new WorkbenchRpc(vscode);

  let pendingInitialData = null;

  rpc.provider.registerRpcHandler("setInitialData", handleSetInitialData);
  rpc.provider.registerRpcHandler("getFileData", handleGetFileData);
  rpc.provider.registerRpcHandler("setFileData", handleSetFileData);
  rpc.provider.registerRpcHandler("applyEdits", handleApplyEdits);

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

  return {
    editor,
    onChangeValue
  }
}
