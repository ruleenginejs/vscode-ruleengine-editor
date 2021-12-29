import { ref, onBeforeUnmount, markRaw } from "vue"
import { ExthostRpc } from "@/utils/exthost-rpc";

const DEFAULT_EDIT_DELAY = 100;
const DEFAULT_COMPLETION_DELAY = 0;

export default function useInspector(vscode) {
  const rpc = new ExthostRpc(vscode);
  const dataModel = ref(null);
  const editDelay = ref(DEFAULT_EDIT_DELAY);
  const provider = ref(markRaw({
    suggestScriptFiles,
    getCompletionDelay
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

  function suggestScriptFiles(searchQuery) {
    return rpc.provider.rpc("suggestScriptFiles", searchQuery);
  }

  function getCompletionDelay() {
    return DEFAULT_COMPLETION_DELAY;
  }

  ready();

  return {
    dataModel,
    editDelay,
    provider,
    onEdit
  }
}
