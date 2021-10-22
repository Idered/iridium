interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_ALGOLIA_APP_ID: string;
  readonly VITE_ALGOLIA_API_KEY: string;
  readonly VITE_ALGOLIA_INDEX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
