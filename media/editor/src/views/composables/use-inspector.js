import { ref, onBeforeUnmount, markRaw } from 'vue';
import { ExthostRpc } from '@/utils/exthost-rpc';
import {
  DEFAULT_CHECK_EXISTS_DELAY,
  DEFAULT_COMPLETION_DELAY,
  DEFAULT_EDIT_DELAY,
  DEFAULT_USER_PROPS_UPDATE_DELAY
} from './const';

export default function useInspector(vscode) {
  const dataModel = ref(null);
  const editDelay = ref(DEFAULT_EDIT_DELAY);
  const provider = ref(
    markRaw({
      getCompletionDelay,
      getCheckExistsDelay,
      suggestScriptFiles,
      openScriptFile,
      newScriptFile,
      scriptFileExists,
      getUserPropsUpdateDelay,
      getUserPropsConfig
    })
  );

  const rpc = new ExthostRpc(vscode);

  const onEdit = e => {
    rpc.provider.signal('edit', e);
  };

  onBeforeUnmount(() => {
    rpc.destroy();
  });

  function ready() {
    rpc.provider.signal('ready');
  }

  rpc.provider.registerRpcHandler('setData', setData);

  function setData(data) {
    dataModel.value = data;
  }

  function getCompletionDelay() {
    return DEFAULT_COMPLETION_DELAY;
  }

  function getCheckExistsDelay() {
    return DEFAULT_CHECK_EXISTS_DELAY;
  }

  function getUserPropsUpdateDelay() {
    return DEFAULT_USER_PROPS_UPDATE_DELAY;
  }

  function suggestScriptFiles(searchQuery) {
    return rpc.provider.rpc('suggestScriptFiles', searchQuery);
  }

  function openScriptFile(filePath) {
    rpc.provider.rpc('openScriptFile', filePath);
  }

  function newScriptFile(opt) {
    return rpc.provider.rpc('newScriptFile', opt);
  }

  function scriptFileExists(filePath) {
    return rpc.provider.rpc('scriptFileExists', filePath);
  }

  function getUserPropsConfig(filePath) {
    return rpc.provider.rpc('getUserPropsConfig', filePath);
  }

  ready();

  return {
    dataModel,
    editDelay,
    provider,
    onEdit
  };
}
