export default class CryptService {
    public static async criptografarSenha(senha: string): Promise<string> {
        const saltArray = this.createArrayBuffer(16)
        const salt = this.bufferToBase64(saltArray)
        const senhaData = this.encode(`${senha}+${salt}`)
        const senhaBuffer = await crypto.subtle.digest("SHA-256", senhaData)
        const senhaCrypto = this.bufferToBase64(senhaBuffer)
        return `${salt}.${senhaCrypto}`
    }

    public static async validarSenha(senha: string, senhaSH: string): Promise<boolean> {
        const [salt, senhaCrypto] = senhaSH.split(".")
        const senhaData = this.encode(`${senha}+${salt}`)
        const senhaBuffer = await crypto.subtle.digest("SHA-256", senhaData)
        const senhaCryptoComparacao = this.bufferToBase64(senhaBuffer)
        return senhaCrypto === senhaCryptoComparacao
    }

    public static async criarToken<T>(sub: T, expDias: number = 7): Promise<string> {
        const key = await this.getTokenKey()

        const header = this.stringToBase64(JSON.stringify({ "alg": "HS256", "typ": "JWT" }))

        const fatorDia = 24 * 60 * 60 * 1000
        const fatorMinuto = 60 * 1000

        const dataAtual = new Date() // Data atual.
        const msAtual = dataAtual.valueOf() // Milissegundos desde epoch (01/01/1970) até a data atual.
        const msDias = expDias * fatorDia // Milissegundos dos dias informados.
        // Milissegundos deste epoch até a data de expiração, arredondando nos minutos.
        const msExp = Math.floor((msAtual + msDias) / fatorMinuto) * fatorMinuto
        const exp = Math.floor(msExp / 1000) // Exp = valor em segundos desde epoch até a data de expiração.

        const payload = this.stringToBase64(JSON.stringify({ "sub": sub, "exp": exp }))

        const data = this.encode(`${header}.${payload}`)

        const signArray = await crypto.subtle.sign("HMAC", key, data)
        const sign = this.bufferToBase64(signArray)

        const token = `${header}.${payload}.${sign}`
        return token
    }

    public static async tokenValido(token: string): Promise<boolean> {
        const [header, payload, sign] = token.split(".")
        const key = await this.getTokenKey()
        const data = this.encode(`${header}.${payload}`)
        const signArray = this.base64ToBuffer(sign)
        const valido = await crypto.subtle.verify("HMAC", key, signArray, data)
        return valido
    }

    /**
     * Verifica se o token está expirado ou se ainda pode ser renovado.
     * @param token Token para validação da expiração.
     * @param renovacaoimInenteDias Se informado, indica se o token ainda pode ser renovado, quando nulo, apenas verifica se o token está expirado.
     * @returns Indicador de expiração ou indicador de possibilidade de renovação.
     */
    public static tokenExpirado(token: string, renovacaoimInenteDias?: number): boolean {
        const payload: { sub: object; exp: number } = JSON.parse(atob(token.split(".")[1]))
        const currTime = Math.floor((new Date()).getTime() / 1000)
        let resultado = currTime > payload.exp
        if (renovacaoimInenteDias && !resultado) {
            const fatorDia = 24 * 60 * 60 * 1000
            payload.exp -= renovacaoimInenteDias * Math.floor(fatorDia / 1000)
            resultado = currTime > payload.exp
        }

        return resultado
    }

    public static tokenSub<T>(token: string): T {
        const payload: { sub: T; exp: number } = JSON.parse(atob(token.split(".")[1]))
        return payload.sub
    }

    private static getTokenKey(): Promise<CryptoKey> {
        const keyRaw = Deno.env.get("TOKENRAWKEY")! // ?? "Drp-lS7M0GIRfaMzmhIbLLfeoak4ANIA8Ennj3qDZZyWNvr9laro3rA1foluO466FwKOk6HZ_O03InFjO_ABag";
        const keyData = this.encode(keyRaw)
        const algorithm: HmacKeyGenParams = { name: "HMAC", hash: { name: "SHA-256" } }
        return crypto.subtle.importKey("raw", keyData, algorithm, false, ["sign", "verify"])
    }

    private static encode(x: string): Uint8Array<ArrayBuffer> {
        const encoder = new TextEncoder()
        return encoder.encode(x)
    }

    private static bufferToBase64(arrayBuffer: ArrayBuffer): string {
        const base64 = btoa(Array.from(new Uint8Array(arrayBuffer)).map((b) => String.fromCharCode(b)).join(""))
        return base64.replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_")
    }

    private static stringToBase64(text: string): string {
        const base64 = btoa(text)
        const base64Safe = base64.replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_")
        return base64Safe
    }

    private static base64ToBuffer(base64: string): ArrayBuffer {
        const base64Unsafe = base64.replaceAll("-", "+").replaceAll("_", "/")
        return new Uint8Array(atob(base64Unsafe).split("").map((c) => c.charCodeAt(0))).buffer
    }

    private static createArrayBuffer(size: number): ArrayBuffer {
        const array = new Uint8Array(size)
        crypto.getRandomValues(array)
        return array.buffer
    }
}
