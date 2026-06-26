import { useRef, useState } from "preact/hooks"
import BookDateInput from "./BookDateInput.tsx"
import FixedHeaderPage from "./FixedHeaderPage.tsx"
import { type PopupMessageResult, usePopupMessage } from "./PopupMessage.tsx"

type FeedbackTheme = "info" | "danger" | "success"

export interface EditableSeriesBook {
    id: string
    title: string
    readingStartedOn: string | null
    readingFinishedOn: string | null
}

export interface EditableSeries {
    id: string
    name: string
    author: string
    books: EditableSeriesBook[]
}

interface EditableSeriesBookState {
    id: string
    title: string
    readingStartedOn: string
    readingFinishedOn: string
}

interface FeedbackState {
    theme: FeedbackTheme
    messages: string[]
}

export default function SeriesEditForm({ series }: { series: EditableSeries }) {
    const { popup, showMessage } = usePopupMessage()
    const formTopRef = useRef<HTMLDivElement>(null)
    const [books, setBooks] = useState<EditableSeriesBookState[]>(
        series.books.map((book) => ({
            id: book.id,
            title: book.title,
            readingStartedOn: book.readingStartedOn ?? "",
            readingFinishedOn: book.readingFinishedOn ?? ""
        }))
    )
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [feedback, setFeedback] = useState<FeedbackState>({
        theme: "info",
        messages: ["Altere somente as datas dos livros da serie."]
    })

    const hasChanges = books.some((book, index) =>
        book.readingStartedOn !== (series.books[index].readingStartedOn ?? "") ||
        book.readingFinishedOn !== (series.books[index].readingFinishedOn ?? "")
    )

    async function tryBack() {
        if (!hasChanges) {
            globalThis.location.href = "/biblioteca/series"
            return
        }

        const result: PopupMessageResult = await showMessage({
            title: "Alteracoes nao salvas",
            message: `As datas de "${series.name}" foram alteradas. Deseja voltar para a lista mesmo assim?`,
            theme: "warning",
            positiveText: "Permanecer",
            negativeText: "Voltar sem salvar",
            showPositiveButton: true,
            showNegativeButton: true
        })

        if (result === "negative") {
            globalThis.location.href = "/biblioteca/series"
        }
    }

    function updateBook(index: number, updates: Partial<EditableSeriesBookState>) {
        setBooks((current) => current.map((book, currentIndex) => currentIndex === index ? { ...book, ...updates } : book))
    }

    async function saveSeries() {
        if (isSaving || isDeleting) {
            return
        }

        setIsSaving(true)

        try {
            setFeedback({
                theme: "success",
                messages: [`As datas de "${series.name}" seriam salvas.`]
            })

            await showMessage({
                title: "Datas salvas",
                message: "Fluxo mockado validado. A atualizacao real entra nas proximas fases.",
                theme: "success"
            })

            globalThis.location.href = "/biblioteca/series"
        } finally {
            setIsSaving(false)
        }
    }

    async function deleteSeries() {
        if (isSaving || isDeleting) {
            return
        }

        const confirmation = await showMessage({
            title: "Excluir serie",
            message: `Deseja excluir "${series.name}" e todos os livros vinculados? Esta acao nao pode ser desfeita.`,
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
            await showMessage({
                title: "Serie excluida",
                message: "Fluxo mockado validado. A exclusao real entra nas proximas fases.",
                theme: "success"
            })

            globalThis.location.href = "/biblioteca/series"
        } finally {
            setIsDeleting(false)
        }
    }

    function scrollToTop() {
        formTopRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        })
    }

    return (
        <>
            <FixedHeaderPage
                className="livros-book-form-page livros-series-form-page"
                headerClassName="livros-series-form-fixed-header"
                headerInnerClassName="livros-series-form-fixed-header-inner"
                contentClassName="livros-book-form-page-content livros-series-form-scroll-content"
                header={
                    <>
                        <header class="livros-page-title" aria-label="Titulo da pagina Editar serie">
                            <div class="livros-page-title-left">
                                <button class="livros-page-title-icon-button" type="button" aria-label="Voltar" onClick={tryBack}>
                                    <span class="icon">
                                        <i class="fas fa-chevron-left" aria-hidden="true"></i>
                                    </span>
                                </button>
                            </div>
                            <h1 class="title livros-page-title-heading">Editar serie</h1>
                            <div class="livros-page-title-right">
                                <button
                                    class="livros-page-title-action-icon"
                                    type="button"
                                    aria-label="Excluir serie"
                                    onClick={deleteSeries}
                                    disabled={isDeleting}
                                >
                                    <span class="icon">
                                        <i class="fas fa-trash" aria-hidden="true"></i>
                                    </span>
                                </button>
                            </div>
                        </header>

                        <div class="livros-books-toolbar livros-book-form-toolbar" aria-label="Acoes da edicao de serie">
                            <div class="livros-books-toolbar-text">
                                <p class="has-text-weight-semibold">Editar datas</p>
                                <p class="is-size-7 has-text-grey">Serie, autor e titulos permanecem somente leitura</p>
                            </div>
                            <button
                                class={`button is-primary livros-books-new-button ${isSaving ? "is-loading" : ""}`}
                                type="button"
                                onClick={saveSeries}
                            >
                                <span class="icon">
                                    <i class="fas fa-check" aria-hidden="true"></i>
                                </span>
                                <span>Salvar</span>
                            </button>
                        </div>

                        <FeedbackMessage feedback={feedback} />
                    </>
                }
            >
                <div ref={formTopRef} class="livros-series-form-top-anchor"></div>
                <form
                    class="box livros-book-form"
                    onSubmit={(event) => {
                        event.preventDefault()
                        saveSeries()
                    }}
                >
                    <div class="field">
                        <label class="label livros-book-form-label">Nome da serie</label>
                        <div class="control">
                            <input class="input livros-book-readonly-input" type="text" value={series.name} readOnly />
                        </div>
                    </div>

                    <div class="field">
                        <label class="label livros-book-form-label">Autor</label>
                        <div class="control">
                            <input class="input livros-book-readonly-input" type="text" value={series.author} readOnly />
                        </div>
                    </div>

                    <p class="help livros-book-readonly-help">
                        Para corrigir nome, autor, titulos ou ordem, exclua a serie e cadastre novamente.
                    </p>

                    <div class="livros-series-form-section">
                        <div class="livros-series-form-section-header">
                            <div>
                                <p class="has-text-weight-semibold">Livros da serie</p>
                                <p class="is-size-7 has-text-grey">Apenas as datas podem ser alteradas</p>
                            </div>
                        </div>

                        <div class="livros-series-form-books">
                            {books.map((book, index) => (
                                <EditableSeriesBookFields
                                    key={book.id}
                                    book={book}
                                    onChange={(updates) => updateBook(index, updates)}
                                />
                            ))}
                        </div>

                        <div class="livros-series-form-list-actions" aria-label="Acoes da lista de livros da serie">
                            <button class="button is-text livros-series-form-top-link" type="button" onClick={scrollToTop}>
                                Voltar ao topo
                            </button>
                        </div>
                    </div>
                </form>
            </FixedHeaderPage>
            {popup}
        </>
    )
}

function EditableSeriesBookFields(
    { book, onChange }: { book: EditableSeriesBookState; onChange: (updates: Partial<EditableSeriesBookState>) => void }
) {
    return (
        <section class="livros-series-form-book">
            <div class="field">
                <label class="label livros-book-form-label">Titulo do livro</label>
                <div class="control">
                    <input class="input livros-book-readonly-input" type="text" value={book.title} readOnly />
                </div>
            </div>
            <div class="livros-book-form-dates">
                <BookDateInput
                    label="Inicio da leitura"
                    value={book.readingStartedOn}
                    class={getDateInputClass(book.readingStartedOn)}
                    onInput={(event) => onChange({ readingStartedOn: event.currentTarget.value })}
                />
                <BookDateInput
                    label="Conclusao da leitura"
                    value={book.readingFinishedOn}
                    class={getDateInputClass(book.readingFinishedOn)}
                    onInput={(event) => onChange({ readingFinishedOn: event.currentTarget.value })}
                />
            </div>
        </section>
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
