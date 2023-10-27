/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_PORT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
