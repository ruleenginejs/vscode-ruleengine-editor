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
      @action-click="onActionClick"
      v-model:invalidate="toolbarInvalidate"
      :position-x="initToolbarPosition[0]"
      :position-y="initToolbarPosition[1]"
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
      toolbarInvalidate,
      initToolbarPosition,
      onActionClick
    } = useToolbar(editorRef, selectedModel);

    return {
      editorRef,
      toolbarRef,
      zoom,
      edgeScrollSizes,
      toolbarInvalidate,
      initToolbarPosition,
      onChangeValue,
      onChangeSelection,
      onActionClick
    };
  }
};
</script>

<style>
@import "editor";
</style>
