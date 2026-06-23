import { useState } from "preact/hooks"
import AuthorPicker, { type SelectableAuthor } from "./AuthorPicker.tsx"
import BookDateInput from "./BookDateInput.tsx"
import { type PopupMessageResult, usePopupMessage } from "./PopupMessage.tsx"

type FeedbackTheme = "info" | "danger" | "success"

interface FeedbackState {
    theme: FeedbackTheme
    messages: string[]
}

interface SaveResponse {
    ok: boolean
    messages: string[]
    redirectTo?: string
}

export default function BookCreateForm({ authors }: { authors: SelectableAuthor[] }) {
    const { popup, showMessage } = usePopupMessage()
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState<SelectableAuthor | null>(null)
    const [startedAt, setStartedAt] = useState("")
    const [finishedAt, setFinishedAt] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [feedback, setFeedback] = useState<FeedbackState>({
        theme: "info",
        messages: ["Preencha os dados do livro."]
    })

    const hasChanges = title.trim() !== "" || author !== null || startedAt !== "" || finishedAt !== ""

    async function tryBack() {
        if (!hasChanges) {
            globalThis.location.href = "/biblioteca/livros"
            return
        }

        const result: PopupMessageResult = await showMessage({
            title: "Alteracoes nao salvas",
            message: "Existem dados preenchidos neste cadastro. Deseja voltar para a lista mesmo assim?",
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
        if (isSaving) {
            return
        }

        setIsSaving(true)

        try {
            const form = new FormData()
            form.set("title", title)
            form.set("authorName", author?.name ?? "")
            form.set("readingStartedOn", startedAt)
            form.set("readingFinishedOn", finishedAt)

            const response = await fetch("/biblioteca/livros/novo", {
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
                message: result.messages[0] ?? "Livro salvo com sucesso.",
                theme: "success"
            })

            globalThis.location.href = result.redirectTo ?? "/biblioteca/livros"
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <>
            <div class="livros-book-form-page">
                <div class="livros-book-form-page-content">
                    <header class="livros-page-title" aria-label="Titulo da pagina Novo livro">
                        <div class="livros-page-title-left">
                            <button class="livros-page-title-icon-button" type="button" aria-label="Voltar" onClick={tryBack}>
                                <span class="icon">
                                    <i class="fas fa-chevron-left" aria-hidden="true"></i>
                                </span>
                            </button>
                        </div>
                        <h1 class="title livros-page-title-heading">Novo livro</h1>
                        <div class="livros-page-title-right"></div>
                    </header>

                    <div class="livros-books-toolbar livros-book-form-toolbar" aria-label="Acoes do cadastro de livro">
                        <div class="livros-books-toolbar-text">
                            <p class="has-text-weight-semibold">Incluir livro</p>
                            <p class="is-size-7 has-text-grey">Informe titulo, autor e datas opcionais</p>
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
                            <label class="label livros-book-form-label">Titulo</label>
                            <div class="control">
                                <input
                                    class="input"
                                    type="text"
                                    value={title}
                                    placeholder="Ex.: O Vento do Norte"
                                    onInput={(event) => setTitle(event.currentTarget.value)}
                                />
                            </div>
                        </div>

                        <AuthorPicker authors={authors} selectedAuthor={author} onSelect={setAuthor} />

                        <div class="livros-book-form-dates">
                            <BookDateInput
                                label="Inicio da leitura"
                                value={startedAt}
                                class={getDateInputClass(startedAt)}
                                onInput={(event) => setStartedAt(event.currentTarget.value)}
                            />
                            <BookDateInput
                                label="Conclusao da leitura"
                                value={finishedAt}
                                class={getDateInputClass(finishedAt)}
                                onInput={(event) => setFinishedAt(event.currentTarget.value)}
                            />
                        </div>

                        <div class="livros-book-form-preview">
                            <p class="has-text-weight-semibold">Previa</p>
                            <dl>
                                <div>
                                    <dt>Titulo</dt>
                                    <dd>{title.trim() || "Ainda sem titulo"}</dd>
                                </div>
                                <div>
                                    <dt>Autor</dt>
                                    <dd>
                                        {author?.name ?? "Ainda sem autor"}
                                        {author?.isNew && <span class="tag is-link is-light ml-2">novo</span>}
                                    </dd>
                                </div>
                                <div>
                                    <dt>Datas</dt>
                                    <dd>{formatDatePreview(startedAt)} ate {formatDatePreview(finishedAt)}</dd>
                                </div>
                            </dl>
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

function formatDatePreview(value: string): string {
    if (!isCompleteDate(value)) {
        return "em aberto"
    }

    const [year, month, day] = value.split("-")
    return `${day}/${month}/${year}`
}

function isCompleteDate(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(value)
}
