import { createHomeLS3 } from "./HomeLS3/index.mjs";
import { registerPageContainerListener } from "./registerPageContainerListener.mjs";

window.onOnyxiaCtxReady = async ctx => {

    //const { HomeLS3 } = await ctx.import("ui/shared/HomeLS3");
    const { HomeLS3 } = await createHomeLS3(ctx);

    const { mount: mountHomeLS3 } = ctx.declareComponent(HomeLS3);

    registerPageContainerListener("home", element => {

        element.innerHTML = "";

        mountHomeLS3(element);

    });

};
