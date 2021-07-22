<template>
  <div class="inspector-container">
    <v-editor-sidebar :selected-object="dataModel" @edit="onEdit" />
  </div>
</template>

<script>
import { inject } from "vue";
import useInspector from "./composables/use-inspector";

export default {
  name: "inspector",
  setup() {
    const vscode = inject("$vscode");
    const { dataModel, onEdit } = useInspector(vscode);

    return {
      dataModel,
      onEdit
    };
  }
};
</script>

<style>
@import "inspector";
</style>
