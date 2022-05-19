import { isDefined } from './types';

export function executeCommand(command, params = null) {
  const a = document.createElement('a');
  const uri = new URL(`command:${command}`);
  if (isDefined(params)) {
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        uri.searchParams.set(key, params[key]);
      }
    });
  }
  a.href = uri.href;
  document.body.appendChild(a);
  a.click();
  a.parentNode.removeChild(a);
}
