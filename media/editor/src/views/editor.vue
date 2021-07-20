<template>
  <div class="editor-container">
    <v-editor
      ref="editor"
      v-model:zoom="zoom"
      :edge-scroll-sizes="edgeScrollSizes"
      @change-value="onChangeValue"
    >
      <template #empty-text>
        Press <a href=""><span class="codicon codicon-plus"></span></a> to add
        new step.
      </template>
    </v-editor>
  </div>
</template>

<script>
import { inject } from "vue";
import useEditor from "./composables/use-editor";

export default {
  name: "editor",
  setup() {
    const vscode = inject("$vscode");
    const { editor, zoom, edgeScrollSizes, onChangeValue } = useEditor(vscode);

    return {
      editor,
      zoom,
      edgeScrollSizes,
      onChangeValue
    };
  }
};
</script>

<style>
@import "editor";
</style>
