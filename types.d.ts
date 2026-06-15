
export type { OnyxiaCtx } from "../../src/pluginSystem";

declare global {
    interface Window {
        onOnyxiaCtxReady?: (onyxiaCtx: OnyxiaCtx)=> void;
    }
}