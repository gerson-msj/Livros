import { AuthenticationService } from "../aplicacao/autenticacao_service.ts"
import { AuthorsService } from "../aplicacao/autores_service.ts"
import { BooksService } from "../aplicacao/livros_service.ts"
import { SeriesService } from "../aplicacao/series_service.ts"
import { LibsqlSessionRepository, LibsqlUserRepository } from "./auth_repositories.ts"
import { LibsqlAuthorRepository } from "./author_repositories.ts"
import { LibsqlStandaloneBookRepository } from "./book_repositories.ts"
import { SystemClock, UuidGenerator, WebCryptoSecretHasher } from "./crypto.ts"
import { getDatabaseClient } from "./database.ts"
import { LibsqlBookSeriesRepository } from "./series_repositories.ts"

export interface RequestServices {
    authentication: AuthenticationService
    authors: AuthorsService
    books: BooksService
    series: SeriesService
}

export function createRequestServices(): RequestServices {
    const client = getDatabaseClient()
    const users = new LibsqlUserRepository(client)
    const sessions = new LibsqlSessionRepository(client)
    const authors = new LibsqlAuthorRepository(client)
    const books = new LibsqlStandaloneBookRepository(client)
    const series = new LibsqlBookSeriesRepository(client)
    const ids = new UuidGenerator()
    const clock = new SystemClock()
    const authorsService = new AuthorsService(authors, ids, clock)

    return {
        authentication: new AuthenticationService(
            users,
            sessions,
            new WebCryptoSecretHasher(),
            ids,
            clock
        ),
        authors: authorsService,
        books: new BooksService(authorsService, books, ids, clock),
        series: new SeriesService(authorsService, series, ids, clock)
    }
}
