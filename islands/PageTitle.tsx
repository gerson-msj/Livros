import { usePopupMessage } from "./PopupMessage.tsx"

export const PAGE_TITLE_BACK_INTENT_EVENT = "livros:page-title-back-intent"

export type PageTitleLeftMode = "icon" | "back" | "none"

export interface PageTitleProps {
    title: string
    leftMode?: PageTitleLeftMode
    backHref?: string
    showLogout?: boolean
    logoutFormId?: string
}

export interface PageTitleBackIntentDetail {
    title: string
}

export default function PageTitle(
    { title, leftMode = "icon", backHref, showLogout = false, logoutFormId = "logout-form" }: PageTitleProps
) {
    const { popup, showMessage } = usePopupMessage()

    async function confirmLogout() {
        const result = await showMessage({
            message: "Deseja sair da biblioteca?",
            theme: "dark",
            positiveText: "Sair",
            negativeText: "Cancelar",
            showPositiveButton: true,
            showNegativeButton: true
        })

        if (result === "ok") {
            submitLogoutForm(logoutFormId)
        }
    }

    return (
        <>
            <header class="livros-page-title" aria-label={`Titulo da pagina ${title}`}>
                <div class="livros-page-title-left">
                    <PageTitleLeft title={title} mode={leftMode} backHref={backHref} />
                </div>
                <h1 class="title livros-page-title-heading">{title}</h1>
                <div class="livros-page-title-right">
                    {showLogout && (
                        <button class="livros-page-title-action-icon" type="button" aria-label="Sair" onClick={confirmLogout}>
                            <span class="icon">
                                <i class="fas fa-right-from-bracket" aria-hidden="true"></i>
                            </span>
                        </button>
                    )}
                </div>
            </header>
            {popup}
        </>
    )
}

export function createPageTitleBackIntent(title: string): CustomEvent<PageTitleBackIntentDetail> {
    return new CustomEvent<PageTitleBackIntentDetail>(PAGE_TITLE_BACK_INTENT_EVENT, {
        detail: {
            title
        },
        bubbles: true
    })
}

export function submitLogoutForm(formId: string, documentRef: Document = document): boolean {
    const form = documentRef.getElementById(formId)

    if (!form) {
        return false
    }

    if (!(form instanceof HTMLFormElement)) {
        return false
    }

    form.requestSubmit()
    return true
}

function PageTitleLeft({ title, mode, backHref }: { title: string; mode: PageTitleLeftMode; backHref?: string }) {
    if (mode === "none") {
        return null
    }

    if (mode === "back") {
        return (
            <button
                class="button is-light livros-page-title-icon-button"
                type="button"
                aria-label="Voltar"
                onClick={dispatchBackIntent(title, backHref)}
            >
                <span class="icon">
                    <i class="fas fa-arrow-left" aria-hidden="true"></i>
                </span>
            </button>
        )
    }

    return (
        <span class="icon livros-page-title-static-icon" aria-hidden="true">
            <i class="fas fa-book-open"></i>
        </span>
    )
}

function dispatchBackIntent(title: string, backHref?: string) {
    return (event: Event) => {
        event.currentTarget?.dispatchEvent(createPageTitleBackIntent(title))
        navigateToBackHref(backHref)
    }
}

export function navigateToBackHref(backHref: string | undefined, locationRef: Location = globalThis.location): boolean {
    if (!backHref) {
        return false
    }

    locationRef.href = backHref
    return true
}
