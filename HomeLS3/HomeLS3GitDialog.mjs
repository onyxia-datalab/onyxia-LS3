/** @typedef {import("../types").OnyxiaCtx} OnyxiaCtx */
/** @typedef {import("react").ReactNode} ReactNode */

/**
 * @typedef {object} GitDialogOpenEvent
 * @property {string} serviceName
 * @property {(params: { response: "cancel" | "launch without git repo" } | { response: "launch with git repo", gitlabRepoUrl: string }) => void} onUserResponse
 */

/**
 * @typedef {object} HomeLS3GitDialogProps
 * @property {import("evt").Evt<GitDialogOpenEvent>} evtOpen
 */

/**
 * @param {OnyxiaCtx} ctx
 * @returns {Promise<{ HomeLS3GitDialog: import("react").ComponentType<HomeLS3GitDialogProps> }>}
 */
export async function createHomeLS3GitDialog(ctx) {
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
    const { useGitlabRepoUrl } =
        /** @type {{ useGitlabRepoUrl: () => { gitlabRepoUrl: string | undefined, setGitlabRepoUrl: (value: string | undefined) => void } }} */ (
            createUseGlobalState({
                name: "gitlabRepoUrl",
                doPersistAcrossReloads: true,
                initialState: /** @type {string | undefined} */ (undefined)
            })
        );

    /** @param {HomeLS3GitDialogProps} props */
    function HomeLS3GitDialog(props) {
        const { evtOpen } = props;
        const [state, setState] = React.useState(
            /** @type {GitDialogOpenEvent | undefined} */ (undefined)
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

        /** @param {{ gitlabRepoUrl: string | undefined }} params */
        const onProceed = ({ gitlabRepoUrl }) => {
            if (state === undefined) {
                throw new Error("Dialog state is unexpectedly undefined");
            }

            state.onUserResponse(
                gitlabRepoUrl === undefined
                    ? {
                          response: "launch without git repo"
                      }
                    : {
                          response: "launch with git repo",
                          gitlabRepoUrl
                      }
            );

            setState(undefined);
        };

        return React.createElement(Dialog, {
            title: "Pr\u00e9parer le lancement",
            subtitle:
                state === undefined
                    ? undefined
                    : `Clonage GitLab optionnel pour ${state.serviceName}`,
            isOpen: state !== undefined,
            maxWidth: "md",
            showCloseButton: true,
            body:
                state === undefined
                    ? undefined
                    : React.createElement(Body, {
                          serviceName: state.serviceName,
                          onProceed
                      }),
            onClose: onCancel
        });
    }

    /**
     * @param {object} props
     * @param {string} props.serviceName
     * @param {(params: { gitlabRepoUrl: string | undefined }) => void} props.onProceed
     * @returns {ReactNode}
     */
    function Body(props) {
        const { serviceName, onProceed } = props;
        const { githubPersonalAccessToken } = useCoreState(
            "userConfigs",
            "userConfigs"
        );
        const {
            functions: { userConfigs }
        } = getCoreSync();
        const evtTokenTextFieldAction = useConst(
            () =>
                /** @type {import("evt").Evt<"TRIGGER SUBMIT" | "RESTORE DEFAULT VALUE">} */ (
                    /** @type {unknown} */ (Evt.create())
                )
        );
        const evtRepoTextFieldAction = useConst(
            () =>
                /** @type {import("evt").Evt<"TRIGGER SUBMIT" | "RESTORE DEFAULT VALUE">} */ (
                    /** @type {unknown} */ (Evt.create())
                )
        );
        const [isTokenValid, setIsTokenValid] = React.useState(false);
        const [isRepoUrlValid, setIsRepoUrlValid] = React.useState(true);
        const { gitlabRepoUrl, setGitlabRepoUrl } = useGitlabRepoUrl();
        const hasGitlabToken =
            normalizeOptionalValue(githubPersonalAccessToken ?? "") !== undefined;
        const normalizedGitlabRepoUrl = normalizeOptionalValue(gitlabRepoUrl ?? "");
        const doInjectGitUrl =
            hasGitlabToken &&
            normalizedGitlabRepoUrl !== undefined &&
            isRepoUrlValid;
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

        return React.createElement(
            "div",
            { className: classes.root },
            React.createElement(
                "div",
                {
                    className: classes.stepper,
                    "aria-hidden": "true"
                },
                React.createElement(Step, {
                    index: 1,
                    label: "Jeton GitLab",
                    state: hasGitlabToken ? "complete" : "active"
                }),
                React.createElement("div", { className: classes.stepDivider }),
                React.createElement(Step, {
                    index: 2,
                    label: "D\u00e9p\u00f4t \u00e0 cloner",
                    state: hasGitlabToken ? "active" : "pending"
                })
            ),
            !hasGitlabToken
                ? React.createElement(
                      React.Fragment,
                      null,
                      React.createElement(Text, {
                          typo: "body 1",
                          className: classes.lead,
                          children:
                              "Pour cloner un d\u00e9p\u00f4t GitLab priv\u00e9 au d\u00e9marrage, Onyxia doit disposer d'un Personal Access Token GitLab. Le jeton sera enregistr\u00e9 dans votre configuration utilisateur."
                      }),
                      React.createElement(
                          "p",
                          { className: classes.note },
                          "Cette \u00e9tape est facultative : vous pouvez lancer le service maintenant sans cloner de d\u00e9p\u00f4t Git."
                      ),
                      React.createElement(TextField, {
                          label: "Personal Access Token GitLab",
                          type: "sensitive",
                          className: classes.textField,
                          defaultValue: "",
                          helperText: React.createElement(
                              React.Fragment,
                              null,
                              "Format attendu : glpat-xxxxxxxxxxxxxxxxxxxx. Pour le cr\u00e9er, consultez ",
                              React.createElement(
                                  Link,
                                  {
                                      target: "_blank",
                                      rel: "noreferrer",
                                      href: `${PUBLIC_URL}/custom-resources/docs/how-to-get-my-gitlab-token.md`
                                  },
                                  "le guide Insee"
                              ),
                              "."
                          ),
                          selectAllTextOnFocus: true,
                          doOnlyShowErrorAfterFirstFocusLost: false,
                          inputProps_autoFocus: true,
                          inputProps_spellCheck: false,
                          evtAction: evtTokenTextFieldAction,
                          onSubmit: token => {
                              userConfigs.changeValue({
                                  key: "githubPersonalAccessToken",
                                  value: token.trim()
                              });
                          },
                          getIsValidValue: token => {
                              if (!GITLAB_TOKEN_REGEXP.test(token.trim())) {
                                  return {
                                      isValidValue: false,
                                      message: React.createElement(
                                          React.Fragment,
                                          null,
                                          "Le jeton doit commencer par glpat- et contenir au moins 20 caract\u00e8res."
                                      )
                                  };
                              }

                              return {
                                  isValidValue: true
                              };
                          },
                          onValueBeingTypedChange: params => {
                              setIsTokenValid(params.isValidValue);
                          }
                      })
                  )
                : React.createElement(
                      React.Fragment,
                      null,
                      React.createElement(Text, {
                          typo: "body 1",
                          className: classes.lead,
                          children:
                              "Vous pouvez indiquer l'URL d'un d\u00e9p\u00f4t GitLab \u00e0 cloner automatiquement dans le service. L'URL est m\u00e9moris\u00e9e sur ce navigateur pour les prochains lancements."
                      }),
                      React.createElement(
                          "p",
                          { className: classes.note },
                          'Laisser le champ vide, ou choisir "Lancer sans d\u00e9p\u00f4t Git", d\u00e9marre ',
                          serviceName,
                          " normalement."
                      ),
                      React.createElement(TextField, {
                          label: "URL du d\u00e9p\u00f4t GitLab",
                          helperText: React.createElement(
                              React.Fragment,
                              null,
                              "Exemples : https://gitlab.example.fr/groupe/projet.git ou git@gitlab.example.fr:groupe/projet.git"
                          ),
                          className: classes.textField,
                          doOnlyShowErrorAfterFirstFocusLost: false,
                          defaultValue: gitlabRepoUrl ?? "",
                          evtAction: evtRepoTextFieldAction,
                          inputProps_autoFocus: true,
                          inputProps_spellCheck: false,
                          selectAllTextOnFocus: true,
                          onEnterKeyDown: ({
                              preventDefaultAndStopPropagation
                          }) => {
                              if (!doInjectGitUrl) {
                                  return;
                              }

                              preventDefaultAndStopPropagation();
                              launchWithGitRepo();
                          },
                          getIsValidValue: value => {
                              const normalizedValue =
                                  normalizeOptionalValue(value);

                              if (
                                  normalizedValue !== undefined &&
                                  !GITLAB_REPO_REGEXP.test(normalizedValue)
                              ) {
                                  return {
                                      isValidValue: false,
                                      message: React.createElement(
                                          React.Fragment,
                                          null,
                                          "Cette URL GitLab n'est pas reconnue."
                                      )
                                  };
                              }

                              return {
                                  isValidValue: true
                              };
                          },
                          onValueBeingTypedChange: params => {
                              setIsRepoUrlValid(params.isValidValue);

                              if (params.isValidValue) {
                                  setGitlabRepoUrl(
                                      normalizeOptionalValue(params.value)
                                  );
                              }
                          }
                      })
                  ),
            React.createElement(
                "div",
                { className: classes.actions },
                React.createElement(Button, {
                    onClick: launchWithoutGitRepo,
                    variant: "secondary",
                    startIcon: getIconUrlByName("SkipNext"),
                    children: "Lancer sans d\u00e9p\u00f4t Git"
                }),
                !hasGitlabToken
                    ? React.createElement(Button, {
                          onClick: () => {
                              evtTokenTextFieldAction.post("TRIGGER SUBMIT");
                          },
                          disabled: !isTokenValid,
                          startIcon: getIconUrlByName("Key"),
                          children: "Enregistrer le jeton"
                      })
                    : React.createElement(Button, {
                          onClick: launchWithGitRepo,
                          disabled: !doInjectGitUrl,
                          startIcon: getIconUrlByName("RocketLaunch"),
                          children: "Lancer avec ce d\u00e9p\u00f4t"
                      })
            )
        );
    }

    /**
     * @param {object} props
     * @param {number} props.index
     * @param {string} props.label
     * @param {"active" | "complete" | "pending"} props.state
     */
    function Step(props) {
        const { index, label, state } = props;
        const { classes, cx } = useStyles();

        return React.createElement(
            "div",
            {
                className: cx(
                    classes.step,
                    state === "active" && classes.stepActive,
                    state === "complete" && classes.stepComplete
                )
            },
            React.createElement(
                "span",
                { className: classes.stepBullet },
                state === "complete" ? "\u2713" : index
            ),
            React.createElement("span", { className: classes.stepLabel }, label)
        );
    }

    /** @param {string} value */
    function normalizeOptionalValue(value) {
        const trimmedValue = value.trim();

        return trimmedValue === "" ? undefined : trimmedValue;
    }

    const useStyles = tss.withName({ HomeLS3GitDialog }).create(({ theme }) => ({
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

    return { HomeLS3GitDialog: React.memo(HomeLS3GitDialog) };
}
