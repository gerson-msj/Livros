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

interface SaveResponse {
    ok: boolean
    messages: string[]
    redirectTo?: string
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
        messages: ["Altere somente as datas dos livros da série."]
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
            title: "Alterações não salvas",
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
            const form = new FormData()
            for (const book of books) {
                form.append("bookId", book.id)
                form.append("bookReadingStartedOn", book.readingStartedOn)
                form.append("bookReadingFinishedOn", book.readingFinishedOn)
            }

            const response = await fetch(`/biblioteca/series/${series.id}`, {
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
                title: "Datas salvas",
                message: result.messages[0] ?? "Datas salvas com sucesso.",
                theme: "success"
            })

            globalThis.location.href = result.redirectTo ?? "/biblioteca/series"
        } finally {
            setIsSaving(false)
        }
    }

    async function deleteSeries() {
        if (isSaving || isDeleting) {
            return
        }

        const confirmation = await showMessage({
            title: "Excluir série",
            message: `Deseja excluir "${series.name}" e todos os livros vinculados? Esta ação não pode ser desfeita.`,
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
            const response = await fetch(`/biblioteca/series/${series.id}`, {
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
                title: "Série excluída",
                message: result.messages[0] ?? "Série excluída com sucesso.",
                theme: "success"
            })

            globalThis.location.href = result.redirectTo ?? "/biblioteca/series"
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
                        <header class="livros-page-title" aria-label="Título da página Editar série">
                            <div class="livros-page-title-left">
                                <button class="livros-page-title-icon-button" type="button" aria-label="Voltar" onClick={tryBack}>
                                    <span class="icon">
                                        <i class="fas fa-chevron-left" aria-hidden="true"></i>
                                    </span>
                                </button>
                            </div>
                            <h1 class="title livros-page-title-heading">Editar série</h1>
                            <div class="livros-page-title-right">
                                <button
                                    class="livros-page-title-action-icon"
                                    type="button"
                                    aria-label="Excluir série"
                                    onClick={deleteSeries}
                                    disabled={isDeleting}
                                >
                                    <span class="icon">
                                        <i class="fas fa-trash" aria-hidden="true"></i>
                                    </span>
                                </button>
                            </div>
                        </header>

                        <div class="livros-books-toolbar livros-book-form-toolbar" aria-label="Ações da edição de série">
                            <div class="livros-books-toolbar-text">
                                <p class="has-text-weight-semibold">Editar datas</p>
                                <p class="is-size-7 has-text-grey">Série, autor e títulos permanecem somente leitura</p>
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
                        <label class="label livros-book-form-label">Nome da série</label>
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
                        Para corrigir nome, autor, títulos ou ordem, exclua a série e cadastre novamente.
                    </p>

                    <div class="livros-series-form-section">
                        <div class="livros-series-form-section-header">
                            <div>
                                <p class="has-text-weight-semibold">Livros da série</p>
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

                        <div class="livros-series-form-list-actions" aria-label="Ações da lista de livros da série">
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
                <label class="label livros-book-form-label">Título do livro</label>
                <div class="control">
                    <input class="input livros-book-readonly-input" type="text" value={book.title} readOnly />
                </div>
            </div>
            <div class="livros-book-form-dates">
                <BookDateInput
                    label="Início da leitura"
                    value={book.readingStartedOn}
                    class={getDateInputClass(book.readingStartedOn)}
                    onInput={(event) => onChange({ readingStartedOn: event.currentTarget.value })}
                />
                <BookDateInput
                    label="Conclusão da leitura"
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
        <div class={`notification is-${feedback.theme} livros-books-feedback livros-book-form-feedback`} role="status">
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
