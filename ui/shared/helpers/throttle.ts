export function throttle(
  func: (...args: any[]) => void,
  duration: number = 100
) {
  let shouldWait = false;

  return function (this: any, ...args: []) {
    if (!shouldWait) {
      func.apply(this, args);
      shouldWait = true;
      setTimeout(function () {
        shouldWait = false;
      }, duration);
    }
  };
}
