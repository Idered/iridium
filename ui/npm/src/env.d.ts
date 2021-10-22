/// <reference types="vite/client" />
/// <reference types="vue/ref-macros" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv
  extends Readonly<Record<string, string | boolean | undefined>> {
  readonly VITE_ALGOLIA_APP_ID: string;
  readonly VITE_ALGOLIA_API_KEY: string;
  readonly VITE_ALGOLIA_INDEX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
