import { useMemo, useState } from "preact/hooks"

export interface SelectableAuthor {
    id: string
    name: string
    isNew?: boolean
}

interface AuthorPickerProps {
    authors: SelectableAuthor[]
    selectedAuthor: SelectableAuthor | null
    onSelect(author: SelectableAuthor): void
}

export default function AuthorPicker({ authors, selectedAuthor, onSelect }: AuthorPickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState("")
    const normalizedSearch = search.trim().toLowerCase()
    const filteredAuthors = useMemo(() => {
        if (!normalizedSearch) {
            return authors
        }

        return authors.filter((author) => author.name.toLowerCase().includes(normalizedSearch))
    }, [authors, normalizedSearch])

    const showCreateOption = normalizedSearch.length > 0 && !authors.some((author) => author.name.toLowerCase() === normalizedSearch)

    function selectAuthor(author: SelectableAuthor) {
        onSelect(author)
        setSearch("")
        setIsOpen(false)
    }

    function selectNewAuthor() {
        const name = search.trim()

        if (!name) {
            return
        }

        selectAuthor({
            id: `novo-${name.toLowerCase().replace(/\s+/g, "-")}`,
            name,
            isNew: true
        })
    }

    return (
        <>
            <div class="field">
                <label class="label livros-book-form-label">Autor</label>
                <div class="control has-icons-right">
                    <input
                        type="text"
                        class="input livros-author-picker-input"
                        value={selectedAuthor?.name ?? ""}
                        placeholder="Selecione ou crie um autor"
                        readOnly
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={(event) => {
                            if (["Tab", "Shift", "Control", "Alt", "Meta", "Escape", "ArrowLeft", "ArrowRight"].includes(event.key)) {
                                return
                            }

                            event.preventDefault()
                            setIsOpen(true)
                        }}
                    />
                    <button
                        class="icon is-small is-right livros-field-icon-button"
                        type="button"
                        aria-label="Pesquisar autor"
                        onClick={() => setIsOpen(true)}
                    >
                        <i class="fas fa-search" aria-hidden="true"></i>
                    </button>
                </div>
            </div>

            {isOpen && (
                <div
                    class="modal is-active livros-author-picker-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="author-picker-title"
                >
                    <button class="modal-background" type="button" aria-label="Fechar pesquisa de autores" onClick={() => setIsOpen(false)}>
                    </button>
                    <div class="modal-content livros-author-picker-content">
                        <article class="box livros-author-picker-box">
                            <div class="field">
                                <label id="author-picker-title" class="label livros-book-form-label">Autores</label>
                                <div class="control has-icons-left">
                                    <input
                                        class="input"
                                        type="text"
                                        value={search}
                                        placeholder="Pesquisar"
                                        autoFocus
                                        onInput={(event) => setSearch(event.currentTarget.value)}
                                    />
                                    <span class="icon is-small is-left">
                                        <i class="fas fa-search" aria-hidden="true"></i>
                                    </span>
                                </div>
                            </div>

                            <aside class="menu livros-author-picker-menu">
                                <ul class="menu-list livros-author-picker-list">
                                    {showCreateOption && (
                                        <li>
                                            <button
                                                class="livros-author-picker-option livros-author-picker-create"
                                                type="button"
                                                onClick={selectNewAuthor}
                                            >
                                                Criar "{search.trim()}"
                                            </button>
                                        </li>
                                    )}
                                    {filteredAuthors.map((author) => (
                                        <li key={author.id}>
                                            <button class="livros-author-picker-option" type="button" onClick={() => selectAuthor(author)}>
                                                {author.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </aside>
                        </article>
                    </div>
                </div>
            )}
        </>
    )
}
