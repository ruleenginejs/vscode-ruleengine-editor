<script setup>
import { inject } from "vue";
import useInspector from "./composables/use-inspector";

const vscode = inject("$vscode");
const {
  dataModel,
  editDelay,
  provider,
  onEdit
} = useInspector(vscode);
</script>

<template>
  <div class="inspector-container">
    <v-editor-sidebar
      :selected-object="dataModel"
      :edit-delay="editDelay"
      :provider="provider"
      @edit="onEdit"
    />
  </div>
</template>

<style>
@import "inspector";
</style>
