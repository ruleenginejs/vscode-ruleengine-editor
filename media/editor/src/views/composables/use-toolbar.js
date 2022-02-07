import { ref, computed, onMounted, onUnmounted, watchEffect, reactive } from "vue";
import { toolbar, toolbarDefaults } from "@ruleenginejs/editor";
import debounce from "debounce";
import { executeCommand } from "@/utils/exthost";
import { DEFAULT_POSITION, RESIZE_DELAY } from "./const";

const actionKeys = {
  addStep: "addStep"
};

const actionDefs = [
  {
    id: actionKeys.addStep,
    icon: "plus",
    title: "Add Step",
    label: "Add Step",
    disabled: false,
    visible: true,
    draggable: false,
    order: 1
  }
];

export default function useToolbar(editorRef, selectedModel) {
  const toolbarRef = ref(null);
  const visible = ref(true);
  const invalidate = ref(false);
  const vertical = ref(false);
  const showActionLabel = ref(false);
  const position = reactive(DEFAULT_POSITION);
  const resizeHandler = debounce(onResize, RESIZE_DELAY);
  const actions = reactive(actionDefs);

  const canDeleteSelectedModel = computed(() =>
    editorRef.value ? editorRef.value.instance.canDeleteModelObject(selectedModel.value) : false);

  const canAddStartNode = computed(() =>
    editorRef.value ? !editorRef.value.instance.getModel().startNode : false);

  const canAddErrorNode = computed(() =>
    editorRef.value ? !editorRef.value.instance.getModel().errorNode : false);

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
    toolbar.registerActionHandler(actionKeys.addStep, handleAddStep);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", resizeHandler);
    toolbar.unregisterActionHandler(actionKeys.addStep, handleAddStep);
  });

  function onResize() {
    invalidate.value = true;
  }

  function onActionClick(action, e) {
    if (editorRef.value?.instance) {
      toolbar.handleAction(editorRef.value.instance, action.id, e);
    }
  }

  function onMoveEnd() {
  }

  function handleAddStep() {
    executeCommand("ruleengine.ruleEditor.addStep");
  }

  return {
    toolbarRef,
    actions,
    invalidate,
    position,
    vertical,
    visible,
    showActionLabel,
    onActionClick,
    onMoveEnd
  }
}
