import { inject, InjectionKey, Ref } from "vue";

/**
 * @link https://github.com/pastelsky/bundlephobia/blob/28bde79bad73cd1ba0797889f2b77d11aac3424c/utils/index.js#L11
 */
export const formatSize = (value: number) => {
  let unit, size;
  if (Math.log10(value) < 3) {
    unit = "B";
    size = value;
  } else if (Math.log10(value) < 6) {
    unit = "kB";
    size = value / 1024;
  } else {
    unit = "MB";
    size = value / 1024 / 1024;
  }

  return { unit, size };
};

/**
 * @link https://github.com/pastelsky/bundlephobia/blob/28bde79bad73cd1ba0797889f2b77d11aac3424c/utils/index.js#L27
 */
export const formatTime = (value: number) => {
  let unit, size;
  if (value < 0.0005) {
    unit = "μs";
    size = Math.round(value * 1000000);
  } else if (value < 0.5) {
    unit = "ms";
    size = Math.round(value * 1000);
  } else {
    unit = "s";
    size = value;
  }

  return { unit, size };
};

const DownloadSpeed = {
  SLOW_3G: 400,
  FAST_3G: 1000,
  SLOW_4G: 1750,
  FAST_4G: 7500,
};

/**
 * @link https://github.com/pastelsky/bundlephobia/blob/28bde79bad73cd1ba0797889f2b77d11aac3424c/utils/index.js#L50
 */
export const getTimeFromSize = (sizeInBytes: number) => {
  return {
    slow3G: sizeInBytes / 1024 / DownloadSpeed.SLOW_3G,
    fast3G: sizeInBytes / 1024 / DownloadSpeed.FAST_3G,
    slow4G: sizeInBytes / 1024 / DownloadSpeed.SLOW_4G,
    fast4G: sizeInBytes / 1024 / DownloadSpeed.FAST_4G,
  };
};

export const configKey: InjectionKey<
  Ref<{
    showAnalyzeTab: boolean;
  }>
> = Symbol();

export const useConfig = () => {
  return inject(configKey);
};
