import { createHomeLS3GitDialog } from "./HomeLS3GitDialog.mjs";
import { createHomeLS3Hero } from "./HomeLS3Hero.mjs";
import { createHomeLS3InfoCard } from "./HomeLS3InfoCard.mjs";
import { createHomeLS3ServiceCard } from "./HomeLS3ServiceCard.mjs";

/** @typedef {import("../types").OnyxiaCtx} OnyxiaCtx */
/** @typedef {import("react").ReactNode} ReactNode */
/** @typedef {import("./HomeLS3GitDialog.mjs").GitDialogOpenEvent} GitDialogOpenEvent */

/**
 * @typedef {"RStudio" | "VSCode"} ServiceName
 */

/** @type {readonly ServiceName[]} */
const serviceNames = ["RStudio", "VSCode"];

/**
 * @param {OnyxiaCtx} ctx
 * @returns {Promise<{ HomeLS3: () => ReactNode }>}
 */
export async function createHomeLS3(ctx) {
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

    function HomeLS3() {
        const { classes, css, theme } = useStyles();
        const { user } = useCoreState("userAuthentication", "main");

        if (user === undefined) {
            throw new Error(
                "AUTHENTICATION_GLOBALLY_REQUIRED should be set to true"
            );
        }

        const evtGitDialogOpen = useConst(
            () =>
                /** @type {import("evt").Evt<GitDialogOpenEvent>} */ (
                    /** @type {unknown} */ (Evt.create())
                )
        );

        /** @param {ServiceName} serviceName */
        const onServiceClick = async serviceName => {
            /** @type {import("evt/tools/Deferred").Deferred<string | undefined>} */
            const dGitlabRepoUrl = new Deferred();

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

        return React.createElement(
            React.Fragment,
            null,
            React.createElement(
                "div",
                { className: classes.root },
                React.createElement(HomeLS3Hero, {
                    userDisplayName:
                        user.firstName ?? user.familyName ?? user.username
                }),
                React.createElement(Divider, null),
                React.createElement(
                    "div",
                    { className: classes.serviceCardsWrapper },
                    serviceNames.map(serviceName =>
                        React.createElement(HomeLS3ServiceCard, {
                            className: classes.serviceCardsWrapperItem,
                            key: serviceName,
                            coverImageUrl: `${PUBLIC_URL}/custom-resources/assets/${(() => {
                                switch (serviceName) {
                                    case "RStudio":
                                        return "RStudio.jpg";
                                    case "VSCode":
                                        return "VSCode.webp";
                                }
                            })()}`,
                            onClick: () => onServiceClick(serviceName),
                            serviceName,
                            title: (() => {
                                switch (serviceName) {
                                    case "RStudio":
                                        return "Pour coder en R";
                                    case "VSCode":
                                        return "Pour coder en Python";
                                }
                            })()
                        })
                    )
                ),
                React.createElement(Divider, null),
                React.createElement(
                    "div",
                    { className: classes.infoCardsWrapper },
                    React.createElement(HomeLS3InfoCard, {
                        className: css({
                            backgroundColor:
                                theme.colors.useCases.surfaces.surfaceFocus1
                        }),
                        title: "Nouvel utilisateur ?",
                        body: React.createElement(
                            React.Fragment,
                            null,
                            "Prends en main la plateforme \u00e0 travers",
                            React.createElement("br", null),
                            "un guide d'utilisation simple et rapide."
                        ),
                        icon: getIconUrlByName("Book"),
                        link: routes.document({
                            source: `${PUBLIC_URL}/custom-resources/docs/new-user.md`
                        }).link,
                        buttonText: "D\u00e9marrer le guide"
                    }),
                    React.createElement(HomeLS3InfoCard, {
                        title: "Besoin d'aide ?",
                        body: React.createElement(
                            React.Fragment,
                            null,
                            "Une question, un probl\u00e8me ou besoin d'assistance ?",
                            React.createElement("br", null),
                            "Contactez l'\u00e9quipe en charge de la plateforme."
                        ),
                        icon: getIconUrlByName("ChatBubble"),
                        link: {
                            href: "https://tchap.fr",
                            onClick: () => {}
                        },
                        buttonText: "Contacter le support"
                    })
                )
            ),
            React.createElement(HomeLS3GitDialog, { evtOpen: evtGitDialogOpen })
        );
    }

    const useStyles = tss.withName({ HomeLS3 }).create(({ theme }) => ({
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
