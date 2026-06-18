export function registerPageContainerListener(
    routeName: string,
    listener: (element: HTMLElement) => void
) {
    let element_cache: HTMLElement | undefined = undefined;

    const update = () => {
        const element = document.getElementById(`page-container-${routeName}`);

        if (element === null) {
            element_cache = undefined;
            return;
        }

        if (element === element_cache) {
            return;
        }

        element_cache = element;
        listener(element);
    };

    update();

    const observer = new MutationObserver(() => {
        update();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    return () => {
        observer.disconnect();
    };
}
