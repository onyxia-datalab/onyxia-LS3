/** @typedef {import("../types").OnyxiaCtx} OnyxiaCtx */
/** @typedef {import("react").ReactNode} ReactNode */

/**
 * @typedef {object} HomeLS3InfoCardProps
 * @property {string=} className
 * @property {ReactNode} title
 * @property {ReactNode} body
 * @property {string} icon
 * @property {ReactNode} buttonText
 * @property {{ href: string, onClick: (event?: any) => void, doOpenNewTabIfHref?: boolean }} link
 */

/**
 * @param {OnyxiaCtx} ctx
 * @returns {Promise<{ HomeLS3InfoCard: (props: HomeLS3InfoCardProps) => ReactNode }>}
 */
export async function createHomeLS3InfoCard(ctx) {
    const [React, { tss }, { Button }, { Text }] = await Promise.all([
        ctx.import("react"),
        ctx.import("tss"),
        ctx.import("onyxia-ui/Button"),
        ctx.import("onyxia-ui/Text")
    ]);

    /** @param {HomeLS3InfoCardProps} props */
    function HomeLS3InfoCard(props) {
        const { className, title, body, icon, buttonText, link } = props;
        const { cx, classes } = useStyles();

        return React.createElement(
            "div",
            { className: cx(classes.root, className) },
            React.createElement(Text, {
                className: classes.title,
                typo: "object heading",
                children: title
            }),
            React.createElement(Text, {
                className: classes.body,
                typo: "body 1",
                children: body
            }),
            React.createElement(
                Button,
                Object.assign(
                    {
                        className: classes.button,
                        startIcon: icon,
                        children: buttonText
                    },
                    link
                )
            )
        );
    }

    const useStyles = tss.withName({ HomeLS3InfoCard }).create(({ theme }) => ({
        root: {
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 200,
            padding: theme.spacing(4),
            backgroundColor: theme.colors.useCases.surfaces.surface1,
            borderRadius: theme.spacing(2),
            boxShadow: theme.shadows[1],
            "&:hover": {
                boxShadow: theme.shadows[6]
            }
        },
        title: {
            color: theme.colors.useCases.typography.textPrimary
        },
        body: {
            maxWidth: 560,
            marginTop: theme.spacing(2),
            color: theme.colors.useCases.typography.textSecondary
        },
        button: {
            alignSelf: "flex-end",
            marginTop: "auto"
        }
    }));

    return { HomeLS3InfoCard };
}
