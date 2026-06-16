import { AuthenticationService } from "../aplicacao/autenticacao_service.ts"
import { LibsqlSessionRepository, LibsqlUserRepository } from "./auth_repositories.ts"
import { SystemClock, UuidGenerator, WebCryptoSecretHasher } from "./crypto.ts"
import { getDatabaseClient } from "./database.ts"

export interface RequestServices {
    authentication: AuthenticationService
}

export function createRequestServices(): RequestServices {
    const client = getDatabaseClient()
    const users = new LibsqlUserRepository(client)
    const sessions = new LibsqlSessionRepository(client)

    return {
        authentication: new AuthenticationService(
            users,
            sessions,
            new WebCryptoSecretHasher(),
            new UuidGenerator(),
            new SystemClock()
        )
    }
}
