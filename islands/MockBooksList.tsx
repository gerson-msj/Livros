import { useState } from "preact/hooks"
import FixedHeaderPage from "./FixedHeaderPage.tsx"
import PageTitle from "./PageTitle.tsx"

interface MockBook {
    id: string
    title: string
    author: string
    startedAt?: string
    finishedAt?: string
}

const mockBooks: MockBook[] = [
    { id: "vento-norte", title: "O Vento do Norte", author: "Marta Lins", startedAt: "04/06/2026" },
    { id: "cidade-papel", title: "A Cidade de Papel", author: "Helena Duarte", startedAt: "18/05/2026", finishedAt: "02/06/2026" },
    { id: "mapa-mar", title: "Mapa do Mar Sem Fim", author: "Caio Almeida", startedAt: "01/05/2026", finishedAt: "14/05/2026" },
    { id: "noite-clara", title: "Noite Clara", author: "Lia Moreira", startedAt: "12/04/2026" },
    { id: "jardim-silencioso", title: "O Jardim Silencioso", author: "Rafael Neves", finishedAt: "29/03/2026" },
    { id: "relogio-vidro", title: "Relogio de Vidro", author: "Beatriz Costa", startedAt: "07/03/2026", finishedAt: "21/03/2026" },
    { id: "estrada-antiga", title: "A Estrada Antiga", author: "Marcos Vieira", startedAt: "11/02/2026", finishedAt: "28/02/2026" },
    { id: "caderno-azul", title: "Caderno Azul", author: "Renata Nunes", startedAt: "22/01/2026", finishedAt: "03/02/2026" },
    { id: "casa-colina", title: "A Casa na Colina", author: "Daniel Freitas", startedAt: "04/01/2026", finishedAt: "18/01/2026" },
    { id: "cartas-inverno", title: "Cartas de Inverno", author: "Sofia Prado", startedAt: "12/12/2025", finishedAt: "27/12/2025" },
    { id: "linha-dagua", title: "Linha d'Agua", author: "Tereza Campos", startedAt: "20/11/2025", finishedAt: "04/12/2025" },
    { id: "ultimo-farol", title: "O Ultimo Farol", author: "Miguel Rocha", startedAt: "02/11/2025", finishedAt: "16/11/2025" }
]

export default function MockBooksList() {
    const [showEmpty, setShowEmpty] = useState(false)
    const [message, setMessage] = useState("Dados mockados para validar a lista antes da integracao real.")
    const books = showEmpty ? [] : mockBooks

    function simulateNewBook() {
        setMessage("Fluxo de novo livro simulado. A tela de inclusao sera definida na F03.")
    }

    function simulateEdit(book: MockBook) {
        setMessage(`Edicao simulada para "${book.title}". A edicao de datas sera definida na F04.`)
    }

    return (
        <FixedHeaderPage
            className="livros-books-page"
            headerClassName="livros-books-fixed-header"
            headerInnerClassName="livros-books-fixed-header-inner"
            contentClassName="livros-books-page-list"
            header={
                <>
                    <PageTitle title="Livros" leftMode="back" backHref="/biblioteca" />
                    <div class="livros-books-toolbar" aria-label="Acoes da lista de livros">
                        <div class="livros-books-toolbar-text">
                            <p class="has-text-weight-semibold">Livros avulsos</p>
                            <p class="is-size-7 has-text-grey">Mais recentes primeiro</p>
                        </div>
                        <button class="button is-primary livros-books-new-button" type="button" onClick={simulateNewBook}>
                            <span class="icon">
                                <i class="fas fa-plus" aria-hidden="true"></i>
                            </span>
                            <span>Novo livro</span>
                        </button>
                    </div>

                    <div class="livros-books-state-controls" aria-label="Estados mockados da lista">
                        <button
                            class={`button is-small ${showEmpty ? "" : "is-link is-light"}`}
                            type="button"
                            aria-pressed={!showEmpty}
                            onClick={() => {
                                setShowEmpty(false)
                                setMessage("Lista preenchida mockada para validar rolagem e selecao.")
                            }}
                        >
                            Lista preenchida
                        </button>
                        <button
                            class={`button is-small ${showEmpty ? "is-link is-light" : ""}`}
                            type="button"
                            aria-pressed={showEmpty}
                            onClick={() => {
                                setShowEmpty(true)
                                setMessage("Lista vazia mockada para validar o estado inicial do usuario.")
                            }}
                        >
                            Lista vazia
                        </button>
                    </div>

                    <div class="notification is-info is-light livros-books-feedback" role="status">
                        {message}
                    </div>
                </>
            }
        >
            {books.length === 0
                ? <EmptyBooksState onNewBook={simulateNewBook} />
                : (
                    <div class="livros-books-list" aria-label="Lista mockada de livros avulsos">
                        {books.map((book) => <BookListItem key={book.id} book={book} onSelect={simulateEdit} />)}
                    </div>
                )}
        </FixedHeaderPage>
    )
}

function BookListItem({ book, onSelect }: { book: MockBook; onSelect: (book: MockBook) => void }) {
    return (
        <button class="livros-book-item" type="button" onClick={() => onSelect(book)}>
            <span class="livros-book-item-main">
                <span class="livros-book-item-title">{book.title}</span>
                <span class="livros-book-item-author">{book.author}</span>
            </span>
            <span class="livros-book-item-dates">
                <BookDate label="Inicio" value={book.startedAt} />
                <BookDate label="Conclusao" value={book.finishedAt} />
            </span>
            <span class="icon livros-book-item-arrow" aria-hidden="true">
                <i class="fas fa-chevron-right"></i>
            </span>
        </button>
    )
}

function BookDate({ label, value }: { label: string; value?: string }) {
    return (
        <span class="livros-book-date">
            <span class="livros-book-date-label">{label}</span>
            <span>{value ?? "Em aberto"}</span>
        </span>
    )
}

function EmptyBooksState({ onNewBook }: { onNewBook: () => void }) {
    return (
        <div class="livros-books-empty">
            <span class="icon livros-books-empty-icon" aria-hidden="true">
                <i class="fas fa-book-open"></i>
            </span>
            <p class="has-text-weight-semibold">Nenhum livro avulso cadastrado.</p>
            <p class="has-text-grey">Use o botao de inclusao para simular o primeiro cadastro.</p>
            <button class="button is-primary is-light" type="button" onClick={onNewBook}>
                Simular novo livro
            </button>
        </div>
    )
}
