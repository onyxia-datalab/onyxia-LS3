import type { ComponentType, ReactNode } from "react";
import type { OnyxiaCtx } from "../OnyxiaCtx";

export type GitDialogOpenEvent = {
    serviceName: string;
    onUserResponse: (
        params:
            | {
                  response: "cancel" | "launch without git repo";
              }
            | {
                  response: "launch with git repo";
                  gitlabRepoUrl: string;
              }
    ) => void;
};

export type Props_HomeLS3GitDialog = {
    evtOpen: import("evt").Evt<GitDialogOpenEvent>;
};

type TextFieldAction = "TRIGGER SUBMIT" | "RESTORE DEFAULT VALUE";

export async function createHomeLS3GitDialog(
    ctx: OnyxiaCtx
): Promise<{ HomeLS3GitDialog: ComponentType<Props_HomeLS3GitDialog> }> {
    const [
        React,
        { Dialog },
        { Button },
        { Evt },
        { useEvt },
        { createUseGlobalState },
        { useCoreState, getCoreSync },
        { TextField },
        { Text },
        { useConst },
        Link,
        { PUBLIC_URL },
        { tss },
        { getIconUrlByName }
    ] = await Promise.all([
        ctx.import("react"),
        ctx.import("onyxia-ui/Dialog"),
        ctx.import("onyxia-ui/Button"),
        ctx.import("evt"),
        ctx.import("evt/hooks"),
        ctx.import("powerhooks/useGlobalState"),
        ctx.import("core"),
        ctx.import("onyxia-ui/TextField"),
        ctx.import("onyxia-ui/Text"),
        ctx.import("powerhooks/useConst"),
        ctx.import("@mui/material/Link").then(m => m.default),
        ctx.import("env"),
        ctx.import("tss"),
        ctx.import("lazy-icons")
    ]);

    const GITLAB_TOKEN_REGEXP = /^glpat-[A-Za-z0-9_-]{20,}$/;
    const GITLAB_REPO_REGEXP =
        /^(?:(?:https?:\/\/)(?:[^/@\s]+@)?[^/\s]+\/|git@[^:\s]+:)[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)+(?:\.git)?$/;
    const { useGitlabRepoUrl } = createUseGlobalState<
        string | undefined,
        "gitlabRepoUrl"
    >({
        name: "gitlabRepoUrl",
        doPersistAcrossReloads: true,
        initialState: undefined
    });

    const HomeLS3GitDialog = React.memo((props: Props_HomeLS3GitDialog) => {
        const { evtOpen } = props;
        const [state, setState] = React.useState<GitDialogOpenEvent | undefined>(
            undefined
        );

        useEvt(
            evtCtx => {
                evtOpen.attach(evtCtx, setState);
            },
            [evtOpen]
        );

        const onCancel = () => {
            state?.onUserResponse({ response: "cancel" });
            setState(undefined);
        };

        const onProceed = (params: { gitlabRepoUrl: string | undefined }) => {
            if (state === undefined) {
                throw new Error("Dialog state is unexpectedly undefined");
            }

            state.onUserResponse(
                params.gitlabRepoUrl === undefined
                    ? {
                          response: "launch without git repo"
                      }
                    : {
                          response: "launch with git repo",
                          gitlabRepoUrl: params.gitlabRepoUrl
                      }
            );

            setState(undefined);
        };

        return (
            <Dialog
                title="Préparer le lancement"
                subtitle={
                    state === undefined
                        ? undefined
                        : `Clonage GitLab optionnel pour ${state.serviceName}`
                }
                isOpen={state !== undefined}
                maxWidth="md"
                showCloseButton
                body={
                    state === undefined ? undefined : (
                        <Body serviceName={state.serviceName} onProceed={onProceed} />
                    )
                }
                onClose={onCancel}
            />
        );
    });

    function Body(props: {
        serviceName: string;
        onProceed: (params: { gitlabRepoUrl: string | undefined }) => void;
    }): ReactNode {
        const { serviceName, onProceed } = props;
        const { githubPersonalAccessToken } = useCoreState("userConfigs", "userConfigs");
        const {
            functions: { userConfigs }
        } = getCoreSync();
        const evtTokenTextFieldAction = useConst(() => Evt.create<TextFieldAction>());
        const evtRepoTextFieldAction = useConst(() => Evt.create<TextFieldAction>());
        const [isTokenValid, setIsTokenValid] = React.useState(false);
        const [isRepoUrlValid, setIsRepoUrlValid] = React.useState(true);
        const { gitlabRepoUrl, setGitlabRepoUrl } = useGitlabRepoUrl();
        const hasGitlabToken =
            normalizeOptionalValue(githubPersonalAccessToken ?? "") !== undefined;
        const normalizedGitlabRepoUrl = normalizeOptionalValue(gitlabRepoUrl ?? "");
        const doInjectGitUrl =
            hasGitlabToken && normalizedGitlabRepoUrl !== undefined && isRepoUrlValid;
        const { classes } = useStyles();
        const launchWithoutGitRepo = () => {
            onProceed({ gitlabRepoUrl: undefined });
        };
        const launchWithGitRepo = () => {
            if (!doInjectGitUrl) {
                throw new Error("Cannot launch with an invalid GitLab repository URL");
            }

            onProceed({ gitlabRepoUrl: normalizedGitlabRepoUrl });
        };

        return (
            <div className={classes.root}>
                <div className={classes.stepper} aria-hidden="true">
                    <Step
                        index={1}
                        label="Jeton GitLab"
                        state={hasGitlabToken ? "complete" : "active"}
                    />
                    <div className={classes.stepDivider} />
                    <Step
                        index={2}
                        label="Dépôt à cloner"
                        state={hasGitlabToken ? "active" : "pending"}
                    />
                </div>

                {!hasGitlabToken ? (
                    <>
                        <Text typo="body 1" className={classes.lead}>
                            Pour cloner un dépôt GitLab privé au démarrage, Onyxia doit
                            disposer d&apos;un Personal Access Token GitLab. Le jeton sera
                            enregistré dans votre configuration utilisateur.
                        </Text>
                        <p className={classes.note}>
                            Cette étape est facultative : vous pouvez lancer le service
                            maintenant sans cloner de dépôt Git.
                        </p>
                        <TextField
                            label="Personal Access Token GitLab"
                            type="sensitive"
                            className={classes.textField}
                            defaultValue=""
                            helperText={
                                <>
                                    Format attendu : glpat-xxxxxxxxxxxxxxxxxxxx. Pour le
                                    créer, consultez{" "}
                                    <Link
                                        target="_blank"
                                        rel="noreferrer"
                                        href={`${PUBLIC_URL}/custom-resources/docs/how-to-get-my-gitlab-token.md`}
                                    >
                                        le guide Insee
                                    </Link>
                                    .
                                </>
                            }
                            selectAllTextOnFocus
                            doOnlyShowErrorAfterFirstFocusLost={false}
                            inputProps_autoFocus
                            inputProps_spellCheck={false}
                            evtAction={evtTokenTextFieldAction}
                            onSubmit={token => {
                                userConfigs.changeValue({
                                    key: "githubPersonalAccessToken",
                                    value: token.trim()
                                });
                            }}
                            getIsValidValue={token => {
                                if (!GITLAB_TOKEN_REGEXP.test(token.trim())) {
                                    return {
                                        isValidValue: false,
                                        message: (
                                            <>
                                                Le jeton doit commencer par glpat- et
                                                contenir au moins 20 caractères.
                                            </>
                                        )
                                    };
                                }

                                return {
                                    isValidValue: true
                                };
                            }}
                            onValueBeingTypedChange={params => {
                                setIsTokenValid(params.isValidValue);
                            }}
                        />
                    </>
                ) : (
                    <>
                        <Text typo="body 1" className={classes.lead}>
                            Vous pouvez indiquer l&apos;URL d&apos;un dépôt GitLab à
                            cloner automatiquement dans le service. L&apos;URL est
                            mémorisée sur ce navigateur pour les prochains lancements.
                        </Text>
                        <p className={classes.note}>
                            Laisser le champ vide, ou choisir &quot;Lancer sans dépôt
                            Git&quot;, démarre {serviceName} normalement.
                        </p>
                        <TextField
                            label="URL du dépôt GitLab"
                            helperText={
                                <>
                                    Exemples : https://gitlab.example.fr/groupe/projet.git
                                    ou git@gitlab.example.fr:groupe/projet.git
                                </>
                            }
                            className={classes.textField}
                            doOnlyShowErrorAfterFirstFocusLost={false}
                            defaultValue={gitlabRepoUrl ?? ""}
                            evtAction={evtRepoTextFieldAction}
                            inputProps_autoFocus
                            inputProps_spellCheck={false}
                            selectAllTextOnFocus
                            onEnterKeyDown={({ preventDefaultAndStopPropagation }) => {
                                if (!doInjectGitUrl) {
                                    return;
                                }

                                preventDefaultAndStopPropagation();
                                launchWithGitRepo();
                            }}
                            getIsValidValue={value => {
                                const normalizedValue = normalizeOptionalValue(value);

                                if (
                                    normalizedValue !== undefined &&
                                    !GITLAB_REPO_REGEXP.test(normalizedValue)
                                ) {
                                    return {
                                        isValidValue: false,
                                        message: (
                                            <>Cette URL GitLab n&apos;est pas reconnue.</>
                                        )
                                    };
                                }

                                return {
                                    isValidValue: true
                                };
                            }}
                            onValueBeingTypedChange={params => {
                                setIsRepoUrlValid(params.isValidValue);

                                if (params.isValidValue) {
                                    setGitlabRepoUrl(
                                        normalizeOptionalValue(params.value)
                                    );
                                }
                            }}
                        />
                    </>
                )}

                <div className={classes.actions}>
                    <Button
                        onClick={launchWithoutGitRepo}
                        variant="secondary"
                        startIcon={getIconUrlByName("SkipNext")}
                    >
                        Lancer sans dépôt Git
                    </Button>
                    {!hasGitlabToken ? (
                        <Button
                            onClick={() => {
                                evtTokenTextFieldAction.post("TRIGGER SUBMIT");
                            }}
                            disabled={!isTokenValid}
                            startIcon={getIconUrlByName("Key")}
                        >
                            Enregistrer le jeton
                        </Button>
                    ) : (
                        <Button
                            onClick={launchWithGitRepo}
                            disabled={!doInjectGitUrl}
                            startIcon={getIconUrlByName("RocketLaunch")}
                        >
                            Lancer avec ce dépôt
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    function Step(props: {
        index: number;
        label: string;
        state: "active" | "complete" | "pending";
    }) {
        const { index, label, state } = props;
        const { classes, cx } = useStyles();

        return (
            <div
                className={cx(
                    classes.step,
                    state === "active" && classes.stepActive,
                    state === "complete" && classes.stepComplete
                )}
            >
                <span className={classes.stepBullet}>
                    {state === "complete" ? "✓" : index}
                </span>
                <span className={classes.stepLabel}>{label}</span>
            </div>
        );
    }

    function normalizeOptionalValue(value: string): string | undefined {
        const trimmedValue = value.trim();

        return trimmedValue === "" ? undefined : trimmedValue;
    }

    const useStyles = tss
        .withName({ HomeLS3GitDialog })
        .create(({ theme }: { theme: any }) => ({
            root: {
                width: 640,
                maxWidth: "calc(100vw - 72px)",
                minHeight: 346,
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing(4),
                "@media (max-width: 520px)": {
                    maxWidth: "calc(100vw - 48px)"
                }
            },
            stepper: {
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(2),
                marginBottom: theme.spacing(1),
                "@media (max-width: 520px)": {
                    alignItems: "flex-start",
                    flexDirection: "column",
                    gap: theme.spacing(1)
                }
            },
            step: {
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(1.5),
                color: theme.colors.useCases.typography.textSecondary,
                whiteSpace: "nowrap",
                "@media (max-width: 520px)": {
                    whiteSpace: "normal"
                }
            },
            stepActive: {
                color: theme.colors.useCases.typography.textPrimary
            },
            stepComplete: {
                color: theme.colors.useCases.typography.textFocus
            },
            stepBullet: {
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "0 0 auto",
                border: `1px solid ${theme.colors.useCases.typography.textTertiary}`,
                fontWeight: 700,
                fontSize: 13
            },
            stepLabel: {
                fontWeight: 600,
                fontSize: 14
            },
            stepDivider: {
                height: 1,
                flex: 1,
                minWidth: 32,
                backgroundColor: theme.colors.useCases.typography.textTertiary,
                "@media (max-width: 520px)": {
                    display: "none"
                }
            },
            lead: {
                maxWidth: 600,
                overflowWrap: "anywhere"
            },
            note: {
                margin: 0,
                padding: `${theme.spacing(2.5)} ${theme.spacing(3)}`,
                borderLeft: `3px solid ${theme.colors.useCases.typography.textFocus}`,
                backgroundColor: theme.colors.useCases.surfaces.surface1,
                color: theme.colors.useCases.typography.textSecondary,
                lineHeight: 1.55,
                overflowWrap: "anywhere"
            },
            textField: {
                width: "100%"
            },
            actions: {
                display: "flex",
                justifyContent: "space-between",
                gap: theme.spacing(2),
                marginTop: "auto",
                flexWrap: "wrap",
                "@media (max-width: 520px)": {
                    flexDirection: "column",
                    "& > button": {
                        width: "100%"
                    }
                }
            }
        }));

    return { HomeLS3GitDialog };
}
