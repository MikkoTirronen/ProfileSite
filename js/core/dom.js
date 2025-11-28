export function createComponent(renderFn) {
  return (...args) => renderFn(...args);
}
