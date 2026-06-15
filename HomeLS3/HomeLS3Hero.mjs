/** @typedef {import("../types").OnyxiaCtx} OnyxiaCtx */
/** @typedef {import("react").ReactNode} ReactNode */

/**
 * @typedef {object} HomeLS3HeroProps
 * @property {string=} className
 * @property {string} userDisplayName
 */

/**
 * @param {OnyxiaCtx} ctx
 * @returns {Promise<{ HomeLS3Hero: (props: HomeLS3HeroProps) => ReactNode }>}
 */
export async function createHomeLS3Hero(ctx) {
    const [React, { tss }, { Text }, { PUBLIC_URL }] = await Promise.all([
        ctx.import("react"),
        ctx.import("tss"),
        ctx.import("onyxia-ui/Text"),
        ctx.import("env")
    ]);

    /** @param {HomeLS3HeroProps} props */
    function HomeLS3Hero(props) {
        const { className, userDisplayName } = props;
        const { cx, classes } = useStyles();

        return React.createElement(
            "div",
            { className: cx(classes.root, className) },
            React.createElement("img", {
                className: classes.img,
                src: `${PUBLIC_URL}/custom-resources/assets/onyxia-logo-LS3-normal.png`
            }),
            React.createElement(
                "div",
                { className: classes.textWrap },
                React.createElement(
                    "div",
                    null,
                    React.createElement(Text, {
                        typo: "page heading",
                        children: `Bienvenu ${userDisplayName}`
                    }),
                    React.createElement(Text, {
                        className: classes.subtitle,
                        typo: "label 1",
                        children:
                            "Demare ton service en quelque clicks et profite de la puissance de calcule de nos serveurs."
                    })
                )
            )
        );
    }

    const useStyles = tss.withName({ HomeLS3Hero }).create(({ theme }) => ({
        root: {
            display: "flex"
        },
        img: {
            height: 110,
            margin: theme.spacing(4)
        },
        textWrap: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
        },
        subtitle: {
            maxWidth: 450,
            color: theme.colors.useCases.typography.textTertiary
        }
    }));

    return { HomeLS3Hero };
}
