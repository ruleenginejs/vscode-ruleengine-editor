<template>
  <div class="v-workbench">
    <v-editor
      ref="editor"
      v-model:zoom="zoom"
      :edge-scroll-sizes="edgeScrollSizes"
      @change-value="onChangeValue"
    />
  </div>
</template>

<script>
import { inject } from "vue";
import useWorkbench from "./composables/use-workbench";

export default {
  name: "v-workbench",
  setup() {
    const vscode = inject("$vscode");
    const { editor, zoom, edgeScrollSizes, onChangeValue } =
      useWorkbench(vscode);

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
@import "workbench";
</style>
