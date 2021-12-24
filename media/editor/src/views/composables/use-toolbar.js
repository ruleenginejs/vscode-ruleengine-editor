import { ref, computed, onMounted, onUnmounted, watchEffect, watch, reactive } from "vue";
import { toolbar, toolbarDefaults } from "@ruleenginejs/editor";
import debounce from "debounce";

const RESIZE_DELAY = 300;
const INIT_TOOLBAR_POSITION = [400, 15];

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
  const invalidate = ref(false);
  const positionX = ref(INIT_TOOLBAR_POSITION[0]);
  const positionY = ref(INIT_TOOLBAR_POSITION[1]);
  const resizeHandler = debounce(onResize, RESIZE_DELAY);
  const actions = reactive(actionDefs);

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

  watch([positionX, positionY], () => {
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

  function handleAddStep() {
    const a = document.createElement("a");
    a.href = "command:ruleengine.ruleEditor.addStep";
    document.body.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);
  }

  return {
    toolbarRef,
    actions,
    invalidate,
    positionX,
    positionY,
    onActionClick
  }
}