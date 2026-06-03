// Run `fn` only after `delay` ms have passed without a new call.
// Default delay = 300ms
// The returned function also has a .cancel() method to drop a pending call.
export function debounce(fn, delay = 300) {
  let timer = null;

  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }

  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}