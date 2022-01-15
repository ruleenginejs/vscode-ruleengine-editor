import { ref, onBeforeUnmount, markRaw } from "vue"
import { ExthostRpc } from "@/utils/exthost-rpc";

const DEFAULT_EDIT_DELAY = null;
const DEFAULT_COMPLETION_DELAY = null;
const DEFAULT_CHECK_EXISTS_DELAY = 100;

export default function useInspector(vscode) {
  const rpc = new ExthostRpc(vscode);
  const dataModel = ref(null);
  const editDelay = ref(DEFAULT_EDIT_DELAY);
  const provider = ref(markRaw({
    getCompletionDelay,
    getCheckExistsDelay,
    suggestScriptFiles,
    openScriptFile,
    newScriptFile,
    scriptFileExists
  }));

  const onEdit = (e) => {
    rpc.provider.signal("edit", e);
  }

  onBeforeUnmount(() => {
    rpc.destroy();
  });

  function ready() {
    rpc.provider.signal("ready");
  }

  rpc.provider.registerRpcHandler("setData", setData);

  function setData(data) {
    dataModel.value = data;
  }

  function getCompletionDelay() {
    return DEFAULT_COMPLETION_DELAY;
  }

  function getCheckExistsDelay() {
    return DEFAULT_CHECK_EXISTS_DELAY;
  }

  function suggestScriptFiles(searchQuery) {
    return rpc.provider.rpc("suggestScriptFiles", searchQuery);
  }

  function openScriptFile(filePath) {
    rpc.provider.rpc("openScriptFile", filePath);
  }

  function newScriptFile(opt) {
    return rpc.provider.rpc("newScriptFile", opt);
  }

  function scriptFileExists(filePath) {
    return rpc.provider.rpc("scriptFileExists", filePath);
  }

  ready();

  return {
    dataModel,
    editDelay,
    provider,
    onEdit
  }
}
