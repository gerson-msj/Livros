export default interface ISessionValue {
    /** Id do usuário */
    userId: number

    /** Validade da sessão, UTC milliseconds */
    expiresTime: number
}
