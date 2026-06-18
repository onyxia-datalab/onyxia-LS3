import type { ReactNode } from "react";
import type { OnyxiaCtx } from "../OnyxiaCtx";

export type Props = {
    className?: string;
    serviceName: string;
    title: string;
    coverImageUrl: string;
    onClick: () => void;
};

export async function createHomeLS3ServiceCard(
    ctx: OnyxiaCtx
): Promise<{ HomeLS3ServiceCard: (props: Props) => ReactNode }> {
    const [React, { tss }, { Button }, { Text }] = await Promise.all([
        ctx.import("react"),
        ctx.import("tss"),
        ctx.import("onyxia-ui/Button"),
        ctx.import("onyxia-ui/Text")
    ]);

    void React;

    function HomeLS3ServiceCard(props: Props) {
        const { className, serviceName, title, coverImageUrl, onClick } = props;
        const { cx, classes } = useStyles();

        return (
            <div className={cx(classes.root, className)}>
                <img className={classes.img} src={coverImageUrl} />
                <div>
                    <Text typo="object heading">{title}</Text>
                    <Button className={classes.button} onClick={onClick}>
                        Démarrer un {serviceName}
                    </Button>
                </div>
            </div>
        );
    }

    const useStyles = tss
        .withName({ HomeLS3ServiceCard })
        .create(({ theme }: { theme: any }) => ({
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
                marginBottom: theme.spacing(3)
            },
            button: {
                float: "inline-end",
                marginTop: theme.spacing(5)
            }
        }));

    return { HomeLS3ServiceCard };
}
