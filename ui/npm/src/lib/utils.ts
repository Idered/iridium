import { DownloadSpeed } from "../enums";
import { store } from "./store";

/**
 * @link https://github.com/pastelsky/bundlephobia/blob/28bde79bad73cd1ba0797889f2b77d11aac3424c/utils/index.js#L11
 */
export const formatSize = (value: number) => {
  let unit: string;
  let size: number;
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
  let unit: string;
  let size: number;
  if (value < 0.0005) {
    unit = "μs";
    size = Math.round(value * 1_000_000);
  } else if (value < 0.5) {
    unit = "ms";
    size = Math.round(value * 1000);
  } else {
    unit = "s";
    size = value;
  }

  return { unit, size };
};

/**
 * @link https://github.com/pastelsky/bundlephobia/blob/28bde79bad73cd1ba0797889f2b77d11aac3424c/utils/index.js#L50
 */
export const getTimeFromSize = (sizeInBytes: number) => {
  return {
    slow3G: sizeInBytes / 1024 / DownloadSpeed.Slow3G,
    fast3G: sizeInBytes / 1024 / DownloadSpeed.Fast3G,
    slow4G: sizeInBytes / 1024 / DownloadSpeed.Slow4G,
    fast4G: sizeInBytes / 1024 / DownloadSpeed.Fast4G,
  };
};

export function getTypingsPackageName(packageName: string) {
  if (packageName.startsWith("@types/")) {
    return "";
  }
  return `@types/${packageName.replace(/^@/, "").replace(/\//g, "__")}`;
}

export const withUpdate = async (
  packageName: string | string[] | undefined,
  callback: () => Promise<void>
) => {
  if (!packageName) {
    return;
  }
  if (Array.isArray(packageName)) {
    packageName.forEach((name) => store.commit("addUpdatingPackage", name));
  } else {
    store.commit("addUpdatingPackage", packageName);
  }
  await callback();
  if (Array.isArray(packageName)) {
    packageName.forEach((name) => store.commit("deleteUpdatingPackage", name));
  } else {
    store.commit("deleteUpdatingPackage", packageName);
  }
};
