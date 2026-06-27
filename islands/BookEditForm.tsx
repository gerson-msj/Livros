import { useState } from "preact/hooks"
import BookDateInput from "./BookDateInput.tsx"
import { type PopupMessageResult, usePopupMessage } from "./PopupMessage.tsx"

type FeedbackTheme = "info" | "danger" | "success"

export interface EditableBook {
    id: string
    title: string
    author: string
    readingStartedOn: string | null
    readingFinishedOn: string | null
}

interface FeedbackState {
    theme: FeedbackTheme
    messages: string[]
}

interface SaveResponse {
    ok: boolean
    messages: string[]
    redirectTo?: string
}

export default function BookEditForm({ book }: { book: EditableBook }) {
    const { popup, showMessage } = usePopupMessage()
    const [startedAt, setStartedAt] = useState(book.readingStartedOn ?? "")
    const [finishedAt, setFinishedAt] = useState(book.readingFinishedOn ?? "")
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [feedback, setFeedback] = useState<FeedbackState>({
        theme: "info",
        messages: ["Altere somente as datas do livro."]
    })

    const hasChanges = startedAt !== (book.readingStartedOn ?? "") || finishedAt !== (book.readingFinishedOn ?? "")

    async function tryBack() {
        if (!hasChanges) {
            globalThis.location.href = "/biblioteca/livros"
            return
        }

        const result: PopupMessageResult = await showMessage({
            title: "Alterações não salvas",
            message: `As datas de "${book.title}" foram alteradas. Deseja voltar para a lista mesmo assim?`,
            theme: "warning",
            positiveText: "Permanecer",
            negativeText: "Voltar sem salvar",
            showPositiveButton: true,
            showNegativeButton: true
        })

        if (result === "negative") {
            globalThis.location.href = "/biblioteca/livros"
        }
    }

    async function saveBook() {
        if (isSaving || isDeleting) {
            return
        }

        setIsSaving(true)

        try {
            const form = new FormData()
            form.set("readingStartedOn", startedAt)
            form.set("readingFinishedOn", finishedAt)

            const response = await fetch(`/biblioteca/livros/${book.id}`, {
                method: "POST",
                body: form,
                headers: {
                    accept: "application/json"
                }
            })

            if (response.status === 401) {
                globalThis.location.href = "/login"
                return
            }

            const result = await response.json() as SaveResponse

            if (!result.ok) {
                setFeedback({
                    theme: "danger",
                    messages: result.messages
                })
                return
            }

            setFeedback({
                theme: "success",
                messages: result.messages
            })

            await showMessage({
                title: "Livro salvo",
                message: result.messages[0] ?? "Datas salvas com sucesso.",
                theme: "success"
            })

            globalThis.location.href = result.redirectTo ?? "/biblioteca/livros"
        } finally {
            setIsSaving(false)
        }
    }

    async function deleteBook() {
        if (isSaving || isDeleting) {
            return
        }

        const confirmation = await showMessage({
            title: "Excluir livro",
            message: `Deseja excluir "${book.title}" da sua biblioteca? Esta ação não pode ser desfeita.`,
            theme: "danger",
            positiveText: "Excluir",
            negativeText: "Cancelar",
            showPositiveButton: true,
            showNegativeButton: true
        })

        if (confirmation !== "ok") {
            return
        }

        setIsDeleting(true)

        try {
            const response = await fetch(`/biblioteca/livros/${book.id}`, {
                method: "DELETE",
                headers: {
                    accept: "application/json"
                }
            })

            if (response.status === 401) {
                globalThis.location.href = "/login"
                return
            }

            const result = await response.json() as SaveResponse

            if (!result.ok) {
                setFeedback({
                    theme: "danger",
                    messages: result.messages
                })
                return
            }

            await showMessage({
                title: "Livro excluído",
                message: result.messages[0] ?? "Livro excluído da sua biblioteca.",
                theme: "success"
            })

            globalThis.location.href = result.redirectTo ?? "/biblioteca/livros"
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <div class="livros-book-form-page">
                <div class="livros-book-form-page-content">
                    <header class="livros-page-title" aria-label="Título da página Editar livro">
                        <div class="livros-page-title-left">
                            <button class="livros-page-title-icon-button" type="button" aria-label="Voltar" onClick={tryBack}>
                                <span class="icon">
                                    <i class="fas fa-chevron-left" aria-hidden="true"></i>
                                </span>
                            </button>
                        </div>
                        <h1 class="title livros-page-title-heading">Editar livro</h1>
                        <div class="livros-page-title-right">
                            <button
                                class="livros-page-title-action-icon"
                                type="button"
                                aria-label="Excluir livro"
                                onClick={deleteBook}
                                disabled={isDeleting}
                            >
                                <span class="icon">
                                    <i class="fas fa-trash" aria-hidden="true"></i>
                                </span>
                            </button>
                        </div>
                    </header>

                    <div class="livros-books-toolbar livros-book-form-toolbar" aria-label="Ações da edição de livro">
                        <div class="livros-books-toolbar-text">
                            <p class="has-text-weight-semibold">Editar datas</p>
                            <p class="is-size-7 has-text-grey">Título e autor permanecem somente leitura</p>
                        </div>
                        <button
                            class={`button is-primary livros-books-new-button ${isSaving ? "is-loading" : ""}`}
                            type="button"
                            onClick={saveBook}
                        >
                            <span class="icon">
                                <i class="fas fa-check" aria-hidden="true"></i>
                            </span>
                            <span>Salvar</span>
                        </button>
                    </div>

                    <FeedbackMessage feedback={feedback} />

                    <form
                        class="box livros-book-form"
                        onSubmit={(event) => {
                            event.preventDefault()
                            saveBook()
                        }}
                    >
                        <div class="field">
                            <label class="label livros-book-form-label">Título</label>
                            <div class="control">
                                <input class="input livros-book-readonly-input" type="text" value={book.title} readOnly />
                            </div>
                        </div>

                        <div class="field">
                            <label class="label livros-book-form-label">Autor</label>
                            <div class="control">
                                <input class="input livros-book-readonly-input" type="text" value={book.author} readOnly />
                            </div>
                        </div>

                        <p class="help livros-book-readonly-help">Para corrigir título ou autor, exclua o livro e cadastre novamente.</p>

                        <div class="livros-book-form-dates">
                            <BookDateInput
                                label="Início da leitura"
                                value={startedAt}
                                class={getDateInputClass(startedAt)}
                                onInput={(event) => setStartedAt(event.currentTarget.value)}
                            />
                            <BookDateInput
                                label="Conclusão da leitura"
                                value={finishedAt}
                                class={getDateInputClass(finishedAt)}
                                onInput={(event) => setFinishedAt(event.currentTarget.value)}
                            />
                        </div>
                    </form>
                </div>
            </div>
            {popup}
        </>
    )
}

function FeedbackMessage({ feedback }: { feedback: FeedbackState }) {
    return (
        <div class={`notification is-${feedback.theme} is-light livros-books-feedback livros-book-form-feedback`} role="status">
            {feedback.messages.length === 1 ? feedback.messages[0] : (
                <ul class="livros-book-form-feedback-list">
                    {feedback.messages.map((message) => <li key={message}>{message}</li>)}
                </ul>
            )}
        </div>
    )
}

function getDateInputClass(value: string): string {
    return isCompleteDate(value) ? "" : "is-placeholder"
}

function isCompleteDate(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(value)
}
