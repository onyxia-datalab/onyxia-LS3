export type { OnyxiaCtx } from "../../src/pluginSystem/pluginSystem";
export type { Link } from "../../src/ui/routes";

declare global {
    interface Window {
        onOnyxiaCtxReady?: (onyxiaCtx: OnyxiaCtx) => void;
    }
}