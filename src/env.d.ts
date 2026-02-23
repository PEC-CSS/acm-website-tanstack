interface ImportMetaEnv {
  readonly COMMIT_HASH: string;
  readonly PKG_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
