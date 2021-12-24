import { ref, computed, onMounted, onUnmounted, watchEffect } from "vue";
import { toolbar, toolbarDefaults } from "@ruleenginejs/editor";
import debounce from "debounce";

const RESIZE_DELAY = 300;
const INIT_TOOLBAR_POSITION = [-15, 15];

export default function useToolbar(editorRef, selectedModel) {
  const toolbarRef = ref(null);
  const toolbarInvalidate = ref(false);
  const resizeHandler = debounce(onResize, RESIZE_DELAY);
  const initToolbarPosition = INIT_TOOLBAR_POSITION;

  const canDeleteSelectedModel = computed(() => {
    return editorRef.value
      ? editorRef.value.instance.canDeleteModelObject(selectedModel.value)
      : false;
  });

  const canAddStartNode = computed(() => {
    return editorRef.value
      ? !editorRef.value.instance.getModel().startNode
      : false;
  });

  const canAddErrorNode = computed(() => {
    return editorRef.value
      ? !editorRef.value.instance.getModel().errorNode
      : false;
  });

  watchEffect(() => {
    const enabled = canDeleteSelectedModel.value;
    toolbarRef.value?.enableAction(toolbarDefaults.defaultActionKey.remove, enabled);
  });

  watchEffect(() => {
    const enabled = canAddStartNode.value;
    toolbarRef.value?.enableAction(toolbarDefaults.defaultActionKey.addStart, enabled);
  });

  watchEffect(() => {
    const enabled = canAddErrorNode.value;
    toolbarRef.value?.enableAction(toolbarDefaults.defaultActionKey.addError, enabled);
  });

  onMounted(() => {
    window.addEventListener("resize", resizeHandler);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", resizeHandler);
  });

  function onResize() {
    toolbarInvalidate.value = true;
  }

  function onActionClick(action, e) {
    if (editorRef.value?.instance) {
      toolbar.handleAction(editorRef.value.instance, action.id, e);
    }
  }

  return {
    toolbarRef,
    toolbarInvalidate,
    initToolbarPosition,
    onActionClick
  }
}
