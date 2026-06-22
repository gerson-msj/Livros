import { useState } from "preact/hooks"
import MockAuthorPicker, { type MockAuthor } from "./MockAuthorPicker.tsx"
import MockBookDateInput from "./MockBookDateInput.tsx"
import { type PopupMessageResult, usePopupMessage } from "./PopupMessage.tsx"

interface MockDuplicateBook {
    title: string
    author: string
}

type FeedbackTheme = "info" | "danger" | "success"
type ValidationField = "title" | "author" | "duplicate"

interface FeedbackState {
    theme: FeedbackTheme
    messages: string[]
}

interface ValidationError {
    field: ValidationField
    message: string
}

const mockAuthors: MockAuthor[] = [
    { id: "marta-lins", name: "Marta Lins" },
    { id: "helena-duarte", name: "Helena Duarte" },
    { id: "caio-almeida", name: "Caio Almeida" },
    { id: "lia-moreira", name: "Lia Moreira" },
    { id: "rafael-neves", name: "Rafael Neves" },
    { id: "beatriz-costa", name: "Beatriz Costa" }
]

const duplicateBooks: MockDuplicateBook[] = [
    { title: "O Vento do Norte", author: "Marta Lins" },
    { title: "A Cidade de Papel", author: "Helena Duarte" }
]

export default function MockBookCreateForm() {
    const { popup, showMessage } = usePopupMessage()
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState<MockAuthor | null>(null)
    const [startedAt, setStartedAt] = useState("")
    const [finishedAt, setFinishedAt] = useState("")
    const [feedback, setFeedback] = useState<FeedbackState>({
        theme: "info",
        messages: ["Preencha os dados para validar a inclusão mockada."]
    })
    const [, setValidationErrors] = useState<ValidationError[]>([])

    const hasChanges = title.trim() !== "" || author !== null || startedAt !== "" || finishedAt !== ""

    async function tryBack() {
        if (!hasChanges) {
            globalThis.location.href = "/biblioteca/livros"
            return
        }

        const result: PopupMessageResult = await showMessage({
            title: "Alterações não salvas",
            message: "Existem dados preenchidos neste cadastro mockado. Deseja voltar para a lista mesmo assim?",
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

    async function saveMockBook() {
        const errors = validateMockBook({ title, author })

        if (errors.length > 0) {
            setValidationErrors(errors)
            setFeedback({
                theme: "danger",
                messages: errors.map((error) => error.message)
            })
            return
        }

        setValidationErrors([])
        setFeedback({
            theme: "success",
            messages: [
                author?.isNew ? "Autor novo e livro seriam criados neste fluxo real." : "Livro seria criado usando um autor existente."
            ]
        })

        await showMessage({
            title: "Livro salvo",
            message: `Salvamento mockado de "${title.trim()}" confirmado. A integração real será feita em fase comum.`,
            theme: "success"
        })

        globalThis.location.href = "/biblioteca/livros"
    }

    function updateTitle(value: string) {
        setTitle(value)
        clearValidationErrors(["title", "duplicate"])
    }

    function updateAuthor(value: MockAuthor) {
        setAuthor(value)
        clearValidationErrors(["author", "duplicate"])
    }

    function clearValidationErrors(fields: ValidationField[]) {
        setValidationErrors((currentErrors) => {
            const remainingErrors = currentErrors.filter((error) => !fields.includes(error.field))

            if (remainingErrors.length === 0) {
                setFeedback({
                    theme: "info",
                    messages: ["Continue preenchendo o cadastro mockado."]
                })
            } else {
                setFeedback({
                    theme: "danger",
                    messages: remainingErrors.map((error) => error.message)
                })
            }

            return remainingErrors
        })
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

                    <div class="livros-books-toolbar livros-book-form-toolbar" aria-label="Ações do cadastro de livro">
                        <div class="livros-books-toolbar-text">
                            <p class="has-text-weight-semibold">Inclusão mockada</p>
                            <p class="is-size-7 has-text-grey">Componentes de autor e datas para validação visual</p>
                        </div>
                        <button class="button is-primary livros-books-new-button" type="button" onClick={saveMockBook}>
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
                            saveMockBook()
                        }}
                    >
                        <div class="field">
                            <label class="label livros-book-form-label">Título</label>
                            <div class="control">
                                <input
                                    class="input"
                                    type="text"
                                    value={title}
                                    placeholder="Ex.: O Vento do Norte"
                                    onInput={(event) => updateTitle(event.currentTarget.value)}
                                />
                            </div>
                        </div>

                        <MockAuthorPicker authors={mockAuthors} selectedAuthor={author} onSelect={updateAuthor} />

                        <div class="livros-book-form-dates">
                            <MockBookDateInput
                                label="Início da leitura"
                                value={startedAt}
                                class={getDateInputClass(startedAt)}
                                onInput={(event) => setStartedAt(event.currentTarget.value)}
                            />
                            <MockBookDateInput
                                label="Conclusão da leitura"
                                value={finishedAt}
                                class={getDateInputClass(finishedAt)}
                                onInput={(event) => setFinishedAt(event.currentTarget.value)}
                            />
                        </div>

                        <div class="livros-book-form-preview">
                            <p class="has-text-weight-semibold">Prévia mockada</p>
                            <dl>
                                <div>
                                    <dt>Título</dt>
                                    <dd>{title.trim() || "Ainda sem título"}</dd>
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
                                    <dd>{formatDatePreview(startedAt)} até {formatDatePreview(finishedAt)}</dd>
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

function validateMockBook({ title, author }: { title: string; author: MockAuthor | null }): ValidationError[] {
    const normalizedTitle = title.trim()
    const normalizedAuthor = author?.name.trim() ?? ""
    const errors: ValidationError[] = []

    if (normalizedTitle.length < 2) {
        errors.push({
            field: "title",
            message: "Informe um título com ao menos dois caracteres."
        })
    }

    if (normalizedAuthor.length < 2) {
        errors.push({
            field: "author",
            message: "Selecione ou crie um autor com ao menos dois caracteres."
        })
    }

    if (errors.length > 0) {
        return errors
    }

    const isDuplicate = duplicateBooks.some((book) =>
        book.title.toLowerCase() === normalizedTitle.toLowerCase() && book.author.toLowerCase() === normalizedAuthor.toLowerCase()
    )

    if (isDuplicate) {
        errors.push({
            field: "duplicate",
            message: "Já existe um livro mockado com este título e autor."
        })
    }

    return errors
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
