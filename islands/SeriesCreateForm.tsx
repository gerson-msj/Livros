import { useEffect, useRef, useState } from "preact/hooks"
import AuthorPicker, { type SelectableAuthor } from "./AuthorPicker.tsx"
import BookDateInput from "./BookDateInput.tsx"
import FixedHeaderPage from "./FixedHeaderPage.tsx"
import { type PopupMessageResult, usePopupMessage } from "./PopupMessage.tsx"

type FeedbackTheme = "info" | "danger" | "success" | "warning"

interface SeriesDraftBook {
    title: string
    readingStartedOn: string
    readingFinishedOn: string
}

interface FeedbackState {
    theme: FeedbackTheme
    messages: string[]
}

const emptyBook = (): SeriesDraftBook => ({
    title: "",
    readingStartedOn: "",
    readingFinishedOn: ""
})

export default function SeriesCreateForm({ authors }: { authors: SelectableAuthor[] }) {
    const { popup, showMessage } = usePopupMessage()
    const formTopRef = useRef<HTMLDivElement>(null)
    const lastBookRef = useRef<HTMLElement | null>(null)
    const shouldScrollToLastBookRef = useRef(false)
    const [name, setName] = useState("")
    const [author, setAuthor] = useState<SelectableAuthor | null>(null)
    const [books, setBooks] = useState<SeriesDraftBook[]>([emptyBook()])
    const [isSaving, setIsSaving] = useState(false)
    const [feedback, setFeedback] = useState<FeedbackState>({
        theme: "info",
        messages: ["Preencha a serie e inclua pelo menos um livro."]
    })

    const hasChanges = name.trim() !== "" || author !== null || books.some(hasBookChanges)

    useEffect(() => {
        if (!shouldScrollToLastBookRef.current) {
            return
        }

        shouldScrollToLastBookRef.current = false
        lastBookRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        })
    }, [books.length])

    async function tryBack() {
        if (!hasChanges) {
            globalThis.location.href = "/biblioteca/series"
            return
        }

        const result: PopupMessageResult = await showMessage({
            title: "Alteracoes nao salvas",
            message: "Existem dados preenchidos nesta serie. Deseja voltar para a lista mesmo assim?",
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

    function updateBook(index: number, updates: Partial<SeriesDraftBook>) {
        setBooks((current) => current.map((book, currentIndex) => currentIndex === index ? { ...book, ...updates } : book))
    }

    function addBook() {
        const lastBook = books[books.length - 1]

        if (!lastBook.title.trim()) {
            setFeedback({
                theme: "warning",
                messages: ["Preencha o titulo do ultimo livro antes de adicionar outro."]
            })
            return
        }

        setBooks((current) => [...current, emptyBook()])
        shouldScrollToLastBookRef.current = true
        setFeedback({
            theme: "info",
            messages: ["Novo livro adicionado a serie."]
        })
    }

    async function removeLastBook() {
        if (books.length === 1) {
            setFeedback({
                theme: "danger",
                messages: ["A serie precisa manter ao menos um livro."]
            })
            return
        }

        const result = await showMessage({
            title: "Remover ultimo livro",
            message: "Deseja remover o ultimo livro da serie?",
            theme: "warning",
            positiveText: "Remover",
            negativeText: "Cancelar",
            showPositiveButton: true,
            showNegativeButton: true
        })

        if (result !== "ok") {
            return
        }

        setBooks((current) => current.slice(0, -1))
        setFeedback({
            theme: "info",
            messages: ["Ultimo livro removido da serie."]
        })
    }

    async function saveSeries() {
        if (isSaving) {
            return
        }

        const issues = validateSeries(name, author, books)

        if (issues.length > 0) {
            setFeedback({
                theme: "danger",
                messages: issues
            })
            return
        }

        setIsSaving(true)

        try {
            setFeedback({
                theme: "success",
                messages: [`"${name.trim()}" seria salva com ${books.filter((book) => book.title.trim()).length} livro(s).`]
            })

            await showMessage({
                title: "Serie salva",
                message: "Fluxo mockado validado. A persistencia real entra nas proximas fases.",
                theme: "success"
            })

            globalThis.location.href = "/biblioteca/series"
        } finally {
            setIsSaving(false)
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
                className="livros-book-form-page livros-series-create-page"
                headerClassName="livros-series-form-fixed-header"
                headerInnerClassName="livros-series-form-fixed-header-inner"
                contentClassName="livros-book-form-page-content livros-series-form-scroll-content"
                header={
                    <>
                        <header class="livros-page-title" aria-label="Titulo da pagina Nova serie">
                            <div class="livros-page-title-left">
                                <button class="livros-page-title-icon-button" type="button" aria-label="Voltar" onClick={tryBack}>
                                    <span class="icon">
                                        <i class="fas fa-chevron-left" aria-hidden="true"></i>
                                    </span>
                                </button>
                            </div>
                            <h1 class="title livros-page-title-heading">Nova serie</h1>
                            <div class="livros-page-title-right"></div>
                        </header>

                        <div class="livros-books-toolbar livros-book-form-toolbar" aria-label="Acoes do cadastro de serie">
                            <div class="livros-books-toolbar-text">
                                <p class="has-text-weight-semibold">Incluir serie</p>
                                <p class="is-size-7 has-text-grey">Informe nome, autor e os livros em ordem</p>
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
                            <input
                                class="input"
                                type="text"
                                value={name}
                                placeholder="Ex.: Cronicas de Eldoria"
                                onInput={(event) => setName(event.currentTarget.value)}
                            />
                        </div>
                    </div>

                    <AuthorPicker authors={authors} selectedAuthor={author} onSelect={setAuthor} />

                    <div class="livros-series-form-section">
                        <div class="livros-series-form-section-header">
                            <div>
                                <p class="has-text-weight-semibold">Livros da serie</p>
                                <p class="is-size-7 has-text-grey">A ordem e definida pela sequencia abaixo</p>
                            </div>
                        </div>

                        <div class="livros-series-form-books">
                            {books.map((book, index) => (
                                <SeriesDraftBookFields
                                    key={index}
                                    bookRef={index === books.length - 1 ? lastBookRef : undefined}
                                    book={book}
                                    onChange={(updates) => updateBook(index, updates)}
                                />
                            ))}
                        </div>

                        <div class="livros-series-form-list-actions" aria-label="Acoes da lista de livros da serie">
                            <div class="buttons">
                                <button class="button is-link is-light" type="button" onClick={addBook}>
                                    <span class="icon">
                                        <i class="fas fa-plus" aria-hidden="true"></i>
                                    </span>
                                    <span>Adicionar livro</span>
                                </button>
                                <button class="button is-danger is-light" type="button" onClick={removeLastBook}>
                                    Remover ultimo
                                </button>
                            </div>
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

function SeriesDraftBookFields(
    { book, onChange, bookRef }: {
        book: SeriesDraftBook
        onChange: (updates: Partial<SeriesDraftBook>) => void
        bookRef?: { current: HTMLElement | null }
    }
) {
    return (
        <section ref={bookRef} class="livros-series-form-book">
            <div class="field">
                <label class="label livros-book-form-label">Titulo do livro</label>
                <div class="control">
                    <input
                        class="input"
                        type="text"
                        value={book.title}
                        placeholder="Titulo do livro"
                        onInput={(event) => onChange({ title: event.currentTarget.value })}
                    />
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

function validateSeries(name: string, author: SelectableAuthor | null, books: SeriesDraftBook[]): string[] {
    const issues: string[] = []
    const titledBooks = books.map((book) => book.title.trim()).filter(Boolean)
    const normalizedTitles = titledBooks.map((title) => title.toLowerCase())

    if (name.trim().length < 2) {
        issues.push("Informe o nome da serie com pelo menos 2 caracteres.")
    }

    if (author === null) {
        issues.push("Selecione ou crie um autor.")
    }

    if (titledBooks.length === 0) {
        issues.push("Inclua ao menos um livro com titulo.")
    }

    if (new Set(normalizedTitles).size !== normalizedTitles.length) {
        issues.push("A mesma serie nao deve ter livros com titulos repetidos.")
    }

    return issues
}

function hasBookChanges(book: SeriesDraftBook): boolean {
    return book.title.trim() !== "" || book.readingStartedOn !== "" || book.readingFinishedOn !== ""
}

function getDateInputClass(value: string): string {
    return isCompleteDate(value) ? "" : "is-placeholder"
}

function isCompleteDate(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(value)
}
