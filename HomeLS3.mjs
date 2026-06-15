
/** @typedef {import("./types").OnyxiaCtx} OnyxiaCtx */

/** @param {OnyxiaCtx} ctx */
export async function createHomeLS3(ctx) {

    const [
        React,
        { tss },
        { Text }
    ] = await Promise.all([
        ctx.import("react"),
        ctx.import("tss"),
        ctx.import("onyxia-ui/Text"),
    ]);

    function HomeLS3() {

        const { classes } = useStyles();

        return React.createElement(
            Text,
            {
                typo: "object heading",
                className: classes.root,
                children: "My Alternative Home With Onyxia-ui Text"
            }
        );
    }

    const useStyles = tss
        .withName({ HomeLS3 })
        .create(() => ({
            root: {
                margin: 0,
                padding: 0,
                border: "4px solid red",
                height: "100%"
            }
        }));

    return { HomeLS3 };

}
