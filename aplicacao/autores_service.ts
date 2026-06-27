import type { Author } from "../dominio/autores.ts"
import { normalizeSearchText } from "../dominio/autores.ts"
import type { Clock, IdGenerator } from "./autenticacao_service.ts"

export interface AuthorRepository {
    listByUser(userId: string): Promise<Author[]>
    findByUserAndNormalizedName(userId: string, normalizedName: string): Promise<Author | null>
    create(input: CreateAuthorInput): Promise<Author>
}

export interface CreateAuthorInput {
    id: string
    userId: string
    name: string
    normalizedName: string
    createdAt: Date
}

export class AuthorsService {
    constructor(
        private readonly authors: AuthorRepository,
        private readonly ids: IdGenerator,
        private readonly clock: Clock
    ) {}

    listAuthors(userId: string): Promise<Author[]> {
        return this.authors.listByUser(userId)
    }

    async findOrCreateAuthor(userId: string, name: string, createdAt = this.clock.now()): Promise<Author> {
        const normalizedName = normalizeSearchText(name)
        const existingAuthor = await this.authors.findByUserAndNormalizedName(userId, normalizedName)

        if (existingAuthor !== null) {
            return existingAuthor
        }

        return await this.authors.create({
            id: this.ids.newId(),
            userId,
            name,
            normalizedName,
            createdAt
        })
    }
}
