/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_BASE_URL: string
    readonly VITE_GITHUB_REPOSITORY_URL: string
    readonly VITE_GITHUB_SPONSER_URL: string
}
interface ImportMeta {
    readonly env: ImportMetaEnv
}