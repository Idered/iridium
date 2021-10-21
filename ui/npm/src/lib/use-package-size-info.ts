import { ref } from "vue";
import { API } from "./api";
import { PackageSizeInfo } from "../types";
import { getTimeFromSize } from "./utils";

const usePackageSizeInfo = () => {
  const cache = ref(new Map<string, PackageSizeInfo>());

  const getPackageSizeInfo = async (name: string, version: string) => {
    try {
      if (name.startsWith("@types/")) {
        return null;
      }
      const key = `${name}@${version}`;
      if (cache.value.has(key)) {
        return cache.value.get(key);
      }
      const data = await API.getSizeInfo(key);
      return cache.value
        .set(key, {
          name: data.name,
          size: data.size,
          gzip: data.gzip,
          threeG: getTimeFromSize(data.gzip).slow3G,
          fourG: getTimeFromSize(data.gzip).slow4G,
        })
        .get(key);
    } catch (err) {
      return null;
    }
  };

  return { getPackageSizeInfo };
};

export { usePackageSizeInfo };
