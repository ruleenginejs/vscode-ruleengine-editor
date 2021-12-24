<template>
  <div class="editor-container">
    <v-editor
      ref="editor"
      v-model:zoom="zoom"
      :edge-scroll-sizes="edgeScrollSizes"
      @change-value="onChangeValue"
      @change-selection="onChangeSelection"
    >
      <template #empty>
        <editor-hint />
      </template>
    </v-editor>
  </div>
</template>

<script>
import { inject } from "vue";
import EditorHint from "./editor-hint.vue";
import useEditor from "./composables/use-editor";

export default {
  name: "editor",
  components: {
    EditorHint
  },
  setup() {
    const vscode = inject("$vscode");
    const {
      editor,
      zoom,
      edgeScrollSizes,
      onChangeValue,
      onChangeSelection
    } = useEditor(vscode);

    return {
      editor,
      zoom,
      edgeScrollSizes,
      onChangeValue,
      onChangeSelection
    };
  }
};
</script>

<style>
@import "editor";
</style>
