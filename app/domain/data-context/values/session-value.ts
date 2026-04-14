export default interface ISessionValue {
    /** Id do usuário */
    userId: number

    /** Tempo em milissegundos (UTC Unix Epoch) */
    expires: number
}
