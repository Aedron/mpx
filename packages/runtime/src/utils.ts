export function injectReadonly(target: object, key: string, value: any): void {
  if (target.hasOwnProperty(key)) {
    console.info(`Skip inject "${key}" on ${target.toString()}, it's already exists.`);
    return;
  }

  Object.defineProperty(target, key, {
    value,
    configurable: false,
  });
}

export function injectGlobalReadonly(key: string, value: any) {
  return injectReadonly(global, key, value);
}
