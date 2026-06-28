import FixedHeaderPage from "./FixedHeaderPage.tsx"
import PageTitle from "./PageTitle.tsx"

export interface ListedBook {
    id: string
    title: string
    author: string
    readingStartedOn: string | null
    readingFinishedOn: string | null
}

export default function BooksList({ books }: { books: ListedBook[] }) {
    function openNewBook() {
        globalThis.location.href = "/biblioteca/livros/novo"
    }

    function openBook(book: ListedBook) {
        globalThis.location.href = `/biblioteca/livros/${book.id}`
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
                    <div class="livros-books-toolbar" aria-label="Ações da lista de livros">
                        <div class="livros-books-toolbar-text">
                            <p class="has-text-weight-semibold">Livros avulsos</p>
                            <p class="is-size-7 has-text-grey">Mais recentes primeiro</p>
                        </div>
                        <button class="button is-primary livros-books-new-button" type="button" onClick={openNewBook}>
                            <span class="icon">
                                <i class="fas fa-plus" aria-hidden="true"></i>
                            </span>
                            <span>Novo livro</span>
                        </button>
                    </div>
                </>
            }
        >
            {books.length === 0
                ? <EmptyBooksState onNewBook={openNewBook} />
                : (
                    <div class="livros-books-list" aria-label="Lista de livros avulsos">
                        {books.map((book) => <BookListItem key={book.id} book={book} onSelect={openBook} />)}
                    </div>
                )}
        </FixedHeaderPage>
    )
}

function BookListItem({ book, onSelect }: { book: ListedBook; onSelect: (book: ListedBook) => void }) {
    return (
        <button class="livros-book-item" type="button" onClick={() => onSelect(book)}>
            <span class="livros-book-item-main">
                <span class="livros-book-item-title">{book.title}</span>
                <span class="livros-book-item-author">{book.author}</span>
            </span>
            <span class="livros-book-item-dates">
                <BookDate label="Início" value={formatDate(book.readingStartedOn)} />
                <BookDate label="Conclusão" value={formatDate(book.readingFinishedOn)} />
            </span>
            <span class="icon livros-book-item-arrow" aria-hidden="true">
                <i class="fas fa-chevron-right"></i>
            </span>
        </button>
    )
}

function BookDate({ label, value }: { label: string; value: string | null }) {
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
            <p class="has-text-grey">Use o botão de inclusão para cadastrar o primeiro livro.</p>
            <button class="button is-primary is-light" type="button" onClick={onNewBook}>
                Novo livro
            </button>
        </div>
    )
}

function formatDate(value: string | null): string | null {
    if (value === null) {
        return null
    }

    const [year, month, day] = value.split("-")

    return `${day}/${month}/${year}`
}
