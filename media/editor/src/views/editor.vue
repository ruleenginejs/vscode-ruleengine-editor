<template>
  <div class="editor-container">
    <v-editor
      ref="editorRef"
      v-model:zoom="zoom"
      :edge-scroll-sizes="edgeScrollSizes"
      @change-value="onChangeValue"
      @change-selection="onChangeSelection"
    >
      <template #empty>
        <editor-hint />
      </template>
    </v-editor>
    <v-editor-toolbar
      ref="toolbarRef"
      :actions="toolbarActions"
      v-model:invalidate="toolbarInvalidate"
      :position-x="toolbarPosition[0]"
      :position-y="toolbarPosition[1]"
      @action-click="onActionClick"
      @moveend="onToolbarMoveEnd"
    />
  </div>
</template>

<script>
import { inject } from "vue";
import EditorHint from "./editor-hint.vue";
import useEditor from "./composables/use-editor";
import useToolbar from "./composables/use-toolbar";

export default {
  name: "editor",
  components: {
    EditorHint
  },
  setup() {
    const vscode = inject("$vscode");

    const {
      editorRef,
      zoom,
      edgeScrollSizes,
      selectedModel,
      onChangeValue,
      onChangeSelection
    } = useEditor(vscode);

    const {
      toolbarRef,
      actions: toolbarActions,
      invalidate: toolbarInvalidate,
      initPosition: toolbarPosition,
      onActionClick,
      onMoveEnd: onToolbarMoveEnd
    } = useToolbar(editorRef, selectedModel);

    return {
      editorRef,
      toolbarRef,
      zoom,
      edgeScrollSizes,
      toolbarActions,
      toolbarInvalidate,
      toolbarPosition,
      onChangeValue,
      onChangeSelection,
      onActionClick,
      onToolbarMoveEnd
    };
  }
};
</script>

<style>
@import "editor";
</style>
