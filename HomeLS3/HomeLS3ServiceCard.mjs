/** @typedef {import("../types").OnyxiaCtx} OnyxiaCtx */
/** @typedef {import("react").ReactNode} ReactNode */

/**
 * @typedef {object} HomeLS3ServiceCardProps
 * @property {string=} className
 * @property {string} serviceName
 * @property {string} title
 * @property {string} coverImageUrl
 * @property {() => void} onClick
 */

/**
 * @param {OnyxiaCtx} ctx
 * @returns {Promise<{ HomeLS3ServiceCard: (props: HomeLS3ServiceCardProps) => ReactNode }>}
 */
export async function createHomeLS3ServiceCard(ctx) {
    const [React, { tss }, { Button }, { Text }] = await Promise.all([
        ctx.import("react"),
        ctx.import("tss"),
        ctx.import("onyxia-ui/Button"),
        ctx.import("onyxia-ui/Text")
    ]);

    /** @param {HomeLS3ServiceCardProps} props */
    function HomeLS3ServiceCard(props) {
        const { className, serviceName, title, coverImageUrl, onClick } = props;
        const { cx, classes } = useStyles();

        return React.createElement(
            "div",
            { className: cx(classes.root, className) },
            React.createElement("img", {
                className: classes.img,
                src: coverImageUrl
            }),
            React.createElement(
                "div",
                null,
                React.createElement(Text, {
                    typo: "object heading",
                    children: title
                }),
                React.createElement(Button, {
                    className: classes.button,
                    onClick,
                    children: `Demarer un ${serviceName}`
                })
            )
        );
    }

    const useStyles = tss.withName({ HomeLS3ServiceCard }).create(({ theme }) => ({
        root: {
            display: "flex",
            flexDirection: "column",
            padding: theme.spacing(3),
            backgroundColor: theme.colors.useCases.surfaces.surface1,
            borderRadius: theme.spacing(2),
            boxShadow: theme.shadows[1],
            "&:hover": {
                boxShadow: theme.shadows[6]
            }
        },
        img: {
            height: 120,
            objectFit: "cover",
            borderRadius: 3,
            marginBottom: theme.spacing(2)
        },
        button: {
            float: "inline-end",
            marginTop: theme.spacing(2)
        }
    }));

    return { HomeLS3ServiceCard };
}
