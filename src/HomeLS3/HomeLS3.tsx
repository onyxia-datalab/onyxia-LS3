import type { OnyxiaCtx } from "../OnyxiaCtx";
import type { Props_HomeLS3LaunchDialog } from "./HomeLS3LaunchDialog";
import type { UnpackEvt } from "evt";
import { createHomeLS3LaunchDialog } from "./HomeLS3LaunchDialog";
import { createHomeLS3Hero } from "./HomeLS3Hero";
import { createHomeLS3InfoCard } from "./HomeLS3InfoCard";
import { createHomeLS3ServiceCard } from "./HomeLS3ServiceCard";

type ServiceName = "RStudio" | "VSCode";

const serviceNames: ServiceName[] = ["RStudio", "VSCode"] as const;

export async function createHomeLS3(
    ctx: OnyxiaCtx
) {
    const [
        React,
        { tss },
        { routes },
        { useCoreState },
        { PUBLIC_URL },
        tsafe,
        { Evt },
        { Deferred },
        { useConst },
        { getIconUrlByName },
        Divider,
        { HomeLS3Hero },
        { HomeLS3ServiceCard },
        { HomeLS3InfoCard },
        { HomeLS3LaunchDialog }
    ] = await Promise.all([
        ctx.import("react"),
        ctx.import("tss"),
        ctx.import("ui/routes"),
        ctx.import("core"),
        ctx.import("env"),
        ctx.import("tsafe"),
        ctx.import("evt"),
        ctx.import("evt/tools/Deferred"),
        ctx.import("powerhooks/useConst"),
        ctx.import("lazy-icons"),
        ctx.import("@mui/material/Divider").then(m => m.default),
        createHomeLS3Hero(ctx),
        createHomeLS3ServiceCard(ctx),
        createHomeLS3InfoCard(ctx),
        createHomeLS3LaunchDialog(ctx)
    ]);

    void React;

    const assert: typeof import("tsafe").assert = tsafe.assert;

    function HomeLS3() {
        const { classes, css, theme } = useStyles();

        const { user } = useCoreState("userAuthentication", "main");
        assert(user !== undefined, "AUTHENTICATION_GLOBALLY_REQUIRED should be set to true");

        const evtGitDialogOpen = useConst(() =>
            Evt.create<UnpackEvt<Props_HomeLS3LaunchDialog["evtOpen"]>>()
        );

        const onServiceClick = async (serviceName: ServiceName) => {
            const dGitlabRepoUrl = new Deferred<string | undefined>();

            evtGitDialogOpen.post({
                serviceName,
                serviceIconUrl: `${PUBLIC_URL}/custom-resources/assets/${(() => {
                    switch (serviceName) {
                        case "RStudio":
                            return "rstudio_logo.webp";
                        case "VSCode":
                            return "vscode_logo.png";
                    }
                })()}`,
                onUserResponse: params => {
                    switch (params.response) {
                        case "cancel":
                            // Do nothing, pending forever.
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
                                return "rstudio";
                            case "VSCode":
                                return "vscode-python";
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
                                            return "Démarrer un RStudio rapidement";
                                        case "VSCode":
                                            return "Démarrer un VSCode (Python) rapidement";
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
                                    un guide d'utilisation simple et rapide.
                                </>
                            }
                            icon={getIconUrlByName("Book")}
                            link={
                                routes.document({
                                    source: `${PUBLIC_URL}/custom-resources/docs/new-user.md`
                                }).link
                            }
                            buttonText="Lire le guide d'utilisation"
                        />
                        <HomeLS3InfoCard
                            title="Besoin d'aide ?"
                            body={
                                <>
                                    Une question, un problème ou besoin d'assistance ?<br />
                                    Contactez l'équipe en charge de la plateforme.
                                </>
                            }
                            icon={getIconUrlByName("ChatBubble")}
                            link={
                                routes.document({
                                    source: `${PUBLIC_URL}/custom-resources/docs/contact-support.md`
                                }).link
                            }
                            buttonText="Contacter le support"
                        />
                    </div>
                </div>
                <HomeLS3LaunchDialog evtOpen={evtGitDialogOpen} />
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
