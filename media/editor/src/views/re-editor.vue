<script setup>
import { inject } from 'vue';
import ReEditorHint from './re-editor-hint.vue';
import useEditor from './composables/use-editor';
import useToolbar from './composables/use-toolbar';

const vscode = inject('$vscode');
const {
  editorRef,
  zoom,
  edgeScrollSizes,
  selectedModel,
  rpc,
  onChangeValue,
  onChangeSelection
} = useEditor(vscode);

const {
  toolbarRef,
  actions: toolbarActions,
  invalidate: toolbarInvalidate,
  position: toolbarPosition,
  visible: toolbarVisible,
  vertical: toolbarVertical,
  showActionLabel: toolbarShowActionLabel,
  onActionClick: onToolbarAction,
  onMoveEnd: onToolbarMoveEnd
} = useToolbar(editorRef, selectedModel, rpc);
</script>

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
        <re-editor-hint />
      </template>
    </v-editor>
    <v-editor-toolbar
      v-if="toolbarVisible"
      ref="toolbarRef"
      :actions="toolbarActions"
      v-model:invalidate="toolbarInvalidate"
      v-model:vertical="toolbarVertical"
      v-model:show-action-label="toolbarShowActionLabel"
      :position-x="toolbarPosition.x"
      :position-y="toolbarPosition.y"
      @action-click="onToolbarAction"
      @moveend="onToolbarMoveEnd"
    />
  </div>
</template>

<style>
@import 'editor';
</style>
