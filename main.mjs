import { createHomeLS3 } from "./HomeLS3.mjs";
import { registerPageContainerListener } from "./registerPageContainerListener.mjs";

/** @typedef {import("./Onyxia").Onyxia} Onyxia */

/** @param {Onyxia} onyxia */
async function main(onyxia) {

    const { HomeLS3 } = await onyxia.import("ui/shared/HomeLS3");
    //const { HomeLS3 } = await createHomeLS3(onyxia);

    registerPageContainerListener("home", element => {

        element.innerHTML = "";

        onyxia.mountComponent({
            Component: HomeLS3,
            container: element
        });

    });

}

window.addEventListener("onyxiaready", () => {
    main(/** @type {Onyxia} */ (window.onyxia));
});
