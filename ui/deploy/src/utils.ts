import { inject, InjectionKey, onBeforeMount, provide, ref, Ref } from "vue";
import Pusher from "pusher-js";
import { API } from "./api";
import { BackgroundEvents } from "./enums";

export const configKey: InjectionKey<
  Ref<{
    secrets: Record<string, string>;
  }>
> = Symbol();

export const useConfig = () => {
  return inject(configKey);
};

export const useConfigRoot = () => {
  const config = ref<{
    secrets: {
      vercel?: string;
    };
  }>({
    secrets: {},
  });

  window.addEventListener("message", async (message) => {
    if (message.data?.type === "CONFIG_UPDATED") {
      config.value = await API.getConfig();
    }
  });

  onBeforeMount(async () => {
    config.value = await API.getConfig();
  });

  return config;
};

export const usePusher = () => {
  const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
    cluster: import.meta.env.VITE_PUSHER_CLUSTER,
  });

  return pusher;
};

export const useBackgroundEvent = (id: BackgroundEvents, cb: () => void) => {
  window.addEventListener("message", async (message) => {
    if (message.data?.type === id) {
      cb();
    }
  });
};
