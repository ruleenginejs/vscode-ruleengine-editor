import { ref, onBeforeUnmount } from "vue";
import { EditorRpc } from "./editor-rpc";

const DEFAULT_ZOOM = 100;

const edgeScrollSizes = Object.freeze({
  edgeTopSize: { in: 10, out: 0 },
  edgeLeftSize: { in: 10, out: 0 },
  edgeRightSize: { in: 10, out: 0 },
  edgeBottomSize: { in: 10, out: 0 }
});

export default function useEditor(vscode) {
  debugger;
  const editor = ref(null);
  const zoom = ref(DEFAULT_ZOOM);
  const selectedModel = ref(null);

  const editorRpc = new EditorRpc(vscode, { zoom, editor, selectedModel });

  onBeforeUnmount(() => {
    debugger;
    editorRpc.destroy();
  });

  const onChangeValue = (e) => {
    debugger;
    editorRpc.sendEditSignal(e);
  }

  const onChangeSelection = (dataModel) => {
    debugger;
    selectedModel.value = dataModel;
  }

  return {
    editor,
    zoom,
    edgeScrollSizes,
    onChangeValue,
    onChangeSelection
  }
}
