import { usePopupMessage } from "./PopupMessage.tsx"

export const PAGE_TITLE_BACK_INTENT_EVENT = "livros:page-title-back-intent"

export type PageTitleLeftMode = "icon" | "back" | "none"

export interface PageTitleProps {
    title: string
    leftMode?: PageTitleLeftMode
    showLogout?: boolean
    logoutFormId?: string
}

export interface PageTitleBackIntentDetail {
    title: string
}

export default function PageTitle({ title, leftMode = "icon", showLogout = false, logoutFormId = "logout-form" }: PageTitleProps) {
    const { popup, showMessage } = usePopupMessage()

    async function confirmLogout() {
        const result = await showMessage({
            title: "Sair",
            message: "Deseja sair da biblioteca?",
            theme: "warning",
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
                    <PageTitleLeft title={title} mode={leftMode} />
                </div>
                <h1 class="title livros-page-title-heading">{title}</h1>
                <div class="livros-page-title-right">
                    {showLogout && (
                        <button class="button is-danger is-light" type="button" onClick={confirmLogout}>
                            <span class="icon">
                                <i class="fas fa-right-from-bracket" aria-hidden="true"></i>
                            </span>
                            <span>Sair</span>
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

function PageTitleLeft({ title, mode }: { title: string; mode: PageTitleLeftMode }) {
    if (mode === "none") {
        return null
    }

    if (mode === "back") {
        return (
            <button
                class="button is-light livros-page-title-icon-button"
                type="button"
                aria-label="Voltar"
                onClick={dispatchBackIntent(title)}
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

function dispatchBackIntent(title: string) {
    return (event: Event) => {
        event.currentTarget?.dispatchEvent(createPageTitleBackIntent(title))
    }
}
