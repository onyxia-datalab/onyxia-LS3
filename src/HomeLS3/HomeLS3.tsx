import type { ReactNode } from "react";
import type { OnyxiaCtx } from "../OnyxiaCtx";
import type { GitDialogOpenEvent } from "./HomeLS3GitDialog";
import { createHomeLS3GitDialog } from "./HomeLS3GitDialog";
import { createHomeLS3Hero } from "./HomeLS3Hero";
import { createHomeLS3InfoCard } from "./HomeLS3InfoCard";
import { createHomeLS3ServiceCard } from "./HomeLS3ServiceCard";

const serviceNames = ["RStudio", "VSCode"] as const;

type ServiceName = (typeof serviceNames)[number];

export async function createHomeLS3(
    ctx: OnyxiaCtx
): Promise<{ HomeLS3: () => ReactNode }> {
    const [
        React,
        { tss },
        { routes },
        { useCoreState },
        { PUBLIC_URL },
        { Evt },
        { Deferred },
        { useConst },
        { getIconUrlByName },
        Divider,
        { HomeLS3Hero },
        { HomeLS3ServiceCard },
        { HomeLS3InfoCard },
        { HomeLS3GitDialog }
    ] = await Promise.all([
        ctx.import("react"),
        ctx.import("tss"),
        ctx.import("ui/routes"),
        ctx.import("core"),
        ctx.import("env"),
        ctx.import("evt"),
        ctx.import("evt/tools/Deferred"),
        ctx.import("powerhooks/useConst"),
        ctx.import("lazy-icons"),
        ctx.import("@mui/material/Divider").then(m => m.default),
        createHomeLS3Hero(ctx),
        createHomeLS3ServiceCard(ctx),
        createHomeLS3InfoCard(ctx),
        createHomeLS3GitDialog(ctx)
    ]);

    void React;

    function HomeLS3() {
        const { classes, css, theme } = useStyles();
        const { user } = useCoreState("userAuthentication", "main");

        if (user === undefined) {
            throw new Error("AUTHENTICATION_GLOBALLY_REQUIRED should be set to true");
        }

        const evtGitDialogOpen = useConst(() => Evt.create<GitDialogOpenEvent>());

        const onServiceClick = async (serviceName: ServiceName) => {
            const dGitlabRepoUrl = new Deferred<string | undefined>();

            evtGitDialogOpen.post({
                serviceName,
                onUserResponse: params => {
                    switch (params.response) {
                        case "cancel":
                            break;
                        case "launch with git repo":
                            dGitlabRepoUrl.resolve(params.gitlabRepoUrl);
                            break;
                        case "launch without git repo":
                            dGitlabRepoUrl.resolve(undefined);
                            break;
                    }
                }
            });

            const gitlabRepoUrl = await dGitlabRepoUrl.pr;

            routes
                .launcher({
                    catalogId: "ide",
                    chartName: (() => {
                        switch (serviceName) {
                            case "RStudio":
                                return "rstudio-r-python-julia";
                            case "VSCode":
                                return "vscode-r-python-julia";
                        }
                    })(),
                    helmValuesPatch:
                        gitlabRepoUrl === undefined
                            ? undefined
                            : [
                                  {
                                      path: ["git", "repository"],
                                      value: gitlabRepoUrl
                                  }
                              ],
                    autoLaunch: true
                })
                .push();
        };

        return (
            <>
                <div className={classes.root}>
                    <HomeLS3Hero
                        userDisplayName={
                            user.firstName ?? user.familyName ?? user.username
                        }
                    />
                    <Divider />
                    <div className={classes.serviceCardsWrapper}>
                        {serviceNames.map(serviceName => (
                            <HomeLS3ServiceCard
                                className={classes.serviceCardsWrapperItem}
                                key={serviceName}
                                coverImageUrl={`${PUBLIC_URL}/custom-resources/assets/${(() => {
                                    switch (serviceName) {
                                        case "RStudio":
                                            return "RStudio.jpg";
                                        case "VSCode":
                                            return "VSCode.webp";
                                    }
                                })()}`}
                                onClick={() => onServiceClick(serviceName)}
                                serviceName={serviceName}
                                title={(() => {
                                    switch (serviceName) {
                                        case "RStudio":
                                            return "Pour coder en R";
                                        case "VSCode":
                                            return "Pour coder en Python";
                                    }
                                })()}
                            />
                        ))}
                    </div>
                    <Divider />
                    <div className={classes.infoCardsWrapper}>
                        <HomeLS3InfoCard
                            className={css({
                                backgroundColor:
                                    theme.colors.useCases.surfaces.surfaceFocus1
                            })}
                            title="Nouvel utilisateur ?"
                            body={
                                <>
                                    Prends en main la plateforme à travers
                                    <br />
                                    un guide d&apos;utilisation simple et rapide.
                                </>
                            }
                            icon={getIconUrlByName("Book")}
                            link={
                                routes.document({
                                    source: `${PUBLIC_URL}/custom-resources/docs/new-user.md`
                                }).link
                            }
                            buttonText="Démarrer le guide"
                        />
                        <HomeLS3InfoCard
                            title="Besoin d'aide ?"
                            body={
                                <>
                                    Une question, un problème ou besoin d&apos;assistance
                                    ?
                                    <br />
                                    Contactez l&apos;équipe en charge de la plateforme.
                                </>
                            }
                            icon={getIconUrlByName("ChatBubble")}
                            link={{
                                href: "https://tchap.fr",
                                onClick: () => {}
                            }}
                            buttonText="Contacter le support"
                        />
                    </div>
                </div>
                <HomeLS3GitDialog evtOpen={evtGitDialogOpen} />
            </>
        );
    }

    const useStyles = tss.withName({ HomeLS3 }).create(({ theme }: { theme: any }) => ({
        root: {
            height: "100%"
        },
        serviceCardsWrapper: {
            display: "flex",
            gap: theme.spacing(3),
            ...theme.spacing.topBottom("margin", 3)
        },
        serviceCardsWrapperItem: {
            width: 450
        },
        infoCardsWrapper: {
            display: "flex",
            gap: theme.spacing(3),
            ...theme.spacing.topBottom("margin", 3)
        }
    }));

    return { HomeLS3 };
}
