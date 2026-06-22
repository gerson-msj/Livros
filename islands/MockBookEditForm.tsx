import { useState } from "preact/hooks"
import MockBookDateInput from "./MockBookDateInput.tsx"
import { type PopupMessageResult, usePopupMessage } from "./PopupMessage.tsx"

interface MockEditableBook {
    id: string
    title: string
    author: string
    startedAt: string
    finishedAt: string
}

type FeedbackTheme = "info" | "danger" | "success"

interface FeedbackState {
    theme: FeedbackTheme
    message: string
}

const mockBooks: MockEditableBook[] = [
    { id: "vento-norte", title: "O Vento do Norte", author: "Marta Lins", startedAt: "2026-06-04", finishedAt: "" },
    { id: "cidade-papel", title: "A Cidade de Papel", author: "Helena Duarte", startedAt: "2026-05-18", finishedAt: "2026-06-02" },
    { id: "mapa-mar", title: "Mapa do Mar Sem Fim", author: "Caio Almeida", startedAt: "2026-05-01", finishedAt: "2026-05-14" },
    { id: "noite-clara", title: "Noite Clara", author: "Lia Moreira", startedAt: "2026-04-12", finishedAt: "" },
    { id: "jardim-silencioso", title: "O Jardim Silencioso", author: "Rafael Neves", startedAt: "", finishedAt: "2026-03-29" }
]

export default function MockBookEditForm({ bookId }: { bookId: string }) {
    const { popup, showMessage } = usePopupMessage()
    const book = mockBooks.find((candidate) => candidate.id === bookId) ?? mockBooks[0]
    const [startedAt, setStartedAt] = useState(book.startedAt)
    const [finishedAt, setFinishedAt] = useState(book.finishedAt)
    const [feedback, setFeedback] = useState<FeedbackState>({
        theme: "info",
        message: "Altere somente as datas para validar a edicao mockada."
    })

    const hasChanges = startedAt !== book.startedAt || finishedAt !== book.finishedAt

    async function tryBack() {
        if (!hasChanges) {
            globalThis.location.href = "/biblioteca/livros"
            return
        }

        const result: PopupMessageResult = await showMessage({
            title: "Alterações não salvas",
            message: `As datas de "${book.title}" foram alteradas neste fluxo mockado. Deseja voltar para a lista mesmo assim?`,
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
        if (!areDatesCoherent(startedAt, finishedAt)) {
            setFeedback({
                theme: "danger",
                message: "A data de início não pode ser posterior à data de conclusão."
            })
            return
        }

        setFeedback({
            theme: "success",
            message: "As datas seriam atualizadas neste fluxo real."
        })

        await showMessage({
            title: "Datas salvas",
            message: `Salvamento mockado das datas de "${book.title}" confirmado. A integracao real sera feita em fase comum.`,
            theme: "success"
        })

        globalThis.location.href = "/biblioteca/livros"
    }

    async function deleteMockBook() {
        const result = await showMessage({
            title: "Excluir livro",
            message: `Deseja excluir "${book.title}"? Esta acao removeria o livro da sua biblioteca no fluxo real.`,
            theme: "danger",
            positiveText: "Excluir",
            negativeText: "Cancelar",
            showPositiveButton: true,
            showNegativeButton: true
        })

        if (result !== "ok") {
            return
        }

        await showMessage({
            title: "Livro excluido",
            message: `Exclusao mockada de "${book.title}" confirmada.`,
            theme: "success"
        })

        globalThis.location.href = "/biblioteca/livros"
    }

    return (
        <>
            <div class="livros-book-form-page">
                <div class="livros-book-form-page-content">
                    <header class="livros-page-title" aria-label="Titulo da pagina Editar livro">
                        <div class="livros-page-title-left">
                            <button class="livros-page-title-icon-button" type="button" aria-label="Voltar" onClick={tryBack}>
                                <span class="icon">
                                    <i class="fas fa-chevron-left" aria-hidden="true"></i>
                                </span>
                            </button>
                        </div>
                        <h1 class="title livros-page-title-heading">Editar livro</h1>
                        <div class="livros-page-title-right">
                            <button class="livros-page-title-action-icon" type="button" aria-label="Excluir livro" onClick={deleteMockBook}>
                                <span class="icon">
                                    <i class="fas fa-trash" aria-hidden="true"></i>
                                </span>
                            </button>
                        </div>
                    </header>

                    <div class="livros-books-toolbar livros-book-form-toolbar" aria-label="Acoes da edicao de livro">
                        <div class="livros-books-toolbar-text">
                            <p class="has-text-weight-semibold">Edicao mockada</p>
                            <p class="is-size-7 has-text-grey">Titulo e autor ficam bloqueados; somente datas mudam</p>
                        </div>
                        <button class="button is-primary livros-books-new-button" type="button" onClick={saveMockBook}>
                            <span class="icon">
                                <i class="fas fa-check" aria-hidden="true"></i>
                            </span>
                            <span>Salvar datas</span>
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
                            <label class="label livros-book-form-label">Titulo</label>
                            <div class="control">
                                <input class="input livros-book-readonly-input" type="text" value={book.title} readOnly />
                            </div>
                            <p class="help livros-book-readonly-help">Titulo nao pode ser alterado depois do cadastro.</p>
                        </div>

                        <div class="field">
                            <label class="label livros-book-form-label">Autor</label>
                            <div class="control">
                                <input class="input livros-book-readonly-input" type="text" value={book.author} readOnly />
                            </div>
                            <p class="help livros-book-readonly-help">Autor nao pode ser alterado depois do cadastro.</p>
                        </div>

                        <div class="livros-book-form-dates">
                            <MockBookDateInput
                                label="Inicio da leitura"
                                value={startedAt}
                                class={getDateInputClass(startedAt)}
                                onInput={(event) => {
                                    setStartedAt(event.currentTarget.value)
                                    setFeedback({ theme: "info", message: "Continue ajustando as datas mockadas." })
                                }}
                            />
                            <MockBookDateInput
                                label="Conclusao da leitura"
                                value={finishedAt}
                                class={getDateInputClass(finishedAt)}
                                onInput={(event) => {
                                    setFinishedAt(event.currentTarget.value)
                                    setFeedback({ theme: "info", message: "Continue ajustando as datas mockadas." })
                                }}
                            />
                        </div>

                        <div class="livros-book-form-preview">
                            <p class="has-text-weight-semibold">Previa mockada</p>
                            <dl>
                                <div>
                                    <dt>Livro</dt>
                                    <dd>{book.title}</dd>
                                </div>
                                <div>
                                    <dt>Autor</dt>
                                    <dd>{book.author}</dd>
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
            {feedback.message}
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

function areDatesCoherent(startedAt: string, finishedAt: string): boolean {
    if (!isCompleteDate(startedAt) || !isCompleteDate(finishedAt)) {
        return true
    }

    return startedAt <= finishedAt
}

function isCompleteDate(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(value)
}
