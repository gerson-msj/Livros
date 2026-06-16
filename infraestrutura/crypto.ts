import type { Clock, IdGenerator, SecretHasher } from "../aplicacao/autenticacao_service.ts"

const HASH_VERSION = "pbkdf2-sha256"
const HASH_ITERATIONS = 210000
const SALT_BYTES = 16
const KEY_BITS = 256

export class WebCryptoSecretHasher implements SecretHasher {
    async hash(secret: string): Promise<string> {
        const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
        const key = await deriveKey(secret, salt, HASH_ITERATIONS)

        return [
            HASH_VERSION,
            HASH_ITERATIONS.toString(),
            encodeBase64Url(salt),
            encodeBase64Url(key)
        ].join("$")
    }

    async verify(secret: string, hash: string): Promise<boolean> {
        const [version, iterationsText, saltText, expectedText] = hash.split("$")

        if (version !== HASH_VERSION || !iterationsText || !saltText || !expectedText) {
            return false
        }

        const iterations = Number(iterationsText)
        if (!Number.isInteger(iterations) || iterations <= 0) {
            return false
        }

        const salt = decodeBase64Url(saltText)
        const actual = await deriveKey(secret, salt, iterations)
        const expected = decodeBase64Url(expectedText)

        return timingSafeEqual(actual, expected)
    }
}

export class UuidGenerator implements IdGenerator {
    newId(): string {
        return crypto.randomUUID()
    }
}

export class SystemClock implements Clock {
    now(): Date {
        return new Date()
    }
}

async function deriveKey(secret: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
    const encodedSecret = new TextEncoder().encode(secret)
    const importedKey = await crypto.subtle.importKey("raw", encodedSecret, "PBKDF2", false, ["deriveBits"])
    const saltBuffer = new ArrayBuffer(salt.byteLength)
    new Uint8Array(saltBuffer).set(salt)
    const bits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            hash: "SHA-256",
            salt: saltBuffer,
            iterations
        },
        importedKey,
        KEY_BITS
    )

    return new Uint8Array(bits)
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array): boolean {
    if (left.length !== right.length) {
        return false
    }

    let difference = 0
    for (let index = 0; index < left.length; index++) {
        difference |= left[index] ^ right[index]
    }

    return difference === 0
}

function encodeBase64Url(bytes: Uint8Array): string {
    let binary = ""
    for (const byte of bytes) {
        binary += String.fromCharCode(byte)
    }

    return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")
}

function decodeBase64Url(value: string): Uint8Array {
    const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=")
    const binary = atob(padded)
    const bytes = new Uint8Array(binary.length)

    for (let index = 0; index < binary.length; index++) {
        bytes[index] = binary.charCodeAt(index)
    }

    return bytes
}
