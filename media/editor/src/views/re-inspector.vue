<script setup>
import { inject } from "vue";
import useInspector from "./composables/use-inspector";

const vscode = inject("$vscode");
const {
  dataModel,
  editDelay,
  onEdit
} = useInspector(vscode);
</script>

<template>
  <div class="inspector-container">
    <v-editor-sidebar :selected-object="dataModel" :edit-delay="editDelay" @edit="onEdit" />
  </div>
</template>

<style>
@import "inspector";
</style>
