import FixedHeaderPage from "./FixedHeaderPage.tsx"
import PageTitle from "./PageTitle.tsx"

export interface ListedSeriesBook {
    title: string
    order: number
    readingStartedOn: string | null
    readingFinishedOn: string | null
}

export interface ListedSeries {
    id: string
    name: string
    author: string
    createdAtLabel: string
    books: ListedSeriesBook[]
}

export default function SeriesList({ series }: { series: ListedSeries[] }) {
    function openNewSeries() {
        globalThis.location.href = "/biblioteca/series/nova"
    }

    function openSeries(item: ListedSeries) {
        globalThis.location.href = `/biblioteca/series/${item.id}`
    }

    return (
        <FixedHeaderPage
            className="livros-books-page"
            headerClassName="livros-books-fixed-header"
            headerInnerClassName="livros-books-fixed-header-inner"
            contentClassName="livros-books-page-list"
            header={
                <>
                    <PageTitle title="Series" leftMode="back" backHref="/biblioteca" />
                    <div class="livros-books-toolbar" aria-label="Acoes da lista de series">
                        <div class="livros-books-toolbar-text">
                            <p class="has-text-weight-semibold">Series de livros</p>
                            <p class="is-size-7 has-text-grey">Mais recentes primeiro</p>
                        </div>
                        <button class="button is-primary livros-books-new-button" type="button" onClick={openNewSeries}>
                            <span class="icon">
                                <i class="fas fa-plus" aria-hidden="true"></i>
                            </span>
                            <span>Nova serie</span>
                        </button>
                    </div>
                </>
            }
        >
            <p class="livros-series-mock-note">Dados temporarios para validar a experiencia visual.</p>
            {series.length === 0
                ? <EmptySeriesState onNewSeries={openNewSeries} />
                : (
                    <div class="livros-series-list" aria-label="Lista de series de livros">
                        {series.map((item) => <SeriesListItem key={item.id} item={item} onSelect={openSeries} />)}
                    </div>
                )}
        </FixedHeaderPage>
    )
}

function SeriesListItem({ item, onSelect }: { item: ListedSeries; onSelect: (item: ListedSeries) => void }) {
    const sortedBooks = [...item.books].sort((first, second) => first.order - second.order)

    return (
        <button class="livros-series-item" type="button" onClick={() => onSelect(item)}>
            <span class="livros-series-item-header">
                <span class="livros-series-item-main">
                    <span class="livros-series-item-title">{item.name}</span>
                    <span class="livros-series-item-author">{item.author}</span>
                </span>
                <span class="livros-series-item-meta">{item.createdAtLabel}</span>
                <span class="icon livros-book-item-arrow" aria-hidden="true">
                    <i class="fas fa-chevron-right"></i>
                </span>
            </span>
            <span class="livros-series-books" aria-label={`Livros da serie ${item.name}`}>
                {sortedBooks.map((book) => <SeriesBookItem key={`${item.id}-${book.order}`} book={book} />)}
            </span>
        </button>
    )
}

function SeriesBookItem({ book }: { book: ListedSeriesBook }) {
    return (
        <span class="livros-series-book">
            <span class="livros-series-book-main">
                <span class="livros-series-book-title">{book.title}</span>
                <span class="livros-series-book-dates">
                    <span>Inicio: {formatDate(book.readingStartedOn) ?? "Em aberto"}</span>
                    <span>Conclusao: {formatDate(book.readingFinishedOn) ?? "Em aberto"}</span>
                </span>
            </span>
        </span>
    )
}

function EmptySeriesState({ onNewSeries }: { onNewSeries: () => void }) {
    return (
        <div class="livros-books-empty">
            <span class="icon livros-books-empty-icon" aria-hidden="true">
                <i class="fas fa-layer-group"></i>
            </span>
            <p class="has-text-weight-semibold">Nenhuma serie cadastrada.</p>
            <p class="has-text-grey">Use o botao de inclusao para cadastrar a primeira serie.</p>
            <button class="button is-primary is-light" type="button" onClick={onNewSeries}>
                Nova serie
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
