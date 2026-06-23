import { AuthenticationService } from "../aplicacao/autenticacao_service.ts"
import { BooksService } from "../aplicacao/livros_service.ts"
import { LibsqlSessionRepository, LibsqlUserRepository } from "./auth_repositories.ts"
import { LibsqlAuthorRepository, LibsqlStandaloneBookRepository } from "./book_repositories.ts"
import { SystemClock, UuidGenerator, WebCryptoSecretHasher } from "./crypto.ts"
import { getDatabaseClient } from "./database.ts"

export interface RequestServices {
    authentication: AuthenticationService
    books: BooksService
}

export function createRequestServices(): RequestServices {
    const client = getDatabaseClient()
    const users = new LibsqlUserRepository(client)
    const sessions = new LibsqlSessionRepository(client)
    const authors = new LibsqlAuthorRepository(client)
    const books = new LibsqlStandaloneBookRepository(client)
    const ids = new UuidGenerator()
    const clock = new SystemClock()

    return {
        authentication: new AuthenticationService(
            users,
            sessions,
            new WebCryptoSecretHasher(),
            ids,
            clock
        ),
        books: new BooksService(authors, books, ids, clock)
    }
}
