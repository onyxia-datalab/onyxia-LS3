import { createHomeLS3 } from "./HomeLS3";
import { registerPageContainerListener } from "./registerPageContainerListener";

window.onOnyxiaCtxReady = async ctx => {
    const { HomeLS3 } = await createHomeLS3(ctx);
    const { mount } = ctx.declareComponent(HomeLS3);

    registerPageContainerListener("home", containerElement => {
        mount(containerElement);
    });
};
